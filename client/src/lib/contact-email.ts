import type { ContactFields } from "@/components/ContactForm";

/** Build a draft without placing visitor-provided text in the address or subject. */
export function contactEmailUrl(fields: ContactFields): string {
  const body = [
    `Name: ${fields.name.trim()}`,
    `Email: ${fields.email.trim()}`,
    "",
    "Message:",
    fields.message.trim(),
  ].join("\r\n");

  return `mailto:business@ljsportstech.com?subject=${encodeURIComponent("LJ Sports Tech website inquiry")}&body=${encodeURIComponent(body)}`;
}

export async function openContactEmail(fields: ContactFields): Promise<{ ok: boolean; message: string }> {
  const draftUrl = contactEmailUrl(fields);
  // Some mail clients reject long mailto URLs. Never silently truncate a message.
  if (draftUrl.length > 1900) {
    return {
      ok: false,
      message: "This draft is too long for some email apps. Please shorten your message or email business@ljsportstech.com directly; your text is still here.",
    };
  }
  // A real link preserves the browser's normal external-protocol handling.
  const link = document.createElement("a");
  link.href = draftUrl;
  link.hidden = true;
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
  }
  return {
    ok: true,
    message: "If your email app opened, review the draft and send it there. Your message has not been sent yet. If nothing opened, email business@ljsportstech.com directly.",
  };
}
