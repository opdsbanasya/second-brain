
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export default function PrivacyPagePage() {
  return <PrivacyPage />;
}

const sections = [
  {
    title: "1. What we collect",
    body: "We collect the minimum necessary to run the service: your name, email address, and the content you choose to save. We do not buy data from third parties and we do not enrich your profile with external sources.",
  },
  {
    title: "2. How we use it",
    body: "Your content is used to power your archive — nothing else. We use aggregate, anonymized usage data (e.g. 'how many users used search this week') to improve the product.",
  },
  {
    title: "3. Authentication",
    body: "Sessions are stored in HTTP-only cookies, not in localStorage. This protects your session token from cross-site scripting (XSS) attacks. We never expose tokens to client-side JavaScript.",
  },
  {
    title: "4. Sharing",
    body: "When you create a share link, that link is unguessable and unindexed. Revoking it disables access immediately. You can audit and revoke shares at any time from the Shared links page.",
  },
  {
    title: "5. Third parties",
    body: "We use a small set of subprocessors (hosting, transactional email, error monitoring). None of them receive your saved content beyond what is strictly necessary to deliver the service.",
  },
  {
    title: "6. Your rights",
    body: "You can export, edit, or permanently delete your data at any time from the Profile page. Deletion is irreversible and propagates to backups within 30 days.",
  },
  {
    title: "7. Children",
    body: "Second Brain is not directed at children under 13. We do not knowingly collect data from anyone under 13.",
  },
  {
    title: "8. Changes to this policy",
    body: "If we change anything material, we'll email you and post a notice on the site at least 14 days before it takes effect.",
  },
  {
    title: "9. Contact",
    body: "Questions? Email privacy@secondbrain.app and a real human will reply.",
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">Legal</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 16, 2026</p>

        <p className="mt-8 text-base leading-relaxed text-muted-foreground">
          We wrote this policy in plain English because that's how privacy
          policies should be written. The short version: we collect what we
          need, we don't sell it, and you can delete it whenever you want.
        </p>

        <div className="mt-12 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
