import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Sparkles, Brain, Tag, Share2, Search, Lock, Zap, Star, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Second Brain — Save, tag, and share what matters" },
      { name: "description", content: "A calm home for the notes, links, and articles you want to remember." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Brain,  title: "Capture anything",   desc: "Notes, links, articles, videos — all in one quiet place." },
  { icon: Tag,    title: "Organize with tags", desc: "Pastel tags do the heavy lifting. Filter in a single click." },
  { icon: Search, title: "Find in a keystroke",desc: "Instant search across every word you've ever saved." },
  { icon: Share2, title: "Share, revoke, repeat", desc: "Generate a public link, kill it whenever you like." },
  { icon: Lock,   title: "Private by default",  desc: "Your archive is yours. HTTP-only cookies, no token leaks." },
  { icon: Zap,    title: "Built for speed",     desc: "Keyboard-first interactions and a thoughtful, calm UI." },
];

const steps = [
  { n: "01", title: "Save",     desc: "Drop in a link, jot a note, or clip an article." },
  { n: "02", title: "Tag",      desc: "Add a few pastel tags so future-you can find it." },
  { n: "03", title: "Recall",   desc: "Search or filter — your second brain answers in milliseconds." },
];

const testimonials = [
  { quote: "Finally an archive I actually re-open. The tag sidebar alone replaced three other apps.", name: "Maya R.", role: "Product designer" },
  { quote: "Calm, fast, and the share-link revoke is exactly what I needed for client work.",          name: "Theo K.", role: "Indie consultant" },
  { quote: "It feels like Notion, Pocket and Linear had a very tasteful baby.",                       name: "Sana P.", role: "Engineering lead" },
];

const faqs = [
  { q: "Is my data private?",                a: "Yes. Auth uses HTTP-only cookies and your content is only accessible to you unless you explicitly create a share link." },
  { q: "Can I revoke a shared link?",        a: "Anytime. Head to /shared-links and hit Revoke — the link dies immediately." },
  { q: "Do you support import from Pocket?", a: "CSV import is on the roadmap. For now you can paste links one at a time or via the bulk dialog." },
  { q: "Is there a free plan?",              a: "Yes — generous free tier, and paid plans only if you need more storage or team features." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Your calm, searchable archive
        </div>
        <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
          Save what matters.<br />
          <span className="text-muted-foreground">Find it when it matters.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          A second brain for notes, links, and articles — organized with tags,
          searchable in a keystroke, and shareable with one click.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild className="gap-2">
            <Link to="/dashboard">Open dashboard <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link to="/about">Learn more</Link>
          </Button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
          </div>
          Loved by 12,000+ curious minds
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow="Features" title="Everything your future self will thank you for" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/30">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow="How it works" title="Three quiet steps. Forever." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <div className="text-xs font-semibold text-primary">{s.n}</div>
                <h3 className="mt-3 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow="Testimonials" title="What people are saying" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-card p-6">
                <Quote className="h-4 w-4 text-primary" />
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{t.name}</span> · {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <SectionHeading eyebrow="FAQ" title="Answers to the obvious questions" center />
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 open:border-primary/30">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">
                  {f.q}
                  <span className="text-muted-foreground transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Start your second brain today.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Free to try. Takes about ninety seconds to fall in love with.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild className="gap-2">
              <Link to="/dashboard">Get started free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionHeading({ eyebrow, title, center }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
    </div>
  );
}
