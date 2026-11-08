import { describe, expect, it } from "vitest";
import { parseContactSubmission } from "./validation";

const valid = {
  name: "Alex Chen",
  email: "alex@example.com",
  message: "Hello,\nPlease send me more information.",
};

function expectInvalid(input: unknown): void {
  expect(parseContactSubmission(input)).toEqual({
    success: false,
    error: "Invalid contact submission.",
  });
}

describe("parseContactSubmission", () => {
  it("accepts and trims the three fields while preserving message line breaks", () => {
    expect(
      parseContactSubmission({
        name: "  Alex Chen  ",
        email: " alex@example.com ",
        message: "  Hello,\nPlease send me more information.  ",
      })
    ).toEqual({ success: true, data: valid });
  });

  it("accepts an exactly empty optional honeypot but does not return it", () => {
    expect(parseContactSubmission({ ...valid, website: "" })).toEqual({
      success: true,
      data: valid,
    });
  });

  it.each(["bot.example", " ", null, undefined, 0, false])(
    "rejects a nonempty or non-string honeypot: %s",
    website => {
      expectInvalid({ ...valid, website });
    }
  );

  it("rejects unexpected fields without exposing the field or its value", () => {
    expectInvalid({ ...valid, secretField: "secret-submitted-value" });
  });

  it.each([
    null,
    undefined,
    "not an object",
    [],
    {},
    { ...valid, name: null },
    { ...valid, email: 42 },
    { ...valid, message: ["hello"] },
    { name: valid.name, email: valid.email },
  ])("rejects malformed input", input => {
    expectInvalid(input);
  });

  it.each([
    { ...valid, name: "" },
    { ...valid, name: "   " },
    { ...valid, email: "" },
    { ...valid, email: "   " },
    { ...valid, message: "" },
    { ...valid, message: " \n\t " },
  ])("rejects empty or whitespace-only fields", input => {
    expectInvalid(input);
  });

  it.each([
    "not-an-email",
    "alex@",
    "@example.com",
    "alex@example",
    "alex example@example.com",
    "alex@example.com,other@example.com",
  ])("rejects malformed email address %s", email => {
    expectInvalid({ ...valid, email });
  });

  it("accepts values exactly at the length limits after trimming", () => {
    // Local part: 64, domain: 189, plus @ = 254 characters.
    const email = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(57)}.com`;
    expect(email).toHaveLength(254);
    expect(
      parseContactSubmission({
        name: ` ${"n".repeat(120)} `,
        email: ` ${email} `,
        message: ` ${"m".repeat(4000)} `,
      })
    ).toEqual({
      success: true,
      data: { name: "n".repeat(120), email, message: "m".repeat(4000) },
    });
  });

  it("rejects each field over its length limit", () => {
    const email = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(58)}.com`;
    expect(email).toHaveLength(255);
    expectInvalid({ ...valid, name: "n".repeat(121) });
    expectInvalid({ ...valid, email });
    expectInvalid({ ...valid, message: "m".repeat(4001) });
  });

  it.each([
    "\r\nBcc: attacker@example.com",
    "\n",
    "\r",
    "\t",
    "\u0000",
    "\u007f",
    "\u0085",
    "\u2028",
    "\u2029",
  ])("rejects header control characters in name and email: %j", injection => {
    expectInvalid({ ...valid, name: `Alex${injection}` });
    expectInvalid({ ...valid, name: `${injection}Alex` });
    expectInvalid({ ...valid, name: `Al${injection}ex` });
    expectInvalid({ ...valid, email: `alex@example.com${injection}` });
    expectInvalid({ ...valid, email: `${injection}alex@example.com` });
    expectInvalid({ ...valid, email: `alex${injection}@example.com` });
  });

  it("never returns submitted data in validation errors", () => {
    const sensitive = "do-not-expose-this-submitted-value";
    const result = parseContactSubmission({
      name: `${sensitive}\r\nBcc: attacker@example.com`,
      email: sensitive,
      message: sensitive,
      [sensitive]: sensitive,
    });
    expectInvalid({ name: sensitive, email: sensitive, message: sensitive });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result)).not.toContain(sensitive);
    expect(JSON.stringify(result)).not.toContain("attacker@example.com");
  });
});
