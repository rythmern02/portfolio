"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";
import { profile } from "@/lib/content";
import SpellButton from "./arcane/spell-button";

const field =
  "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-[15px] text-white placeholder:text-white/40 transition-colors focus:border-moon focus:outline-none";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

export default function ContactSection() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    try {
      // Same payload the /api/contact route has always accepted.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || "Something went wrong");
      form.reset();
      setStatus({ kind: "sent", message: "Thanks, your message is on its way. I usually reply within a day." });
    } catch {
      setStatus({ kind: "error", message: `Couldn't send that. Email me directly at ${profile.email}.` });
    }
  }

  return (
    <section id="contact" className="px-5 pb-16 pt-24 md:px-6">
      <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-2 lg:gap-16">
        <div data-reveal>
          <p className="eyebrow">
            <span className="text-white/35">V</span>
            <span aria-hidden className="mx-2 text-gold/60">
              ✦
            </span>
            Contact
          </p>
          <h2 className="section-title mt-4">
            <span className="sr-only">{"Hiring? Let's talk."}</span>
            <span aria-hidden data-decipher="Hiring? Let's talk.">
              {"Hiring? Let's talk."}
            </span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            I'm looking for a developer relations or protocol engineering role, in Singapore or remote. Collaborations
            and speaking invites are welcome too.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SpellButton href="book" icon="✦">
              Book a call
            </SpellButton>
            <SpellButton href={`mailto:${profile.email}`} variant="trace">
              Email me
            </SpellButton>
            <button type="button" onClick={copyEmail} className="btn-ghost" aria-live="polite">
              {copied ? <Check className="h-4 w-4 text-emerald-400" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:max-w-sm">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  {s.label}
                  <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-moon" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} data-reveal className="card space-y-4 p-6 md:p-8" noValidate={false}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-white/80">First name</span>
              <input name="firstName" required autoComplete="given-name" className={field} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-white/80">
                Last name <span className="text-white/45">(optional)</span>
              </span>
              <input name="lastName" autoComplete="family-name" className={field} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm text-white/80">Email</span>
            <input name="email" type="email" required autoComplete="email" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-white/80">
              Subject <span className="text-white/45">(optional)</span>
            </span>
            <input name="subject" className={field} placeholder="Role, collaboration, event…" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-white/80">Message</span>
            <textarea name="message" required rows={5} className={`${field} resize-y`} />
          </label>

          <button type="submit" disabled={status.kind === "sending"} className="btn-primary w-full justify-center disabled:opacity-60">
            {status.kind === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {status.kind === "sending" ? "Sending…" : "Send message"}
          </button>
          <p
            role="status"
            className={`min-h-[1.25rem] text-sm ${status.kind === "error" ? "text-rose-300" : "text-emerald-300"}`}
          >
            {status.message}
          </p>
        </form>
      </div>
    </section>
  );
}
