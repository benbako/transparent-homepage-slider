import { z } from "zod";

// Check the original input before trimming, so leading or trailing newlines
// cannot be silently removed from values later used in email headers.
const headerControls = /[\p{Cc}\u2028\u2029]/u;
const headerString = z.string().refine(value => !headerControls.test(value));

const contactSubmissionSchema = z
  .object({
    name: headerString.trim().min(1).max(120),
    email: headerString.trim().max(254).email(),
    message: z.string().trim().min(1).max(4000),
    // Optional future spam trap: only an exactly empty value is accepted.
    website: z.literal("").optional(),
  })
  .strict()
  .refine(data => !Object.hasOwn(data, "website") || data.website === "");

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
};

export type ContactParseResult =
  | { success: true; data: ContactSubmission }
  | { success: false; error: "Invalid contact submission." };

/** Parse untrusted input without returning input values or validation details on failure. */
export function parseContactSubmission(input: unknown): ContactParseResult {
  const result = contactSubmissionSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: "Invalid contact submission." };
  }

  // Do not pass the honeypot through to a future email-delivery implementation.
  const { name, email, message } = result.data;
  return { success: true, data: { name, email, message } };
}
