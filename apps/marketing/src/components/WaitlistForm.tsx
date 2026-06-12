import { useState, type JSX } from "react";

export default function WaitlistForm(): JSX.Element {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Simulate API call — replace with actual endpoint
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={status === "loading" || status === "success"}
        aria-describedby={status === "error" ? "waitlist-error" : undefined}
        className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand/20 transition-all duration-200 hover:bg-brand-hover hover:shadow-brand-hover/20 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg active:scale-95 disabled:opacity-50"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Joining...
          </span>
        ) : status === "success" ? (
          "You're on the list!"
        ) : (
          "Get Early Access"
        )}
      </button>
      {status === "error" && (
        <p id="waitlist-error" className="text-sm text-red-400" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
