import { Link } from "react-router";
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register, clearError } from "@/store/slices/authSlice";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate(location.state?.from || "/dashboard", { replace: true });
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ name, email, password }));
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Column - Form (Minimalism 80%) */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-8 sm:p-12 relative order-2 lg:order-1">
        <Link
          to="/"
          className="absolute top-8 left-8 lg:hidden flex items-center gap-2 font-bold text-xl"
        >
          <Brain className="h-6 w-6 text-primary" />
          Second Brain
        </Link>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to get started.
            </p>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary shadow-none transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full shadow-none group transition-all"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && (
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Branding / Aesthetic (Glassmorphism 20%) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-zinc-950 text-white order-1 lg:order-2">
        {/* Abstract background elements */}
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex justify-end w-full relative z-10">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl hover:opacity-90 transition-opacity"
          >
            SecondBrain
            <Brain className="h-8 w-8 text-primary" />
          </Link>
        </div>

        {/* Glassmorphism Card */}
        <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl max-w-lg self-end text-right">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed">
              "Finally, a place where my ideas can breathe. The tags and instant
              search mean I never lose a thought again."
            </p>
            <footer className="text-sm text-zinc-400">
              — Sarah Chen, Researcher
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
