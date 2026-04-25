"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<
    | { state: "idle" }
    | { state: "submitting" }
    | { state: "success"; message?: string }
    | { state: "error"; message: string }
  >({ state: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "submitting" });

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      "your-name": String(data.get("your-name") ?? ""),
      "your-email": String(data.get("your-email") ?? ""),
      "your-subject": String(data.get("your-subject") ?? ""),
      "your-message": String(data.get("your-message") ?? ""),
    };

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL ?? "").replace(/\/+$/, "");
      const formId = (process.env.NEXT_PUBLIC_CONTACT_FORM_7_ID ?? "").trim();
      if (!baseUrl || !formId) {
        setStatus({
          state: "error",
          message:
            "Missing NEXT_PUBLIC_WORDPRESS_BASE_URL or NEXT_PUBLIC_CONTACT_FORM_7_ID. Add them to your env for static hosting.",
        });
        return;
      }

      const url = `${baseUrl}/wp-json/contact-form-7/v1/contact-forms/${encodeURIComponent(formId)}/feedback`;
      const formData = new FormData();
      const unitTag = `wpcf7-f${formId}-p0-o1`;
      formData.set("_wpcf7", formId);
      formData.set("_wpcf7_unit_tag", unitTag);
      formData.set("_wpcf7_container_post", "0");
      formData.set("your-name", payload["your-name"]);
      formData.set("your-email", payload["your-email"]);
      formData.set("your-subject", payload["your-subject"]);
      formData.set("your-message", payload["your-message"]);

      const res = await fetch(url, { method: "POST", body: formData, headers: { Accept: "application/json" } });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        const msg = json?.message || json?.code || "Failed to submit. Your WordPress site may be blocking CORS.";
        setStatus({ state: "error", message: msg });
        return;
      }

      const message = json?.message as string | undefined;
      setStatus({ state: "success", message });
      form.reset();
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Send a message. On GitHub Pages this submits directly to WordPress (Contact Form 7).
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="your-name">
            Your name
          </label>
          <input
            id="your-name"
            name="your-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:focus:border-zinc-600"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="your-email">
            Your email
          </label>
          <input
            id="your-email"
            name="your-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:focus:border-zinc-600"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="your-subject">
            Subject
          </label>
          <input
            id="your-subject"
            name="your-subject"
            type="text"
            placeholder="Subject"
            required
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:focus:border-zinc-600"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="your-message">
            Your message (optional)
          </label>
          <textarea
            id="your-message"
            name="your-message"
            placeholder="What can we help with?"
            rows={6}
            className="resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:focus:border-zinc-600"
          />
        </div>

        {status.state === "error" ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {status.message}
          </div>
        ) : null}
        {status.state === "success" ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
            {status.message ?? "Submitted successfully."}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status.state === "submitting"}
          className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {status.state === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
}

