import { describe, expect, it } from "vitest";
import { contactEmailUrl, openContactEmail } from "./contact-email";

describe("contact email draft", () => {
  it("addresses the business inbox and preserves special characters in the message", () => {
    const url = new URL(contactEmailUrl({
      name: "  Taylor & Co  ",
      email: "  taylor@example.com  ",
      message: "Hello & thanks!\nCan we discuss 50%?",
    }));
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("business@ljsportstech.com");
    expect(url.searchParams.get("subject")).toBe("LJ Sports Tech website inquiry");
    expect(url.searchParams.get("body")).toBe("Name: Taylor & Co\r\nEmail: taylor@example.com\r\n\r\nMessage:\r\nHello & thanks!\nCan we discuss 50%?");
  });

  it("does not put visitor text into mail headers", () => {
    const url = new URL(contactEmailUrl({ name: "Name\nBcc: attacker@example.com", email: "user@example.com", message: "Hi" }));
    expect([...url.searchParams.keys()]).toEqual(["subject", "body"]);
    expect(url.searchParams.get("body")).toContain("Bcc: attacker@example.com");
  });

  it("refuses to silently truncate a draft too long for mail apps", async () => {
    const result = await openContactEmail({ name: "Taylor", email: "taylor@example.com", message: "A".repeat(2200) });
    expect(result.ok).toBe(false);
    expect(result.message).toContain("too long");
    expect(result.message).toContain("your text is still here");
  });
});
