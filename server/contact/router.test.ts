import express from "express";
import { createServer, request as httpRequest, type Server } from "node:http";
import { gzipSync } from "node:zlib";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTACT_MAX_IN_FLIGHT_NOTIFICATIONS,
  CONTACT_MAX_IN_FLIGHT_REQUESTS,
  CONTACT_REQUESTS_PER_MINUTE,
  createContactRouter,
  type ContactNotifier,
} from "./router";

const valid = {
  name: "Alex Chen",
  email: "alex@example.com",
  message: "Hello,\nPlease send me more information.",
};
const openServers: Server[] = [];

async function startServer(
  notify: ContactNotifier,
  options: { parseBeforeRouter?: boolean; onRequest?: () => void } = {}
): Promise<string> {
  const app = express();
  if (options.onRequest) {
    app.use((_req, _res, next) => {
      options.onRequest?.();
      next();
    });
  }
  if (options.parseBeforeRouter) app.use(express.json({ limit: "50mb" }));
  app.use("/api/contact", createContactRouter(notify));
  // Match the future intended ordering: the large parser is AFTER the router.
  app.use(express.json({ limit: "50mb" }));
  const server = createServer(app);
  openServers.push(server);
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("No TCP address");
  return `http://127.0.0.1:${address.port}/api/contact`;
}

function post(
  url: string,
  body: string = JSON.stringify(valid),
  headers: Record<string, string> = {}
): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

async function expectJson(
  response: Response,
  status: number,
  body: unknown
): Promise<void> {
  expect(response.status).toBe(status);
  expect(response.headers.get("content-type")).toMatch(/^application\/json\b/i);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(await response.json()).toEqual(body);
}

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    openServers.splice(0).map(
      server =>
        new Promise<void>((resolve, reject) => {
          server.close(error => (error ? reject(error) : resolve()));
          server.closeAllConnections();
        })
    )
  );
});

describe("contact router", () => {
  it("sends only validated, normalized fields and returns only ok on success", async () => {
    const notify = vi.fn(async () => {});
    const url = await startServer(notify);
    const response = await post(
      url,
      JSON.stringify({
        name: "  Alex Chen  ",
        email: " alex@example.com ",
        message: "  Hello,\nPlease send me more information.  ",
        website: "",
      })
    );
    await expectJson(response, 200, { ok: true });
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(valid);
  });

  it("does not report success before the notifier has resolved", async () => {
    let accept!: () => void;
    let started!: () => void;
    const startedPromise = new Promise<void>(resolve => {
      started = resolve;
    });
    const notify = vi.fn(
      () =>
        new Promise<void>(resolve => {
          accept = resolve;
          started();
        })
    );
    const url = await startServer(notify);
    const response = post(url);
    await startedPromise;
    expect(
      await Promise.race([
        response.then(() => "responded"),
        new Promise<string>(resolve =>
          setTimeout(() => resolve("waiting"), 40)
        ),
      ])
    ).toBe("waiting");
    accept();
    await expectJson(await response, 200, { ok: true });
  });

  it("returns a generic 503 when the notifier rejects, without leaking submitted data or errors to logs", async () => {
    const logs = [
      vi.spyOn(console, "log").mockImplementation(() => {}),
      vi.spyOn(console, "warn").mockImplementation(() => {}),
      vi.spyOn(console, "error").mockImplementation(() => {}),
    ];
    const secret = "secret-api-key-and-private-provider-error";
    const privateMessage = "private-contact-message";
    const notify = vi.fn(async () => {
      throw new Error(secret);
    });
    const url = await startServer(notify);
    const response = await post(
      url,
      JSON.stringify({ ...valid, message: privateMessage })
    );
    const text = await response.text();
    expect(response.status).toBe(503);
    expect(response.headers.get("content-type")).toMatch(
      /^application\/json\b/i
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(JSON.parse(text)).toEqual({
      ok: false,
      error: "Contact service unavailable.",
    });
    const output = text + JSON.stringify(logs.flatMap(log => log.mock.calls));
    for (const sensitive of [secret, privateMessage, valid.email, valid.name]) {
      expect(output).not.toContain(sensitive);
    }
  });

  it.each([
    { ...valid, email: "invalid-address" },
    { ...valid, email: "alex@example.com,attacker@example.com" },
    { ...valid, email: "alex@example.com\r\nBcc: attacker@example.com" },
    { ...valid, name: "Alex\nBcc: attacker@example.com" },
    { ...valid, name: "\tAlex" },
    { ...valid, message: " " },
    { ...valid, website: "a bot" },
    { ...valid, extra: "unexpected-private-value" },
    { ...valid, message: "m".repeat(4001) },
    [],
    null,
  ])(
    "rejects invalid fields and header injection without invoking the notifier",
    async input => {
      const notify = vi.fn(async () => {});
      const url = await startServer(notify);
      await expectJson(await post(url, JSON.stringify(input)), 400, {
        ok: false,
        error: "Invalid contact submission.",
      });
      expect(notify).not.toHaveBeenCalled();
    }
  );

  it("rejects malformed JSON, missing bodies, and non-JSON content", async () => {
    const notify = vi.fn(async () => {});
    const url = await startServer(notify);
    for (const body of ['{"name":', "", "[}"]) {
      await expectJson(await post(url, body), 400, {
        ok: false,
        error: "Invalid contact submission.",
      });
    }
    for (const contentType of [
      "text/plain",
      "application/x-www-form-urlencoded",
      "application/jsonp",
    ]) {
      await expectJson(
        await post(url, JSON.stringify(valid), { "content-type": contentType }),
        415,
        {
          ok: false,
          error: "Unsupported request format.",
        }
      );
    }
    const missing = await fetch(url, {
      method: "POST",
      body: JSON.stringify(valid),
    });
    await expectJson(missing, 415, {
      ok: false,
      error: "Unsupported request format.",
    });
    expect(notify).not.toHaveBeenCalled();
  });

  it("accepts exactly 16 KiB but rejects larger JSON, including chunked requests", async () => {
    const notify = vi.fn(async () => {});
    const url = await startServer(notify);
    const json = JSON.stringify(valid);
    const exactly16KiB = json + " ".repeat(16 * 1024 - Buffer.byteLength(json));
    await expectJson(await post(url, exactly16KiB), 200, { ok: true });
    await expectJson(await post(url, exactly16KiB + " "), 413, {
      ok: false,
      error: "Contact submission too large.",
    });

    const chunked = await new Promise<{
      status: number | undefined;
      headers: import("node:http").IncomingHttpHeaders;
      body: string;
    }>((resolve, reject) => {
      const req = httpRequest(
        url,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "transfer-encoding": "chunked",
          },
        },
        res => {
          let body = "";
          res.setEncoding("utf8");
          res.on("data", chunk => {
            body += chunk;
          });
          res.on("end", () =>
            resolve({ status: res.statusCode, headers: res.headers, body })
          );
        }
      );
      req.on("error", reject);
      req.write(exactly16KiB.slice(0, 8000));
      req.write(exactly16KiB.slice(8000));
      req.end(" ");
    });
    expect(chunked.status).toBe(413);
    expect(chunked.headers["cache-control"]).toBe("no-store");
    expect(chunked.headers["content-type"]).toMatch(/^application\/json\b/i);
    expect(JSON.parse(chunked.body)).toEqual({
      ok: false,
      error: "Contact submission too large.",
    });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("rejects compressed or unsupported-charset requests", async () => {
    const notify = vi.fn(async () => {});
    const url = await startServer(notify);
    const compressed = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-encoding": "gzip",
      },
      body: new Uint8Array(gzipSync(Buffer.from(JSON.stringify(valid)))),
    });
    await expectJson(compressed, 415, {
      ok: false,
      error: "Unsupported request format.",
    });
    await expectJson(
      await post(url, JSON.stringify(valid), {
        "content-type": "application/json; charset=iso-8859-1",
      }),
      415,
      {
        ok: false,
        error: "Unsupported request format.",
      }
    );
    expect(notify).not.toHaveBeenCalled();
  });

  it("rejects other methods and paths with JSON and no-store", async () => {
    const notify = vi.fn(async () => {});
    const url = await startServer(notify);
    for (const method of ["GET", "PUT", "DELETE", "OPTIONS"]) {
      const response = await fetch(url, { method });
      expect(response.headers.get("allow")).toBe("POST");
      await expectJson(response, 405, {
        ok: false,
        error: "Method not allowed.",
      });
    }
    await expectJson(await post(url + "/other"), 404, {
      ok: false,
      error: "Not found.",
    });
    expect(notify).not.toHaveBeenCalled();
  });

  it("fails closed if mounted after a body parser", async () => {
    const notify = vi.fn(async () => {});
    const url = await startServer(notify, { parseBeforeRouter: true });
    await expectJson(await post(url), 503, {
      ok: false,
      error: "Contact service unavailable.",
    });
    expect(notify).not.toHaveBeenCalled();
  });

  it("enforces a process-local global rate limit despite spoofed forwarding headers", async () => {
    const notify = vi.fn(async () => {});
    const url = await startServer(notify);
    for (let i = 0; i < CONTACT_REQUESTS_PER_MINUTE; i += 1) {
      const response = await post(url, "{}", {
        "x-forwarded-for": `198.51.100.${i}`,
      });
      expect(response.status).toBe(400);
      await response.body?.cancel();
    }
    const blocked = await post(url, JSON.stringify(valid), {
      "x-forwarded-for": "203.0.113.1",
    });
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    await expectJson(blocked, 429, {
      ok: false,
      error: "Too many requests. Please try again later.",
    });
    expect(notify).not.toHaveBeenCalled();
  });

  it("limits concurrent notifications even if a client disconnects", async () => {
    const releases: Array<() => void> = [];
    const notify = vi.fn(
      () =>
        new Promise<void>(resolve => {
          releases.push(resolve);
        })
    );
    const url = await startServer(notify);
    const controllers = Array.from(
      { length: CONTACT_MAX_IN_FLIGHT_NOTIFICATIONS },
      () => new AbortController()
    );
    const pending = controllers.map(controller =>
      fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(valid),
        signal: controller.signal,
      }).catch(() => undefined)
    );
    try {
      await vi.waitFor(() =>
        expect(notify).toHaveBeenCalledTimes(
          CONTACT_MAX_IN_FLIGHT_NOTIFICATIONS
        )
      );
      controllers[0].abort();
      await pending[0];
      await expectJson(await post(url), 503, {
        ok: false,
        error: "Contact service unavailable.",
      });
      expect(notify).toHaveBeenCalledTimes(CONTACT_MAX_IN_FLIGHT_NOTIFICATIONS);
    } finally {
      releases.forEach(release => release());
      await Promise.all(pending);
    }
    notify.mockImplementation(async () => {});
    await expectJson(await post(url), 200, { ok: true });
  });

  it("bounds the number of simultaneous incomplete requests", async () => {
    let arrivals = 0;
    const notify = vi.fn(async () => {});
    const url = await startServer(notify, {
      onRequest: () => {
        arrivals += 1;
      },
    });
    const stalled = Array.from(
      { length: CONTACT_MAX_IN_FLIGHT_REQUESTS },
      () => {
        const req = httpRequest(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "transfer-encoding": "chunked",
          },
        });
        req.on("error", () => {});
        req.write("{");
        return req;
      }
    );
    try {
      await vi.waitFor(() =>
        expect(arrivals).toBe(CONTACT_MAX_IN_FLIGHT_REQUESTS)
      );
      await expectJson(await post(url), 503, {
        ok: false,
        error: "Contact service unavailable.",
      });
      expect(notify).not.toHaveBeenCalled();
    } finally {
      stalled.forEach(req => req.destroy());
    }
    await vi.waitFor(async () => {
      const response = await post(url);
      expect(response.status).toBe(200);
      await response.body?.cancel();
    });
  });
});
