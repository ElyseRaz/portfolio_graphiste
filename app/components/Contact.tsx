"use client";

import { useState, type CSSProperties } from "react";
import { useLanguage } from "../lib/i18n";
import {
  SOCIALS,
  CONTACT_EMAIL,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_DISPLAY,
} from "../lib/content";
import SocialLogo from "./SocialLogo";

type FormState = "idle" | "sending" | "done";

export default function Contact() {
  const { t } = useLanguage();
  const f = t.contact.form;
  const [vals, setVals] = useState({ name: "", email: "", subject: "", message: "" });
  const [errs, setErrs] = useState<{ name?: string; email?: string; message?: string }>({});
  const [state, setState] = useState<FormState>("idle");

  const set =
    (k: keyof typeof vals) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setVals((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const er: typeof errs = {};
    if (!vals.name.trim()) er.name = f.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) er.email = f.errEmail;
    if (!vals.message.trim()) er.message = f.errMsg;
    setErrs(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState("sending");
    setTimeout(() => setState("done"), 1100);
  };

  return (
    <section className="block" id="contact">
      <div className="shell">
        <div className="contact-grid">
          <div className="contact-left">
            <div className="eyebrow reveal">{t.contact.eyebrow}</div>
            <h2
              className="contact-lead reveal"
              style={{ "--d": "100ms", marginTop: "22px" } as CSSProperties}
            >
              {t.contact.lead[0]} <span className="accent">{t.contact.lead[1]}</span>
            </h2>
            <p
              className="hero-sub reveal"
              style={{ "--d": "180ms", maxWidth: "42ch" } as CSSProperties}
            >
              {t.contact.sub}
            </p>
            <div className="contact-info reveal" style={{ "--d": "260ms" } as CSSProperties}>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <span className="k">{t.contact.emailK}</span> {CONTACT_EMAIL}
              </a>
              <a href={`tel:${CONTACT_PHONE_HREF}`}>
                <span className="k">{t.contact.phoneK}</span> {CONTACT_PHONE_DISPLAY}
              </a>
              <div className="row">
                <span className="k">{t.contact.locK}</span> {t.contact.loc}
              </div>
            </div>
            <div className="socials reveal" style={{ "--d": "320ms" } as CSSProperties}>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} title={s.label} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  <SocialLogo label={s.label} />
                </a>
              ))}
            </div>
          </div>
          <div className="contact-right reveal" style={{ "--d": "220ms" } as CSSProperties}>
            {state === "done" ? (
              <div className="form-success">
                <h4>{f.successT}</h4>
                <p>{f.successP}</p>
              </div>
            ) : (
              <form className="form" onSubmit={submit} noValidate>
                <div className={"field" + (errs.name ? " err" : "")}>
                  <label>{f.nameL}</label>
                  <input value={vals.name} onChange={set("name")} placeholder={f.nameP} />
                  <div className="msg">{errs.name || ""}</div>
                </div>
                <div className={"field" + (errs.email ? " err" : "")}>
                  <label>{f.emailL}</label>
                  <input value={vals.email} onChange={set("email")} placeholder={f.emailP} />
                  <div className="msg">{errs.email || ""}</div>
                </div>
                <div className="field">
                  <label>{f.subjL}</label>
                  <input value={vals.subject} onChange={set("subject")} placeholder={f.subjP} />
                  <div className="msg" />
                </div>
                <div className={"field" + (errs.message ? " err" : "")}>
                  <label>{f.msgL}</label>
                  <textarea value={vals.message} onChange={set("message")} placeholder={f.msgP} />
                  <div className="msg">{errs.message || ""}</div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary submit"
                  disabled={state === "sending"}
                >
                  {state === "sending" ? f.sending : f.send} <span className="arrow">↗</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
