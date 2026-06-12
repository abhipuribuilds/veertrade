import { useState, type JSX } from "react";
import { motion } from "framer-motion";
import { PRICING_PLANS } from "../lib/constants";

export default function Pricing(): JSX.Element {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="section-muted py-24 md:py-32" aria-labelledby="pricing-heading">
      <div className="container-section">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">
            Pricing
          </p>
          <h2 id="pricing-heading" className="text-3xl font-bold tracking-tight text-text md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted">
            Start free. Scale as you grow. No hidden fees.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm ${!annual ? "text-text font-medium" : "text-muted"}`}>
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={annual}
              aria-label="Toggle annual billing"
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg ${
                annual ? "bg-brand" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                  annual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? "text-text font-medium" : "text-muted"}`}>
              Annual
            </span>
            {annual && (
              <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-medium text-brand">
                Save 17%
              </span>
            )}
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <article
                className={`relative flex h-full flex-col rounded-2xl p-8 ${
                  plan.popular
                    ? "border border-brand/40 bg-surface/70 ring-1 ring-brand/15 backdrop-blur-xl"
                    : "glass"
                }`}
                aria-label={`${plan.tier} plan`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-brand/20">
                      Most Popular
                    </span>
                  </div>
                )}

                <p className="text-sm font-semibold uppercase tracking-wider text-subtle">
                  {plan.tier}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text">
                    {annual && plan.annualPrice ? plan.annualPrice : plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-subtle">
                      {annual ? "/yr" : plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-subtle">{plan.description}</p>

                <ul className="mt-6 space-y-3" role="list">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 flex-shrink-0 text-brand"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <a
                    href={plan.tier === "Enterprise" ? "/contact" : "/signup"}
                    className={`flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg active:scale-95 ${
                      plan.popular
                        ? "bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-hover hover:shadow-brand-hover/20 focus:ring-brand"
                        : "bg-surface-alt text-muted hover:bg-surface-hover hover:text-text focus:ring-border-hover"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
