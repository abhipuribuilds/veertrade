# VeerTrade Landing Page — Specification

> Phase 1 deliverable. Full spec for the VeerTrade marketing landing page.

---

## 1. Brand

| Attribute | Value |
|-----------|-------|
| Name | VeerTrade |
| Tagline | Trade Like A Veer. |
| Personality | Premium, professional, fast, intelligent, trustworthy, modern |
| Inspiration | Linear, Stripe, Vercel, Ramp, Raycast |
| Anti-pattern | Generic templates, Bootstrap, Indian brokerage aesthetics |

### 1.1 Voice & Tone

- Direct, confident, professional
- Minimal jargon — explain value, not mechanics
- "Veer" = courage, conviction, warrior spirit

---

## 2. Page Layout (Top to Bottom)

```
Navbar (sticky, transparent → glass on scroll)
Hero (Three.js background)
Features (3×2 grid)
How It Works (4-step vertical/timeline)
AI Section (3 cards)
Pricing (3 plans)
FAQ (accordion)
Footer
```

---

## 3. Navbar

| Property | Spec |
|----------|------|
| Position | Fixed top, full-width |
| Background | Transparent → `bg-zinc-950/80 backdrop-blur-xl` on scroll |
| Height | `h-16` (64px) |
| Content | Logo (left), Nav links (center), CTA button (right) |

### Nav Links

| Link | Target |
|------|--------|
| Features | `#features` |
| How It Works | `#how-it-works` |
| AI | `#ai` |
| Pricing | `#pricing` |
| FAQ | `#faq` |

### CTA Button

| Property | Spec |
|----------|------|
| Label | Start Building Strategies |
| Variant | Primary — `bg-emerald-500 hover:bg-emerald-400 text-white` |
| Action | Scroll to `#hero` or link to dashboard signup |

### Mobile

- Hamburger menu (right side)
- Slide-in drawer from right
- Full nav links + CTA inside drawer
- `backdrop-blur-xl` overlay

---

## 4. Hero Section

| Property | Spec |
|----------|------|
| ID | `hero` |
| Layout | Full viewport (`min-h-screen`), centered content |
| Background | Three.js animated scene (particles/grid/wave) |
| Overlay | Gradient overlay `from-zinc-950/60 to-zinc-950/80` for readability |

### Content

| Element | Content | Style |
|---------|---------|-------|
| Eyebrow | — | — (none — let headline breathe) |
| Headline | **Trade Like A Veer.** | `text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight` |
| Subheadline | **Build. Backtest. Execute.** | `text-xl md:text-2xl text-zinc-400 font-medium` |
| Supporting | AI-Powered Algorithmic Trading for Indian Markets. | `text-base md:text-lg text-zinc-500 max-w-2xl mx-auto` |
| Primary CTA | Start Building Strategies | Primary button `bg-emerald-500` |
| Secondary CTA | View Demo | Ghost button with `border-zinc-700` |

### Three.js Scene Spec

| Property | Spec |
|----------|------|
| Library | Three.js via `@react-three/fiber` or vanilla Three.js |
| Content | Abstract particle system OR subtle grid/wave animation |
| Performance | `antialias: false`, capped at 60fps, reduced on mobile |
| Dark mode | Always dark — dark blue/emerald color palette |
| Fallback | Static gradient background if WebGL unavailable |
| Loading | `suspense` with skeleton placeholder |

### Animation (Framer Motion)

| Element | Animation | Trigger |
|---------|-----------|---------|
| Headline | `fadeInUp` — 0.6s delay 0.1s | On mount |
| Subheadline | `fadeInUp` — 0.6s delay 0.3s | On mount |
| Supporting | `fadeInUp` — 0.6s delay 0.5s | On mount |
| CTAs | `fadeInUp` — 0.6s delay 0.7s | On mount |
| Three.js canvas | `opacity 1s ease` | On mount |

---

## 5. Features Section

| Property | Spec |
|----------|------|
| ID | `features` |
| Layout | Full-width, centered |
| Padding | `py-24 md:py-32` |
| Background | `bg-zinc-950` |

### Section Header

| Element | Content |
|---------|---------|
| Eyebrow | Features |
| Headline | Everything you need to trade smarter |
| Description | From strategy creation to live execution — built for Indian markets. |

### Feature Cards (3×2 Grid)

| # | Icon | Title | Description |
|---|------|-------|-------------|
| 1 | `PlugZap` | Connect Zerodha | Link your Zerodha account in one click. Secure OAuth-based authentication via Kite Connect. |
| 2 | `BrainCircuit` | Build Strategies | Drag-and-drop strategy builder. No coding required. Full control over entry, exit, and risk rules. |
| 3 | `TestTube` | Backtest Instantly | Test your strategies against years of historical data. Get P&L, Sharpe ratio, drawdown, and win rate. |
| 4 | `FlaskConical` | Paper Trade | Deploy strategies in a risk-free simulated environment. Validate performance before going live. |
| 5 | `Sparkles` | AI Strategy Generator | Describe your trading idea in plain English. VeerTrade's AI generates a complete, backtestable strategy. |
| 6 | `BarChart3` | Performance Analytics | Real-time dashboards for P&L, positions, orders, and risk metrics. Built for clarity and speed. |

### Card Design

| Property | Spec |
|----------|------|
| Background | `bg-zinc-900/50 backdrop-blur-xl border border-zinc-800` |
| Radius | `rounded-xl` |
| Padding | `p-6 md:p-8` |
| Hover | `hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300` |
| Icon | 24px, `text-emerald-400` |
| Title | `text-lg font-semibold text-zinc-100` |
| Description | `text-sm text-zinc-400 leading-relaxed` |

### Animation

- Cards `fadeInUp` staggered with `0.1s` interval on scroll into view
- `whileInView` + `viewport={{ once: true, margin: "-100px" }}`

---

## 6. How It Works Section

| Property | Spec |
|----------|------|
| ID | `how-it-works` |
| Layout | Centered, vertical timeline or horizontal process flow |
| Padding | `py-24 md:py-32` |
| Background | `bg-zinc-900/50` |

### Section Header

| Element | Content |
|---------|---------|
| Eyebrow | How It Works |
| Headline | From idea to execution in four steps |
| Description | VeerTrade transforms your trading strategies into automated algorithms. |

### Steps

| Step | Title | Description |
|------|-------|-------------|
| 1 | Connect Broker | Link your Zerodha account securely via Kite Connect API. |
| 2 | Create Strategy | Use our visual builder or let AI generate one from your description. |
| 3 | Backtest | Validate against years of market data. Optimize before going live. |
| 4 | Deploy | Go live with real markets. Monitor performance in real-time. |

### Visual Design

| Property | Spec |
|----------|------|
| Connector | Vertical line or arrow between steps, `bg-zinc-700` |
| Step number | Circular badge `w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30` |
| Layout | Alternating left-right on desktop, stacked on mobile |

### Animation

- Each step `fadeInUp` on scroll
- Connector line animates as user scrolls (progress indicator)

---

## 7. AI Section

| Property | Spec |
|----------|------|
| ID | `ai` |
| Layout | Full-width, centered |
| Padding | `py-24 md:py-32` |
| Background | `bg-zinc-950` |

### Section Header

| Element | Content |
|---------|---------|
| Eyebrow | Artificial Intelligence |
| Headline | AI-powered trading intelligence |
| Description | VeerTrade brings cutting-edge AI to every part of your trading workflow. |

### AI Feature Cards (3 columns)

| # | Icon | Title | Description |
|---|------|-------|-------------|
| 1 | `Bot` | AI Strategy Generator | "I want to scalp Nifty BankNifty during morning volatility" → VeerTrade generates a complete strategy with entry rules, exit rules, stop-loss, and position sizing. |
| 2 | `Brain` | AI Trade Coach | Get real-time insights on open positions. The coach analyzes market conditions and suggests adjustments to improve outcomes. |
| 3 | `BookOpen` | AI Trade Journal | Every trade is automatically logged and analyzed. Review your performance, identify patterns, and improve over time. |

### Card Design

Same glass card pattern as Features section.
- Add subtle `hover:-translate-y-1` lift
- Icon container `w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center`

---

## 8. Pricing Section

| Property | Spec |
|----------|------|
| ID | `pricing` |
| Layout | Centered, 3-column grid |
| Padding | `py-24 md:py-32` |
| Background | `bg-zinc-900/50` |

### Section Header

| Element | Content |
|---------|---------|
| Eyebrow | Pricing |
| Headline | Simple, transparent pricing |
| Description | Start free. Scale as you grow. No hidden fees. |

### Plans

| Tier | Price | Key Features | CTA |
|------|-------|-------------|-----|
| Starter | Free | 1 strategy, basic backtesting, paper trading | Get Started |
| Pro | ₹999/mo | Unlimited strategies, AI generator, advanced backtesting, live trading | Start Free Trial |
| Enterprise | Custom | Everything in Pro + dedicated support, custom integrations, SLA | Contact Sales |

### Card Design

| Property | Spec |
|----------|------|
| Background | `bg-zinc-900/50 backdrop-blur-xl border border-zinc-800` |
| Pro card highlight | `border-emerald-500/50 ring-1 ring-emerald-500/20` |
| Radius | `rounded-2xl` |
| Padding | `p-8` |
| Layout | Icon/emoji, tier name, price, feature list (checkmarks), CTA button |

### Feature List Items

- Use `text-emerald-400` checkmark icons
- Feature text `text-zinc-300`
- Disabled features `text-zinc-600 line-through`

### CTA Button Styles

| Tier | Style |
|------|-------|
| Starter | `bg-zinc-800 hover:bg-zinc-700 text-white` |
| Pro | `bg-emerald-500 hover:bg-emerald-400 text-white` |
| Enterprise | `bg-zinc-800 hover:bg-zinc-700 text-white` |

---

## 9. FAQ Section

| Property | Spec |
|----------|------|
| ID | `faq` |
| Layout | Centered, max-w-3xl |
| Padding | `py-24 md:py-32` |
| Background | `bg-zinc-950` |

### Section Header

| Element | Content |
|---------|---------|
| Eyebrow | FAQ |
| Headline | Frequently asked questions |
| Description | Everything you need to know about VeerTrade. |

### Questions (Accordion)

| # | Question | Answer |
|---|----------|--------|
| 1 | How do I connect my Zerodha account? | VeerTrade uses Zerodha's official Kite Connect API. You'll be redirected to Zerodha's login page to authorize access. Your credentials never touch our servers. |
| 2 | Do I need coding experience to create strategies? | No. Our visual strategy builder lets you create rules with drag-and-drop. You can also describe your idea in plain English and let our AI generate a strategy for you. |
| 3 | How accurate is the backtesting engine? | VeerTrade uses tick-level historical data for Indian markets. Backtests account for slippage, brokerage, and market impact to give you realistic results. |
| 4 | Is my data and API key secure? | Yes. We use industry-standard encryption. API tokens are stored encrypted at rest. We never share your data with third parties. Zerodha credentials are handled entirely by Zerodha's OAuth flow. |
| 5 | Can I switch plans later? | Absolutely. You can upgrade or downgrade anytime. If you upgrade, you get immediate access to new features. Downgrades take effect at the next billing cycle. |
| 6 | What happens if my strategy makes a loss? | VeerTrade includes built-in risk management: daily loss limits, position size limits, and a kill switch. You set the parameters. We enforce them. |

### Accordion Design

| Property | Spec |
|----------|------|
| Background | `bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl` |
| Question | `font-medium text-zinc-100 py-4 px-6 cursor-pointer` |
| Answer | `text-zinc-400 px-6 pb-4 leading-relaxed` |
| Icon | `ChevronDown` rotating on open |
| Spacing | `space-y-3` between items |

### Animation

- `AnimatePresence` for answer expand/collapse
- Stagger entrance on scroll

---

## 10. Footer

| Property | Spec |
|----------|------|
| Layout | 4-column grid (Product, Company, Legal, Social) |
| Padding | `py-16 pb-8` |
| Background | `bg-zinc-950 border-t border-zinc-800` |

### Columns

#### Product
- Features
- Pricing
- Integrations (Zerodha)
- API
- Changelog

#### Company
- About
- Blog
- Careers
- Contact

#### Legal
- Privacy Policy
- Terms of Service
- Cookie Policy
- GDPR

#### Social
- Twitter/X
- GitHub
- LinkedIn
- YouTube

### Bottom Bar

| Element | Content |
|---------|---------|
| Copyright | © 2026 VeerTrade. All rights reserved. |
| Tagline | Trade Like A Veer. |

---

## 11. Design System Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand` | `#10b981` (emerald-500) | Primary accent, CTAs, highlights |
| `--color-bg` | `#09090b` (zinc-950) | Page background |
| `--color-surface` | `#18181b` (zinc-900) | Card/section backgrounds |
| `--color-border` | `#27272a` (zinc-800) | Borders |
| `--color-text` | `#f4f4f5` (zinc-100) | Primary text |
| `--color-muted` | `#a1a1aa` (zinc-400) | Secondary/muted text |
| `--color-subtle` | `#71717a` (zinc-500) | Subtle text |

### Typography

| Level | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Display | `text-8xl` | `font-bold` (700) | `tight` |
| H1 | `text-5xl`→`text-7xl` | `font-bold` (700) | `tight` |
| H2 | `text-3xl`→`text-4xl` | `font-bold` (700) | `tight` |
| H3 | `text-xl`→`text-2xl` | `font-semibold` (600) | `snug` |
| Body | `text-base` | `font-normal` (400) | `relaxed` |
| Small | `text-sm` | `font-normal` (400) | `normal` |

### Spacing Scale

Use Tailwind's default spacing scale: `space-y-*`, `gap-*`, `p-*`, `m-*`.

Section padding: `py-24` (96px) mobile, `py-32` (128px) desktop.

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| Default | `rounded-lg` (8px) | Buttons, inputs |
| Card | `rounded-xl` (12px) | Cards, sections |
| Pill | `rounded-full` | Badges, avatars |

### Shadows

| Token | Value |
|-------|-------|
| Card | `shadow-lg shadow-black/20` |
| Elevated | `shadow-xl shadow-black/30` |

### Glassmorphism

Default card pattern:
```
bg-zinc-900/50 backdrop-blur-xl border border-zinc-800
```

---

## 12. Structured Data (JSON-LD)

### Organization
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "VeerTrade",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "description": "AI-Powered Algorithmic Trading for Indian Markets.",
  "offers": {
    "@type": "AggregateOffer",
    "offerCount": "3",
    "offers": [
      { "@type": "Offer", "name": "Starter", "price": "0", "priceCurrency": "INR" },
      { "@type": "Offer", "name": "Pro", "price": "999", "priceCurrency": "INR" },
      { "@type": "Offer", "name": "Enterprise", "price": "0", "priceCurrency": "INR" }
    ]
  }
}
```

### FAQ
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I connect my Zerodha account?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VeerTrade uses Zerodha's official Kite Connect API..."
      }
    }
  ]
}
```

---

## 13. SEO & Metadata

| Property | Value |
|----------|-------|
| `<title>` | VeerTrade — AI-Powered Algorithmic Trading for Indian Markets |
| `<meta name="description">` | Build, backtest, and execute algorithmic trading strategies with VeerTrade. AI-powered trading for Indian markets. Connect Zerodha. |
| `<meta name="keywords">` | algorithmic trading, Indian markets, Nifty, BankNifty, trading strategies, backtesting, Zerodha, Kite Connect |
| `og:title` | VeerTrade — Trade Like A Veer. |
| `og:description` | AI-Powered Algorithmic Trading for Indian Markets. |
| `og:image` | `/og-image.png` |
| `og:url` | `https://veertrade.com` |
| `twitter:card` | `summary_large_image` |
| `twitter:title` | VeerTrade — Trade Like A Veer. |
| `twitter:description` | AI-Powered Algorithmic Trading for Indian Markets. |

---

## 14. Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| Skip to content | Hidden skip link on `:focus` |
| Keyboard nav | All interactive elements focusable, logical tab order |
| ARIA labels | Nav, buttons, accordion, form inputs |
| Color contrast | All text meets WCAG AA (4.5:1 ratio) |
| Reduced motion | `prefers-reduced-motion` disables animations |
| Focus indicators | Visible `ring-2 ring-emerald-500` on all interactive elements |
| Alt text | All images have descriptive alt text |
| Semantic HTML | `<nav>`, `<main>`, `<section>`, `<footer>` landmarks |

---

## 15. Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| First Contentful Paint | ≤ 1.5s |
| Largest Contentful Paint | ≤ 2.5s |
| Cumulative Layout Shift | ≤ 0.1 |
| Time to Interactive | ≤ 3.0s |

---

## 16. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 640px | Single column, stacked layout, hamburger nav |
| Tablet | 640px–1024px | 2-column grids, expanded nav |
| Desktop | > 1024px | Full layout, 3-column grids, sticky nav |

---

## 17. Component Tree

```
Layout
├── SEOHead (title, meta, OG, Twitter, JSON-LD)
├── SkipLink
├── Navbar
│   ├── Logo
│   ├── NavLinks (desktop)
│   ├── CTAButton
│   └── MobileMenu (hamburger + drawer)
├── main
│   ├── HeroSection
│   │   ├── ThreeScene (particles/wave)
│   │   ├── HeroContent (headline, sub, CTAs)
│   │   └── ScrollIndicator
│   ├── FeaturesSection
│   │   ├── SectionHeader
│   │   └── FeatureGrid
│   │       └── FeatureCard × 6
│   ├── HowItWorksSection
│   │   ├── SectionHeader
│   │   └── StepTimeline
│   │       └── Step × 4
│   ├── AISection
│   │   ├── SectionHeader
│   │   └── AIGrid
│   │       └── AICard × 3
│   ├── PricingSection
│   │   ├── SectionHeader
│   │   └── PricingGrid
│   │       └── PricingCard × 3
│   └── FAQSection
│       ├── SectionHeader
│       └── FAQList
│           └── AccordionItem × 6
└── Footer
    ├── FooterGrid (4 columns)
    ├── FooterLinks
    └── BottomBar
```

---

## 18. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| astro | ^5 | Framework |
| @astrojs/tailwind | ^6 | Tailwind v4 integration |
| tailwindcss | ^4 | CSS framework |
| @astrojs/react | ^? | React integration for Framer Motion |
| react | ^18 | Peer dep for Framer Motion |
| react-dom | ^18 | Peer dep for Framer Motion |
| framer-motion | ^11 | Animations |
| three | ^0.170 | 3D rendering |
| @astrojs/sitemap | ^? | Sitemap generation |
| astro-seo | ^? | SEO metadata management |

---

## 19. File Structure (Proposed)

```
apps/marketing/src/
├── components/
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── HeroThreeScene.tsx (React, for Three.js)
│   ├── Features.astro
│   ├── FeatureCard.astro
│   ├── HowItWorks.astro
│   ├── Step.astro
│   ├── AI.astro
│   ├── AICard.astro
│   ├── Pricing.astro
│   ├── PricingCard.astro
│   ├── FAQ.astro
│   ├── AccordionItem.astro (or .tsx for framer)
│   ├── Footer.astro
│   ├── Button.astro
│   ├── SectionHeader.astro
│   ├── GlassCard.astro
│   └── ScrollReveal.tsx (Framer Motion wrapper)
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
├── styles/
│   └── global.css
└── lib/
    └── constants.ts
```
