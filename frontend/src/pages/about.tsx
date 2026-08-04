import { Link } from "react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Compass, Sprout } from "lucide-react";

export default function AboutPagePage() {
  return <AboutPage />;
}

const values = [
  {
    icon: Heart,
    title: "Calm by default",
    desc: "We design against noise. Fewer pixels, more breathing room.",
  },
  {
    icon: Compass,
    title: "Yours, forever",
    desc: "Export anytime. Your archive should outlive any single app.",
  },
  {
    icon: Sprout,
    title: "Quietly powerful",
    desc: "We hide complexity until you need it — then it's right there.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          About
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Built for people who think for a living.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Second Brain started as a private side-project — a single text file
          where one of us dumped every link, half-thought and article worth
          remembering. It outgrew the file. It outgrew Notion, Pocket, Apple
          Notes and a chain of bookmark managers nobody remembers the name of.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          We wanted something quieter. Something that respected the content
          instead of competing with it. So we built it.
        </p>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            What we value
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            A few quiet principles.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { k: "12k+", v: "Curious minds saving daily" },
              { k: "1.4M", v: "Items captured this year" },
              { k: "99.9%", v: "Uptime over the last 90 days" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-border bg-card p-8 text-center"
              >
                <div className="text-3xl font-semibold text-foreground">
                  {s.k}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Come build your own.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            It takes ninety seconds. We promise we won't email you twice a week.
          </p>
          <Button size="lg" asChild className="mt-8 gap-2">
            <Link to="/dashboard">
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
