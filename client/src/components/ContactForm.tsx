import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import "./contact-form.css";

export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

type ContactFormProps = {
  deliver: (fields: ContactFields) => Promise<{ ok: boolean; message: string }>;
};

type FieldName = keyof ContactFields;
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = { kind: "progress" | "success" | "error"; message: string };

const EMPTY_FIELDS: ContactFields = { name: "", email: "", message: "" };
const FIELD_ORDER: FieldName[] = ["name", "email", "message"];
const FIELD_LIMITS: Record<FieldName, number> = {
  name: 120,
  email: 254,
  message: 4000,
};

function fieldError(field: FieldName, value: string, emailIsInvalid = false) {
  if (!value.trim()) {
    return {
      name: "Please enter your name.",
      email: "Please enter your email address.",
      message: "Please enter a message.",
    }[field];
  }

  if (value.length > FIELD_LIMITS[field]) {
    return `Please use no more than ${FIELD_LIMITS[field]} characters.`;
  }

  if (field === "email" && emailIsInvalid) {
    return "Please enter a valid email address.";
  }

  return undefined;
}

export default function ContactForm({ deliver }: ContactFormProps) {
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [focusField, setFocusField] = useState<FieldName | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus | null>(null);

  useEffect(() => {
    // Keep the browser's native required-field validation in the no-JS page.
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  useEffect(() => {
    if (!focusField) return;
    const refs = { name: nameRef, email: emailRef, message: messageRef };
    refs[focusField].current?.focus();
    setFocusField(null);
  }, [focusField]);

  function updateField(
    field: FieldName,
    value: string,
    emailIsInvalid = false
  ) {
    setFields(current => ({ ...current, [field]: value }));
    setErrors(current => {
      if (!current[field]) return current;
      return { ...current, [field]: fieldError(field, value, emailIsInvalid) };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors: FieldErrors = {
      name: fieldError("name", fields.name),
      email: fieldError(
        "email",
        fields.email,
        emailRef.current?.validity.typeMismatch ?? false
      ),
      message: fieldError("message", fields.message),
    };
    const firstInvalid = FIELD_ORDER.find(field => nextErrors[field]);
    setErrors(nextErrors);

    if (firstInvalid) {
      setStatus({
        kind: "error",
        message: "Please check the highlighted fields.",
      });
      setFocusField(firstInvalid);
      return;
    }

    // Lock synchronously, before React has a chance to render the disabled button.
    submittingRef.current = true;
    setIsSubmitting(true);
    setStatus({ kind: "progress", message: "Preparing your email…" });

    try {
      const result = await deliver({ ...fields });
      setStatus({
        kind: result.ok ? "success" : "error",
        message: result.message,
      });
      // Keep the draft on the page: opening an email app does not prove that
      // the visitor has an app configured or has sent the message.
    } catch {
      setStatus({
        kind: "error",
        message:
          "We couldn't complete your request. Please try again or email us directly.",
      });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact-form" className="lj-contact-form" aria-labelledby={`${id}-heading`}>
      <div className="lj-contact-form__topline">
        <span>GET IN TOUCH</span>
        <span>CONTACT / LJ SPORTS TECH</span>
      </div>

      <div className="lj-contact-form__layout">
        <div className="lj-contact-form__intro">
          <div className="lj-contact-form__eyebrow">
            <span aria-hidden="true" /> LET'S TALK
          </div>
          <h2 id={`${id}-heading`}>
            Tell us about your project<span>.</span>
          </h2>
          <p>
            Share a little about your project below. Your email app will open
            with a draft addressed to our team; please review and send it there.
          </p>
          <div className="lj-contact-form__email">
            <span>EMAIL US DIRECTLY</span>
            <a href="mailto:business@ljsportstech.com">
              business@ljsportstech.com <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <form
          ref={formRef}
          className="lj-contact-form__panel"
          action="mailto:business@ljsportstech.com"
          method="post"
          encType="text/plain"
          onSubmit={handleSubmit}
        >
          <div className="lj-contact-form__panel-heading">
            <span>YOUR DETAILS</span>
            <span>ALL FIELDS REQUIRED</span>
          </div>

          <div className="lj-contact-form__fields" aria-busy={isSubmitting}>
            <div className="lj-contact-form__field">
              <label htmlFor={`${id}-name`}>
                Name <span aria-hidden="true">*</span>
              </label>
              <input
                ref={nameRef}
                id={`${id}-name`}
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={FIELD_LIMITS.name}
                readOnly={isSubmitting}
                value={fields.name}
                onChange={event =>
                  updateField("name", event.currentTarget.value)
                }
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${id}-name-error` : undefined}
              />
              {errors.name && (
                <p className="lj-contact-form__error" id={`${id}-name-error`}>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="lj-contact-form__field">
              <label htmlFor={`${id}-email`}>
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                ref={emailRef}
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={FIELD_LIMITS.email}
                readOnly={isSubmitting}
                value={fields.email}
                onChange={event =>
                  updateField(
                    "email",
                    event.currentTarget.value,
                    event.currentTarget.validity.typeMismatch
                  )
                }
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? `${id}-email-error` : undefined
                }
              />
              {errors.email && (
                <p className="lj-contact-form__error" id={`${id}-email-error`}>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="lj-contact-form__field lj-contact-form__field--message">
              <label htmlFor={`${id}-message`}>
                Message <span aria-hidden="true">*</span>
              </label>
              <textarea
                ref={messageRef}
                id={`${id}-message`}
                name="message"
                required
                maxLength={FIELD_LIMITS.message}
                rows={6}
                readOnly={isSubmitting}
                value={fields.message}
                onChange={event =>
                  updateField("message", event.currentTarget.value)
                }
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? `${id}-message-hint ${id}-message-error` : `${id}-message-hint`
                }
              />
              <p className="lj-contact-form__hint" id={`${id}-message-hint`}>
                Keep messages brief; very long drafts may not open in every email app.
              </p>
              {errors.message && (
                <p
                  className="lj-contact-form__error"
                  id={`${id}-message-error`}
                >
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          <div className="lj-contact-form__actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "PREPARING…" : "OPEN EMAIL APP"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
          <p
            className={`lj-contact-form__status${status ? ` lj-contact-form__status--${status.kind}` : ""}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {status?.message ?? ""}
          </p>
        </form>
      </div>
    </section>
  );
}
