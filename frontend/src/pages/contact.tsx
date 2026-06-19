
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export default function ContactPagePage() {
  return <ContactPage />;
}

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Mock: POST /api/contact
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent!", { description: "We'll get back to you within a day or two." });
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Contact</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Say hello.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Bug report, feature wish, or just want to chat about second brains?
              Pick whichever feels right.
            </p>

            <div className="mt-10 space-y-5">
              {[
                { icon: Mail,          title: "Email",   value: "hello@secondbrain.app" },
                { icon: MessageSquare, title: "Support", value: "support@secondbrain.app" },
                { icon: MapPin,        title: "Office",  value: "Remote-first · headquartered nowhere" },
              ].map(({ icon: Icon, title, value }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
                    <div className="mt-0.5 text-sm text-foreground">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimalist solid form card */}
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" id="name"><Input id="name" name="name" required placeholder="Ada Lovelace" /></Field>
              <Field label="Email" id="email"><Input id="email" name="email" type="email" required placeholder="you@example.com" /></Field>
            </div>
            <Field label="Subject" id="subject" className="mt-4">
              <Input id="subject" name="subject" required placeholder="A bug, an idea, a 'hello'..." />
            </Field>
            <Field label="Message" id="message" className="mt-4">
              <Textarea id="message" name="message" required rows={5} placeholder="Tell us a little more." />
            </Field>
            <Button type="submit" size="lg" disabled={sending} className="mt-6 w-full">
              {sending ? "Sending..." : "Send message"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              We'll reply within 1–2 business days.
            </p>
          </form>
        </div>
      </section>

      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

function Field({
  label, id, className, children,
}: { label: string; id: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block text-xs font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}
