import type { ContactFields } from "@/components/ContactForm";

export const CONTACT_API_TIMEOUT_MS = 10_000;

const failureMessage =
  "We couldn't confirm your message was received. Please email business@ljsportstech.com directly.";
const successMessage = "Thank you. Your message has been submitted.";

/** Submit only to the future same-origin contact endpoint. */
export async function submitContact(
  fields: ContactFields
): Promise<{ ok: boolean; message: string }> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("Contact request timed out"));
    }, CONTACT_API_TIMEOUT_MS);
  });

  try {
    // Race the entire operation, including reading the body, so a stalled
    // response cannot leave the caller waiting indefinitely.
    return await Promise.race([
      (async () => {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "same-origin",
          redirect: "error",
          signal: controller.signal,
          body: JSON.stringify({
            name: fields.name,
            email: fields.email,
            message: fields.message,
          }),
        });

        const contentType = response.headers.get("content-type") ?? "";
        if (
          !response.ok ||
          !/^application\/(?:json|[a-z0-9!#$&^_.+-]+\+json)(?:\s*;|\s*$)/i.test(
            contentType
          )
        ) {
          return { ok: false, message: failureMessage };
        }

        const data: unknown = await response.json();
        if (
          data === null ||
          typeof data !== "object" ||
          Array.isArray(data) ||
          !("ok" in data) ||
          data.ok !== true
        ) {
          return { ok: false, message: failureMessage };
        }

        // Do not display untrusted or internal response messages.
        return { ok: true, message: successMessage };
      })(),
      timeout,
    ]);
  } catch {
    return { ok: false, message: failureMessage };
  } finally {
    clearTimeout(timer);
  }
}
