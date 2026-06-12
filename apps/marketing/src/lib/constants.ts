interface PricingPlan {
  readonly tier: string;
  readonly price: string;
  readonly period?: string;
  readonly annualPrice?: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly highlighted: boolean;
  readonly popular?: boolean;
}

export const SITE = {
  title: "VeerTrade | AI-Powered Algorithmic Trading for Indian Markets",
  description:
    "Build, backtest, and execute algorithmic trading strategies with VeerTrade. AI-powered trading for Indian markets. Connect Zerodha.",
  url: "https://veertrade.com",
  ogImage: "/brand.png",
  twitterHandle: "@veertrade",
} as const;

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI", href: "#ai" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const FEATURES = [
  {
    title: "Connect Zerodha",
    description:
      "Link your Zerodha account in one click. Secure OAuth-based authentication via Kite Connect.",
    icon: "plug-zap",
  },
  {
    title: "Build Strategies",
    description:
      "Drag-and-drop strategy builder. No coding required. Full control over entry, exit, and risk rules.",
    icon: "brain-circuit",
  },
  {
    title: "Backtest Instantly",
    description:
      "Test your strategies against years of historical data. Get P&L, Sharpe ratio, drawdown, and win rate.",
    icon: "test-tube",
  },
  {
    title: "Paper Trade",
    description:
      "Deploy strategies in a risk-free simulated environment. Validate performance before going live.",
    icon: "flask-conical",
  },
  {
    title: "AI Strategy Generator",
    description:
      "Describe your trading idea in plain English. VeerTrade's AI generates a complete, backtestable strategy.",
    icon: "sparkles",
  },
  {
    title: "Performance Analytics",
    description:
      "Real-time dashboards for P&L, positions, orders, and risk metrics. Built for clarity and speed.",
    icon: "bar-chart-3",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Connect Broker",
    description:
      "Link your Zerodha account securely via Kite Connect API.",
  },
  {
    step: 2,
    title: "Create Strategy",
    description:
      "Use our visual builder or let AI generate one from your description.",
  },
  {
    step: 3,
    title: "Backtest",
    description:
      "Validate against years of market data. Optimize before going live.",
  },
  {
    step: 4,
    title: "Deploy",
    description:
      "Go live with real markets. Monitor performance in real-time.",
  },
] as const;

export const AI_FEATURES = [
  {
    title: "AI Strategy Generator",
    description:
      '"I want to scalp Nifty BankNifty during morning volatility" \u2192 VeerTrade generates a complete strategy with entry rules, exit rules, stop-loss, and position sizing.',
    icon: "bot",
  },
  {
    title: "AI Trade Coach",
    description:
      "Get real-time insights on open positions. The coach analyzes market conditions and suggests adjustments to improve outcomes.",
    icon: "brain",
  },
  {
    title: "AI Trade Journal",
    description:
      "Every trade is automatically logged and analyzed. Review your performance, identify patterns, and improve over time.",
    icon: "book-open",
  },
] as const;

export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    tier: "Starter",
    price: "Free",
    description: "Perfect for getting started.",
    features: [
      "1 trading strategy",
      "Basic backtesting",
      "Paper trading",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    tier: "Pro",
    price: "\u20b9999",
    period: "/mo",
    annualPrice: "\u20b99,999",
    description: "For serious algorithmic traders.",
    features: [
      "Unlimited strategies",
      "AI strategy generator",
      "Advanced backtesting",
      "Live trading",
      "Priority support",
    ],
    cta: "Start 14-Day Free Trial",
    highlighted: true,
    popular: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    description: "For institutions and teams.",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Team management",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export const FAQ_ITEMS = [
  {
    question: "How do I connect my Zerodha account?",
    answer:
      "VeerTrade uses Zerodha's official Kite Connect API. You'll be redirected to Zerodha's login page to authorize access. Your credentials never touch our servers.",
  },
  {
    question: "Do I need coding experience to create strategies?",
    answer:
      "No. Our visual strategy builder lets you create rules with drag-and-drop. You can also describe your idea in plain English and let our AI generate a strategy for you.",
  },
  {
    question: "How accurate is the backtesting engine?",
    answer:
      "VeerTrade uses tick-level historical data for Indian markets. Backtests account for slippage, brokerage, and market impact to give you realistic results.",
  },
  {
    question: "Is my data and API key secure?",
    answer:
      "Yes. We use industry-standard encryption. API tokens are stored encrypted at rest. We never share your data with third parties. Zerodha credentials are handled entirely by Zerodha's OAuth flow.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Absolutely. You can upgrade or downgrade anytime. If you upgrade, you get immediate access to new features. Downgrades take effect at the next billing cycle.",
  },
  {
    question: "What if my strategy loses money?",
    answer:
      "VeerTrade is a tool; you stay in full control of your risk. We prevent catastrophic loss with built-in guardrails: daily loss limits, position size limits, and a one-click kill switch. You set the parameters. We enforce them automatically.",
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "/integrations" },
    { label: "API", href: "/docs/api" },
    { label: "Changelog", href: "/changelog" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ],
  social: [
    { label: "Twitter / X", href: "https://x.com/veertrade" },
    { label: "GitHub", href: "https://github.com/veertrade" },
    { label: "LinkedIn", href: "https://linkedin.com/company/veertrade" },
    { label: "YouTube", href: "https://youtube.com/@veertrade" },
  ],
} as const;
