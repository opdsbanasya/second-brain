import { Link, useLocation, useNavigate } from "react-router";
import { Brain, Eye, EyeOff, Search, FileText, BookOpen, Link as LinkIcon, Video, Check, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, clearError } from "@/store/slices/authSlice";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg className="h-4 w-4 fill-current shrink-0 text-neutral-900" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
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
  }, [dispatch, isAuthenticated, navigate, location]);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    dispatch(login({ email: data.email, password: data.password }));
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-neutral-900 font-sans selection:bg-[#4F46E5]/10 selection:text-[#4F46E5]">
      {/* LEFT SIDE: Brand & Clean Product Showcase (Linear / Raycast Vibe) */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-8 lg:p-12 xl:p-16 bg-[#090D16] text-white relative overflow-hidden">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-bold text-xl tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#4F46E5] text-white shadow-sm">
              <Brain className="h-5 w-5" />
            </div>
            <span>Second Brain</span>
          </Link>

          <div className="max-w-md space-y-3 pt-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Your knowledge, searchable forever.
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Find notes, links, articles and ideas in milliseconds.
            </p>
          </div>
        </div>

        {/* Product UI Preview Widget */}
        <div className="relative z-10 my-8">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Search className="h-4 w-4 text-[#4F46E5]" />
              <span className="text-xs font-mono text-neutral-400">Search:</span>
              <span className="text-xs font-mono font-medium text-indigo-200 bg-[#4F46E5]/20 px-2 py-0.5 rounded-md border border-[#4F46E5]/30">
                MCP Protocol
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-2.5 text-xs text-neutral-200 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-medium">Roadmap Building MCP</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">2m ago</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-2.5 text-xs text-neutral-200 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="font-medium">FastAPI Notes</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">1h ago</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-2.5 text-xs text-neutral-200 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <LinkIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">System Design Architecture</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Yesterday</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-2.5 text-xs text-neutral-200 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <Video className="h-4 w-4 text-rose-400 shrink-0" />
                  <span className="font-medium">AI Resources & Video Course</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">3 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Footer Stats */}
        <div className="relative z-10 flex items-center gap-6 text-xs text-neutral-400 font-medium pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-[#4F46E5]" />
            <span>12,000+ notes saved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-[#4F46E5]" />
            <span>99.9% uptime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-[#4F46E5]" />
            <span>Private by default</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form (Linear / Stripe Vibe) */}
      <div className="flex w-full md:w-1/2 flex-col justify-between p-6 sm:p-12 lg:p-16 relative bg-white">
        {/* Mobile Header Logo */}
        <div className="md:hidden flex items-center justify-between w-full mb-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-neutral-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#4F46E5] text-white">
              <Brain className="h-4 w-4" />
            </div>
            <span>Second Brain</span>
          </Link>
        </div>

        <div className="my-auto w-full max-w-sm mx-auto space-y-7">
          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Sign in to your workspace
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Continue where you left off.
            </p>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {}}
                className="h-11 rounded-2xl border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 font-medium text-xs text-neutral-700 transition-all gap-2 shadow-2xs cursor-pointer"
              >
                <GoogleIcon />
                <span>Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {}}
                className="h-11 rounded-2xl border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 font-medium text-xs text-neutral-700 transition-all gap-2 shadow-2xs cursor-pointer"
              >
                <GithubIcon />
                <span>GitHub</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="shrink-0 px-3 text-xs text-neutral-400 font-medium">
                or continue with email
              </span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium p-3.5 rounded-2xl">
              {error}
            </div>
          )}

          {/* Email & Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-neutral-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                {...formRegister("email")}
                autoComplete="email"
                placeholder="name@example.com"
                className="h-11 bg-white border border-neutral-200 hover:border-neutral-300 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 rounded-2xl shadow-2xs transition-all text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400"
              />
              {formErrors.email && <p className="text-xs text-rose-600">{formErrors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-neutral-700">
                  Password
                </Label>
                <Link
                  to="#"
                  className="text-xs text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...formRegister("password")}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 bg-white border border-neutral-200 hover:border-neutral-300 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 rounded-2xl shadow-2xs transition-all text-xs sm:text-sm pr-10 text-neutral-900 placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formErrors.password && <p className="text-xs text-rose-600">{formErrors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-2xs transition-all cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Bottom Switch Link */}
          <div className="text-center text-xs text-neutral-500 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Trust Footer Section */}
          <div className="pt-6 border-t border-neutral-100 flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white bg-slate-100 text-slate-600">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white bg-indigo-100 text-indigo-600">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white bg-teal-100 text-teal-600">
                <UserIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-[11px] leading-tight text-neutral-500 font-medium">
              Trusted by developers & researchers. <span className="text-neutral-900 font-semibold hidden">12k+ notes saved</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
