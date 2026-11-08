import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONTACT_API_TIMEOUT_MS, submitContact } from "./contact-api";

const fields = {
  name: "Taylor & Co",
  email: "taylor@example.com",
  message: "Hello & thanks!\nCan we discuss 50%?",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function expectSafeFailure(result: { ok: boolean; message: string }) {
  expect(result.ok).toBe(false);
  expect(result.message).toContain("business@ljsportstech.com");
  expect(result.message).not.toContain("secret backend detail");
}

describe("submitContact", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("posts the fields as same-origin JSON and accepts a 2xx JSON ok:true", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: true, message: "secret backend detail" }, 202)
    );

    const result = await submitContact(fields);
    expect(result.ok).toBe(true);
    expect(result.message).not.toContain("secret backend detail");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(options).toMatchObject({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "same-origin",
      redirect: "error",
    });
    expect(options?.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(options?.body as string)).toEqual(fields);
  });

  it.each([400, 500])(
    "rejects HTTP %i even when its JSON claims success",
    async status => {
      fetchMock.mockResolvedValue(
        jsonResponse({ ok: true, message: "secret backend detail" }, status)
      );
      expectSafeFailure(await submitContact(fields));
    }
  );

  it.each([
    { ok: false, message: "secret backend detail" },
    { ok: "true" },
    { success: true },
    null,
    true,
    [{ ok: true }],
  ])(
    "rejects a 2xx response without the exact success shape: %j",
    async body => {
      fetchMock.mockResolvedValue(jsonResponse(body));
      expectSafeFailure(await submitContact(fields));
    }
  );

  it("rejects malformed JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("{not valid json", {
        headers: { "Content-Type": "application/json" },
      })
    );
    expectSafeFailure(await submitContact(fields));
  });

  it("rejects an HTML SPA fallback despite a 2xx status", async () => {
    fetchMock.mockResolvedValue(
      new Response("<!doctype html><html><body>App</body></html>", {
        headers: { "Content-Type": "text/html" },
      })
    );
    expectSafeFailure(await submitContact(fields));
  });

  it("rejects JSON-looking content served as HTML", async () => {
    fetchMock.mockResolvedValue(
      new Response('{"ok":true}', {
        headers: { "Content-Type": "text/html" },
      })
    );
    expectSafeFailure(await submitContact(fields));
  });

  it("handles a network failure without exposing internals", async () => {
    fetchMock.mockRejectedValue(new Error("secret backend detail"));
    expectSafeFailure(await submitContact(fields));
  });

  it("aborts and settles after the timeout even if fetch never settles", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(() => new Promise(() => {}));
    const result = submitContact(fields);
    const signal = fetchMock.mock.calls[0][1]?.signal;
    expect(signal?.aborted).toBe(false);

    await vi.advanceTimersByTimeAsync(CONTACT_API_TIMEOUT_MS);
    expect(signal?.aborted).toBe(true);
    expectSafeFailure(await result);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("also bounds time spent reading a stalled response body", async () => {
    vi.useFakeTimers();
    const response = jsonResponse({ ok: true });
    vi.spyOn(response, "json").mockImplementation(() => new Promise(() => {}));
    fetchMock.mockResolvedValue(response);
    const result = submitContact(fields);
    await vi.advanceTimersByTimeAsync(CONTACT_API_TIMEOUT_MS);
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expectSafeFailure(await result);
    expect(vi.getTimerCount()).toBe(0);
  });
});
