import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return <section className="grid min-h-[50vh] place-items-center text-center">
    <div><p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">The page you requested does not exist or may have moved.</p>
      <Button className="mt-6" asChild>
        <Link to="/">Back home</Link>
      </Button>
    </div>
  </section>;
}
