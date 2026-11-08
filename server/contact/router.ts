import { json, Router } from "express";
import { parseContactSubmission, type ContactSubmission } from "./validation";

export type ContactNotifier = (submission: ContactSubmission) => Promise<void>;

// These controls are shared only by requests handled by the same router instance
// in this process. They are not a substitute for distributed/edge protection.
export const CONTACT_REQUESTS_PER_MINUTE = 120;
export const CONTACT_MAX_IN_FLIGHT_REQUESTS = 32;
export const CONTACT_MAX_IN_FLIGHT_NOTIFICATIONS = 8;
const WINDOW_MS = 60_000;

/** Mount at /api/contact before any other body parser, with an approved notifier. */
export function createContactRouter(notify: ContactNotifier): Router {
  const router = Router();
  const parseJson = json({ limit: "16kb", strict: true, inflate: false });
  let windowStart = performance.now();
  let windowCount = 0;
  let inFlightRequests = 0;
  let inFlightNotifications = 0;

  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");

    if (req.path !== "/") {
      res.status(404).json({ ok: false, error: "Not found." });
      return;
    }
    if (req.method !== "POST") {
      res
        .set("Allow", "POST")
        .status(405)
        .json({ ok: false, error: "Method not allowed." });
      return;
    }

    // A global fixed window avoids trusting spoofable forwarding headers and
    // avoids creating an unbounded map of addresses behind a shared proxy.
    const now = performance.now();
    if (now - windowStart >= WINDOW_MS) {
      windowStart = now;
      windowCount = 0;
    }
    if (windowCount >= CONTACT_REQUESTS_PER_MINUTE) {
      res.set(
        "Retry-After",
        String(Math.max(1, Math.ceil((WINDOW_MS - (now - windowStart)) / 1000)))
      );
      res.status(429);
      res.json({
        ok: false,
        error: "Too many requests. Please try again later.",
      });
      return;
    }
    windowCount += 1;

    if (inFlightRequests >= CONTACT_MAX_IN_FLIGHT_REQUESTS) {
      res
        .status(503)
        .json({ ok: false, error: "Contact service unavailable." });
      return;
    }
    inFlightRequests += 1;
    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        inFlightRequests -= 1;
      }
    };
    res.once("finish", release);
    res.once("close", release);
    next();
  });

  router.post(
    "/",
    (req, res, next) => {
      const contentType = req.get("content-type") ?? "";
      if (!/^application\/json(?:\s*;|\s*$)/i.test(contentType.trim())) {
        res
          .status(415)
          .json({ ok: false, error: "Unsupported request format." });
        return;
      }

      // Express 4's parsers set _body after consuming the stream. Fail closed if
      // mounted too late: a previously parsed body has not had our 16 KiB limit.
      if (
        (req as typeof req & { _body?: boolean })._body ||
        req.readableEnded
      ) {
        res
          .status(503)
          .json({ ok: false, error: "Contact service unavailable." });
        return;
      }

      parseJson(req, res, error => {
        if (!error) {
          next();
          return;
        }
        // Never expose the parser's error, body, or other internal details.
        const type = (error as { type?: string }).type;
        if (type === "entity.too.large") {
          res
            .status(413)
            .json({ ok: false, error: "Contact submission too large." });
        } else if (
          type === "encoding.unsupported" ||
          type === "charset.unsupported"
        ) {
          res
            .status(415)
            .json({ ok: false, error: "Unsupported request format." });
        } else {
          res
            .status(400)
            .json({ ok: false, error: "Invalid contact submission." });
        }
      });
    },
    async (req, res) => {
      const parsed = parseContactSubmission(req.body);
      if (!parsed.success) {
        res
          .status(400)
          .json({ ok: false, error: "Invalid contact submission." });
        return;
      }
      if (inFlightNotifications >= CONTACT_MAX_IN_FLIGHT_NOTIFICATIONS) {
        res
          .status(503)
          .json({ ok: false, error: "Contact service unavailable." });
        return;
      }

      // The notification slot remains occupied until the promise settles, even
      // if the client disconnects, so abandoned requests cannot bypass the cap.
      inFlightNotifications += 1;
      try {
        await notify(parsed.data);
        res.status(200).json({ ok: true });
      } catch {
        res
          .status(503)
          .json({ ok: false, error: "Contact service unavailable." });
      } finally {
        inFlightNotifications -= 1;
      }
    }
  );

  return router;
}
