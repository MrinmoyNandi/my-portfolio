import { useState } from "react";
import { contact, hero, site } from "../content/index.js";
import { Reveal, WaveText } from "../components/primitives.jsx";
import "./Contact.css";

/** Night card over a glowing backdrop. Posts to contact.formAction, or falls back to a mailto: draft. */
export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!contact.formAction) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.get("name")}`);
      const body = encodeURIComponent(`${form.get("message")}\n\n${form.get("name")} <${form.get("email")}>`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(contact.formAction, { method: "POST", body: form, headers: { Accept: "application/json" } });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) e.target.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__bg" aria-hidden="true">
        <img src={contact.background || hero.portrait} alt="" loading="lazy" />
      </div>
      <div className="container contact__wrap">
        <Reveal className="contact__card">
          <h2 className="contact__title text-section">{contact.title}</h2>
          <form className="contact__form" onSubmit={submit}>
            <label className="field"><span className="label">Name</span><input name="name" required autoComplete="name" /></label>
            <label className="field"><span className="label">Email</span><input name="email" type="email" required autoComplete="email" /></label>
            <label className="field field--wide"><span className="label">Message</span><textarea name="message" rows={3} required /></label>
            <div className="contact__actions">
              <button className="btn" type="submit" data-hw="" data-cursor-tone="dark" disabled={status === "sending"}>
                <WaveText text={status === "sending" ? "Sending…" : contact.submitLabel || "Send"} />
                <span className="btn__arrow" aria-hidden="true">↗</span>
              </button>
              <p className="label contact__status" role="status">
                {status === "sent" && "Thanks, message received."}
                {status === "error" && `Something went wrong. Email ${site.email} instead.`}
              </p>
            </div>
          </form>
          <a className="contact__mail text-lead" href={`mailto:${site.email}`} data-hw=""><WaveText text={site.email} /></a>
        </Reveal>
      </div>
    </section>
  );
}
