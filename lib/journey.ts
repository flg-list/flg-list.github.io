import { Stage, Step } from "./types";

/**
 * The 0 → 1 journey. Ordered stages, ordered steps.
 * The engine surfaces exactly ONE applicable step at a time.
 */

export const STAGES: Stage[] = [
  { id: "ship", emoji: "🚀", title: "Ship it", tagline: "Get it in front of the world" },
  { id: "identity", emoji: "🏷️", title: "Own your name", tagline: "Domain, handles, identity" },
  { id: "landing", emoji: "🚪", title: "Front door", tagline: "A landing page that converts" },
  { id: "trust", emoji: "🛡️", title: "Trust & security", tagline: "Don't get burned by the basics" },
  { id: "seo", emoji: "🔍", title: "Get found", tagline: "SEO & discoverability" },
  { id: "feedback", emoji: "👂", title: "First users", tagline: "Feedback loops & first 10 users" },
  { id: "launch", emoji: "📣", title: "Launch", tagline: "Distribution & going public" },
  { id: "support", emoji: "☕", title: "Support yourself", tagline: "Let people fuel the work" },
  { id: "momentum", emoji: "🔁", title: "Momentum", tagline: "Stay alive & keep compounding" },
];

export const STEPS: Step[] = [
  // ─────────────────────────── STAGE 1: SHIP ───────────────────────────
  {
    id: "ship-public",
    stage: "ship",
    title: "Make it reachable by a stranger",
    why: "If someone can't try it without you standing next to them, it doesn't exist yet. localhost is a diary, not a product.",
    how: [
      "Web app / API: deploy to Vercel, Netlify, Railway or GitHub Pages — free tiers are fine.",
      "Confirm it loads from a phone on cellular data, not your wifi.",
      "Broken edges are OK. Reachable beats perfect.",
    ],
    resources: [
      { label: "Vercel", url: "https://vercel.com" },
      { label: "Railway", url: "https://railway.app" },
    ],
    effort: "M",
    appliesTo: ["webapp", "api", "oss"],
    assess: "Can a stranger reach your project at a public URL right now?",
  },
  {
    id: "ship-beta",
    stage: "ship",
    title: "Open a real beta channel",
    why: "A build only you can install isn't shipped. TestFlight/Play internal testing gives you an install link you can hand to anyone.",
    how: [
      "iOS: push a build to TestFlight and create a public invite link.",
      "Android: set up a Play Console internal/open testing track.",
      "Test the invite link from a friend's phone, not yours.",
    ],
    resources: [
      { label: "TestFlight docs", url: "https://developer.apple.com/testflight/" },
      { label: "Play testing tracks", url: "https://support.google.com/googleplay/android-developer/answer/9845334" },
    ],
    effort: "M",
    appliesTo: ["mobile"],
    assess: "Can a stranger install your app via a public TestFlight/Play link?",
  },
  {
    id: "ship-readme",
    stage: "ship",
    title: "Write a README that sells in 30 seconds",
    why: "Your README is your landing page until you have one. Most visitors decide in one screen whether to care.",
    how: [
      "One-sentence what-it-is at the very top, in plain words.",
      "A screenshot or GIF above the fold.",
      "Copy-pasteable quickstart: install → run → see result.",
    ],
    resources: [{ label: "readme.so editor", url: "https://readme.so" }],
    effort: "S",
    appliesTo: ["oss", "api"],
    assess: "Does your README have a one-liner, screenshot, and working quickstart?",
  },
  {
    id: "ship-license",
    stage: "ship",
    title: "Add a license",
    why: "No license means nobody can legally use your code. Companies won't touch unlicensed repos.",
    how: [
      "MIT if you want maximum adoption, Apache-2.0 if you want patent protection.",
      "Add LICENSE file via GitHub's 'Add file → Choose a license template'.",
    ],
    resources: [{ label: "choosealicense.com", url: "https://choosealicense.com" }],
    effort: "S",
    appliesTo: ["oss"],
    assess: "Does your repo have a LICENSE file?",
  },
  {
    id: "ship-secrets",
    stage: "ship",
    title: "Get secrets out of your code",
    why: "One leaked API key in a public repo can mean a $10k cloud bill overnight. Bots scan GitHub for keys within minutes.",
    how: [
      "Move keys/tokens to environment variables (.env), add .env to .gitignore.",
      "Search your git history for leaked keys — if found, rotate them now (deleting the file isn't enough).",
      "Enable GitHub secret scanning on the repo.",
    ],
    resources: [{ label: "gitleaks", url: "https://github.com/gitleaks/gitleaks" }],
    effort: "S",
    assess: "Are all API keys/secrets out of your code and git history?",
  },

  // ───────────────────────── STAGE 2: IDENTITY ─────────────────────────
  {
    id: "id-namecheck",
    stage: "identity",
    title: "Lock the name: domain + handles",
    why: "Renaming later costs you every link, mention, and search ranking you've earned. Check availability before you get attached.",
    how: [
      "Check the .com / .app / .dev / .io for your name.",
      "Check the handle on X, GitHub, Product Hunt — grab them even if empty for now.",
      "If taken everywhere, adjust the name NOW, while it's cheap.",
    ],
    resources: [{ label: "namechk.com", url: "https://namechk.com" }],
    effort: "S",
    assess: "Have you verified your name is available (or secured) as a domain and social handle?",
  },
  {
    id: "id-domain",
    stage: "identity",
    title: "Buy the domain",
    why: "yourapp.vercel.app says 'weekend project'. yourapp.com says 'this is real'. It's ~$10/year for instant credibility.",
    how: [
      "Buy from Cloudflare Registrar (at-cost pricing) or Porkbun.",
      "Skip the upsells — you don't need email hosting or 'premium DNS' yet.",
    ],
    resources: [
      { label: "Cloudflare Registrar", url: "https://www.cloudflare.com/products/registrar/" },
      { label: "Porkbun", url: "https://porkbun.com" },
    ],
    effort: "S",
    assess: "Do you own a domain for this project?",
  },
  {
    id: "id-connect",
    stage: "identity",
    title: "Point the domain at your project",
    why: "A domain sitting unused in your registrar earns you nothing. Every link you share from now on should be yours.",
    how: [
      "Web: add the custom domain in Vercel/Netlify/Pages settings, update DNS.",
      "Mobile: point the domain at a simple page with your TestFlight/store link.",
      "Verify https://yourdomain.com loads and http:// redirects to https://.",
    ],
    effort: "S",
  },
  {
    id: "id-email",
    stage: "identity",
    title: "Set up a project contact email",
    why: "Users, testers, and journalists need a way to reach you that isn't your personal Gmail. It also unlocks proper support later.",
    how: [
      "Free option: email forwarding (hello@yourdomain → your inbox) via Cloudflare Email Routing or your registrar.",
      "Put it in your footer / README / App Store listing.",
    ],
    resources: [{ label: "Cloudflare Email Routing", url: "https://www.cloudflare.com/developer-platform/email-routing/" }],
    effort: "S",
  },

  // ───────────────────────── STAGE 3: LANDING ─────────────────────────
  {
    id: "land-page",
    stage: "landing",
    title: "Ship a one-screen landing page",
    why: "Traffic without a landing page is water through a sieve. One screen: what it is, who it's for, one button.",
    how: [
      "Headline = the outcome the user gets, not the tech ('Ship your side project' beats 'AI-powered platform').",
      "One screenshot or 20-second demo GIF.",
      "One CTA: try it / download / star on GitHub. Not three.",
      "Build it in the same repo, or use Carrd/Framer if you want it done in an hour.",
    ],
    resources: [{ label: "Carrd", url: "https://carrd.co" }],
    effort: "M",
    assess: "Do you have a landing page (separate from the app itself)?",
  },
  {
    id: "land-valueprop",
    stage: "landing",
    title: "Pass the grandma test on your headline",
    why: "If a stranger can't repeat back what your product does after 5 seconds, your headline is costing you every visitor.",
    how: [
      "Send the page to 3 people. Ask: 'What does this do, and who is it for?'",
      "If any of them hesitates, rewrite. Formula: [do X] without [pain Y].",
      "Cut every adjective that a competitor could also claim.",
    ],
    effort: "S",
  },
  {
    id: "land-cta",
    stage: "landing",
    title: "Make the CTA actually work end-to-end",
    why: "A signup that errors, a download that 404s — you'll never hear about it, visitors just leave. Test the full path.",
    how: [
      "Click your own CTA in an incognito window on mobile.",
      "Go all the way: sign up / install / run — as a brand-new user.",
      "Fix the single worst point of friction you hit.",
    ],
    effort: "S",
  },
  {
    id: "land-analytics",
    stage: "landing",
    title: "Add privacy-friendly analytics",
    why: "Without analytics, launching is shouting into the void — you can't tell if 5 or 500 people came, or from where.",
    how: [
      "Add Plausible, Umami (self-host, free) or Vercel Analytics — one script tag.",
      "Track just two things for now: visits and CTA clicks.",
    ],
    resources: [
      { label: "Plausible", url: "https://plausible.io" },
      { label: "Umami", url: "https://umami.is" },
    ],
    effort: "S",
    assess: "Do you have analytics on your landing page or app?",
  },

  // ────────────────────────── STAGE 4: TRUST ──────────────────────────
  {
    id: "trust-cdn",
    stage: "trust",
    title: "Put Cloudflare in front of it",
    why: "Free DDoS protection, caching, and hiding your origin server. One angry script kiddie or an HN hug of death can take you down otherwise.",
    how: [
      "Move your DNS to Cloudflare (free plan) and enable the orange-cloud proxy.",
      "Turn on 'Bot Fight Mode' and Always Use HTTPS.",
      "Skip if you're fully on Vercel/Netlify/GH Pages — they absorb this for you; mark as done.",
    ],
    resources: [{ label: "Cloudflare free plan", url: "https://www.cloudflare.com/plans/free/" }],
    effort: "M",
    appliesTo: ["webapp", "api"],
    assess: "Is your app behind Cloudflare or a managed host that absorbs DDoS (Vercel/Netlify)?",
  },
  {
    id: "trust-ratelimit",
    stage: "trust",
    title: "Rate-limit your endpoints",
    why: "Any public endpoint that hits a database or an LLM API will be found by bots. Without limits, they can rack up your bill or take you down.",
    how: [
      "Add per-IP rate limiting on auth, signup, and any expensive endpoints.",
      "Easy options: Upstash Ratelimit, or middleware in your framework.",
      "Set aggressive limits on anything that costs you money per call.",
    ],
    resources: [{ label: "Upstash Ratelimit", url: "https://github.com/upstash/ratelimit-js" }],
    effort: "M",
    appliesTo: ["webapp", "api"],
  },
  {
    id: "trust-backups",
    stage: "trust",
    title: "Turn on database backups",
    why: "One bad migration or fat-fingered DELETE and your users' data is gone forever. Backups turn a catastrophe into a bad afternoon.",
    how: [
      "Managed DB (Supabase, Neon, PlanetScale): verify automatic backups are on and check retention.",
      "Self-hosted: set up a nightly dump to object storage (cron + pg_dump is fine).",
      "Do one restore test — an untested backup is a hope, not a backup.",
    ],
    effort: "S",
    appliesTo: ["webapp", "api"],
  },
  {
    id: "trust-deps",
    stage: "trust",
    title: "Automate dependency & vulnerability alerts",
    why: "Known CVEs in old packages are the #1 way small apps get owned. Automation makes this a zero-effort habit.",
    how: [
      "Enable Dependabot alerts + security updates on the GitHub repo (Settings → Security).",
      "Fix criticals when they appear; batch the rest monthly.",
    ],
    effort: "S",
  },
  {
    id: "trust-privacy",
    stage: "trust",
    title: "Add a privacy policy & terms",
    why: "Required by App Store / Play Store, by GDPR if you have EU visitors, and by most login providers. Also: users check for it.",
    how: [
      "Generate both with a free generator, host at /privacy and /terms.",
      "Say honestly what you collect (analytics, emails) and what you don't.",
      "Link them in your footer / app settings.",
    ],
    resources: [{ label: "GetTerms", url: "https://getterms.io" }],
    effort: "S",
    assess: "Do you have a privacy policy published?",
  },

  // ─────────────────────────── STAGE 5: SEO ───────────────────────────
  {
    id: "seo-meta",
    stage: "seo",
    title: "Set title & description on every page",
    why: "The <title> and meta description are what Google shows the world. Default 'React App' titles are invisible and unclickable.",
    how: [
      "Title: [Product] — [outcome in 6 words]. Under 60 chars.",
      "Description: 150 chars, include the words your users would search.",
      "Check every public page, not just the home page.",
    ],
    effort: "S",
    appliesTo: ["webapp", "api", "oss"],
    assess: "Do your pages have proper titles and meta descriptions?",
  },
  {
    id: "seo-og",
    stage: "seo",
    title: "Add social share previews (OG tags)",
    why: "When someone shares your link on X/Slack/Discord, a rich card gets 2-3x the clicks of a bare URL. This is free distribution.",
    how: [
      "Add og:title, og:description, og:image (1200×630) and twitter:card tags.",
      "Make the OG image a clean product shot with your one-liner.",
      "Validate with opengraph.xyz before calling it done.",
    ],
    resources: [{ label: "opengraph.xyz", url: "https://www.opengraph.xyz" }],
    effort: "S",
    appliesTo: ["webapp", "api", "oss"],
  },
  {
    id: "seo-sitemap",
    stage: "seo",
    title: "Add sitemap.xml + robots.txt, submit to Search Console",
    why: "Google can take weeks to find a new site on its own. Submitting a sitemap cuts that to days and shows you what people search to find you.",
    how: [
      "Generate sitemap.xml (Next.js: export a sitemap route) and a robots.txt allowing crawlers.",
      "Verify the site in Google Search Console, submit the sitemap.",
      "While there: check 'Performance' monthly for the queries you rank for.",
    ],
    resources: [{ label: "Google Search Console", url: "https://search.google.com/search-console" }],
    effort: "M",
    appliesTo: ["webapp", "api", "oss"],
    assess: "Is your site verified in Google Search Console with a sitemap?",
  },
  {
    id: "seo-aso",
    stage: "seo",
    title: "App store optimization basics",
    why: "The majority of app installs come from store search. Your title keywords and first two screenshots decide whether you appear and get tapped.",
    how: [
      "Put your strongest keyword in the app title/subtitle.",
      "First 2 screenshots: outcome-focused captions, not UI tours.",
      "Study the top 3 apps for your keyword and match their format.",
    ],
    effort: "M",
    appliesTo: ["mobile"],
  },
  {
    id: "seo-gh",
    stage: "seo",
    title: "Optimize your GitHub repo for discovery",
    why: "GitHub search and topic pages are a real acquisition channel for dev tools — and it takes 10 minutes.",
    how: [
      "Add 5-8 topics (Settings → Topics) matching what devs would search.",
      "Set the repo description to your one-liner + link to your site.",
      "Upload a social preview image (Settings → Social preview).",
    ],
    effort: "S",
    appliesTo: ["oss", "api"],
  },

  // ──────────────────────── STAGE 6: FEEDBACK ─────────────────────────
  {
    id: "fb-channel",
    stage: "feedback",
    title: "Open one visible feedback channel",
    why: "Early users WILL hit problems. If telling you isn't trivially easy, they won't — they'll just leave and you'll never know why.",
    how: [
      "Pick one: mailto link, Tally form, GitHub Discussions, or a small Discord.",
      "Put it where users already are: app footer, README, store listing.",
      "Reply to everything within 24h — early users become evangelists when they feel heard.",
    ],
    resources: [{ label: "Tally", url: "https://tally.so" }],
    effort: "S",
    assess: "Is there an obvious way for users to send you feedback?",
  },
  {
    id: "fb-ten",
    stage: "feedback",
    title: "Personally recruit your first 10 users",
    why: "The first 10 never come from 'launching'. They come from you asking humans, one at a time. This also forces you to articulate who it's for.",
    how: [
      "List 20 people/places where your exact user hangs out (friends, communities, coworkers).",
      "DM them personally: what you built, why you thought of them, one link. No blast.",
      "Track who actually tried it. 10 tried > 100 promised.",
    ],
    effort: "L",
  },
  {
    id: "fb-watch",
    stage: "feedback",
    title: "Watch 3 people use it — say nothing",
    why: "Users get stuck in places you can't imagine, and analytics won't tell you why. Watching one real session is worth 100 survey answers.",
    how: [
      "Screen-share or sit next to them. Give a task, not a tour: 'try to accomplish X'.",
      "Bite your tongue. Every time you want to explain, that's a bug in the product.",
      "Write down the top 3 stumbles.",
    ],
    effort: "M",
  },
  {
    id: "fb-friction",
    stage: "feedback",
    title: "Fix the #1 friction point",
    why: "One fixed stumble compounds across every future user. Ship the fix while the observation is fresh.",
    how: [
      "Take the top stumble from watching users. Fix that one thing.",
      "Re-test the same task with one person to confirm it's gone.",
    ],
    effort: "M",
  },

  // ───────────────────────── STAGE 7: LAUNCH ──────────────────────────
  {
    id: "ln-assets",
    stage: "launch",
    title: "Make your launch kit: demo GIF + 3 lines",
    why: "Every channel needs the same three things. Making them once, well, is the difference between a launch and a link dump.",
    how: [
      "A 30-60s demo video or GIF showing the core magic moment.",
      "Three sizes of pitch: 1 line (X), 3 lines (Reddit/HN), 1 paragraph (PH).",
      "Lead with the problem, not the tech stack.",
    ],
    resources: [{ label: "Screen Studio", url: "https://screen.studio" }],
    effort: "M",
  },
  {
    id: "ln-community",
    stage: "launch",
    title: "Soft-launch in 2 communities where your users live",
    why: "Niche communities convert better than big launches — the audience is pre-qualified, and feedback is faster and kinder.",
    how: [
      "Pick 2: a subreddit, Discord, Slack, or forum for your exact niche.",
      "Read the self-promo rules first. Frame as 'I built this for [problem], would love feedback'.",
      "Stay in the thread all day and answer everything.",
    ],
    effort: "M",
  },
  {
    id: "ln-big",
    stage: "launch",
    title: "Do one big launch: Product Hunt or Show HN",
    why: "One concentrated spike of traffic, backlinks, and feedback. Even a modest launch seeds your SEO and gives you social proof.",
    how: [
      "Pick ONE: Product Hunt (broad/consumer) or Show HN (dev tools).",
      "PH: launch 12:01am PT, rally your first users for genuine comments.",
      "HN: title 'Show HN: X – one-line outcome', first comment = your honest backstory.",
      "Whatever happens, it's a win: backlinks are forever.",
    ],
    resources: [
      { label: "Show HN rules", url: "https://news.ycombinator.com/showhn.html" },
      { label: "Product Hunt launch guide", url: "https://www.producthunt.com/launch" },
    ],
    effort: "L",
    assess: "Have you already launched publicly (PH / HN / big community post)?",
  },
  {
    id: "ln-directories",
    stage: "launch",
    title: "Submit to 5 directories & alternative lists",
    why: "Slow-burn distribution: each listing is a permanent backlink and a trickle of qualified visitors, for 20 minutes of work.",
    how: [
      "Submit to 5 relevant ones: AlternativeTo, ToolFinder, awesome-* lists (OSS), There's An AI For That (AI tools), etc.",
      "Reuse your launch kit copy.",
    ],
    resources: [{ label: "AlternativeTo", url: "https://alternativeto.net" }],
    effort: "S",
  },
  {
    id: "ln-public",
    stage: "launch",
    title: "Start building in public",
    why: "People follow journeys, not products. Sharing progress compounds into an audience you'll own for every future launch.",
    how: [
      "Pick one platform: X, LinkedIn, or a devlog.",
      "Post one real thing per week: a metric, a lesson, a screenshot. 15 minutes, no polish.",
      "Reply to everyone who engages.",
    ],
    effort: "S",
  },

  // ──────────────────────── STAGE 8: SUPPORT ──────────────────────────
  {
    id: "sup-coffee",
    stage: "support",
    title: "Add a 'Buy me a coffee' / Sponsor button",
    why: "Some users WANT to support you — give them a way. Even $15/month changes your relationship with the project: someone is literally invested.",
    how: [
      "Create a Buy Me a Coffee page (or Ko-fi). OSS: enable GitHub Sponsors too.",
      "Add the button to your footer, README, and about page.",
      "Frame it honestly: 'This is free. If it saves you time, coffee fuels development.'",
    ],
    resources: [
      { label: "Buy Me a Coffee", url: "https://buymeacoffee.com" },
      { label: "GitHub Sponsors", url: "https://github.com/sponsors" },
    ],
    effort: "S",
    assess: "Do you have a Buy Me a Coffee / Sponsors button live?",
  },
  {
    id: "sup-value",
    stage: "support",
    title: "Ask 5 users: 'what would make this worth paying for?'",
    why: "You said no subscriptions yet — smart. But collecting willingness-to-pay signals NOW means when you do monetize, you build the right thing.",
    how: [
      "Ask your 5 most active users, individually.",
      "Don't pitch. Just listen and write down exact words.",
      "Save the answers — this is your future pricing page.",
    ],
    effort: "M",
  },

  // ─────────────────────── STAGE 9: MOMENTUM ──────────────────────────
  {
    id: "mo-changelog",
    stage: "momentum",
    title: "Publish a changelog",
    why: "A public changelog proves the project is alive — the #1 thing people check before adopting a small tool. It's also free content.",
    how: [
      "A /changelog page or CHANGELOG.md is enough.",
      "Every release: 2-3 human sentences, not commit messages.",
      "Cross-post big entries to your build-in-public channel.",
    ],
    effort: "S",
  },
  {
    id: "mo-email",
    stage: "momentum",
    title: "Start capturing emails",
    why: "Social reach is rented; an email list is owned. Even 50 subscribers is a launch army for your next release.",
    how: [
      "Add a one-field email box: 'Get updates when we ship'.",
      "Buttondown or Loops free tiers are plenty.",
      "Email only when you ship something real.",
    ],
    resources: [{ label: "Buttondown", url: "https://buttondown.com" }],
    effort: "S",
  },
  {
    id: "mo-rhythm",
    stage: "momentum",
    title: "Set a weekly review ritual",
    why: "Projects don't die from bad code — they die from silent weeks. A 20-minute weekly review is the cheapest life support that exists.",
    how: [
      "Same time every week: check analytics, read feedback, pick next week's ONE goal.",
      "Log one sentence of progress in your build-in-public channel.",
      "And come back here — that's what this platform is for. ☕",
    ],
    effort: "S",
  },
  {
    id: "mo-milestone",
    stage: "momentum",
    title: "Define your next milestone: what does '1' mean?",
    why: "You've done the 0→1 mechanics. Now '1' needs a number: 100 users? 10 daily actives? First $50 in coffees? A goal makes every week legible.",
    how: [
      "Pick ONE metric and a 90-day target.",
      "Write it at the top of your README or a pinned note.",
      "Work backwards: what has to be true each month to hit it?",
    ],
    effort: "S",
  },
];

export const stageById = (id: string) => STAGES.find((s) => s.id === id)!;
export const stepById = (id: string) => STEPS.find((s) => s.id === id);
