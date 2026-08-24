import { useState, useEffect } from "react";
import { User, KeyRound, Settings, Plug, Copy, Trash, Check, Shield, Code2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { restoreSession } from "@/store/slices/authSlice";
import api from "@/lib/api";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const nameSchema = z.object({ name: z.string().min(1, "Name is required") });
type NameFormValues = z.infer<typeof nameSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  password: z.string().min(8, "Minimum 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
type PasswordFormValues = z.infer<typeof passwordSchema>;

const apiKeySchema = z.object({ newKeyName: z.string().min(1, "Key name required") });
type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

type SettingsTab = "profile" | "password" | "settings";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // API Keys state
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [generatedKey, setGeneratedKey] = useState("");

  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const { register: registerName, handleSubmit: handleNameSubmit, formState: { errors: nameErrors }, reset: resetName } = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: user?.name ?? "" }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const { register: registerKey, handleSubmit: handleKeySubmit, formState: { errors: keyErrors }, reset: resetKey } = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema)
  });

  const fetchApiKeys = async () => {
    try {
      const { data } = await api.get("/api-key");
      setApiKeys(data.apiKeys || []);
    } catch (error) {
      toast.error("Failed to load API keys");
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const updateName = async (data: NameFormValues) => {
    setSavingName(true);
    try {
      await api.put("/users/me", { name: data.name.trim() });
      await dispatch(restoreSession()).unwrap();
      toast.success("Name updated successfully");
    } catch (error: any) {
      toast.error("Could not update name", {
        description: error.response?.data?.message,
      });
    } finally {
      setSavingName(false);
    }
  };

  const changePassword = async (data: PasswordFormValues) => {
    setSavingPassword(true);
    try {
      await api.put("/users/me", {
        currentPassword: data.currentPassword,
        password: data.password,
      });
      resetPassword({ currentPassword: "", password: "", confirmPassword: "" });
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error("Could not change password", {
        description: error.response?.data?.message,
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const generateApiKey = async (data: ApiKeyFormValues) => {
    try {
      const response = await api.post("/api-key", { name: data.newKeyName.trim() });
      setGeneratedKey(response.data.apiKey.key);
      resetKey({ newKeyName: "" });
      fetchApiKeys();
      toast.success("API key generated successfully");
    } catch (error: any) {
      toast.error("Could not generate key", {
        description: error.response?.data?.message,
      });
    }
  };

  const revokeApiKey = async (id: string) => {
    if (!window.confirm("Are you sure you want to revoke this API key? This cannot be undone.")) return;
    try {
      await api.delete(`/api-key/${id}`);
      fetchApiKeys();
      toast.success("API key revoked");
    } catch (error) {
      toast.error("Failed to revoke API key");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (e) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased selection:bg-[#4F46E5]/10 selection:text-[#4F46E5]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-12 lg:flex-row">
        
        {/* Left Sidebar Navigation Tabs */}
        <aside className="w-full shrink-0 select-none space-y-2 lg:w-64">
          <div className="mb-4 px-2">
            <h1 className="font-heading font-extrabold text-2xl tracking-tight text-[#0F172A]">
              Account Settings
            </h1>
            <p className="text-xs font-medium text-[#64748B] mt-0.5">
              Manage your personal preferences
            </p>
          </div>

          <div className="space-y-1 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[#0F172A] hover:bg-slate-100"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "password"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[#0F172A] hover:bg-slate-100"
              }`}
            >
              <KeyRound className="h-4 w-4" />
              <span>Password</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[#0F172A] hover:bg-slate-100"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings & API</span>
            </button>
          </div>
        </aside>

        {/* Right Active Panel Content */}
        <main className="min-w-0 flex-1">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-2xs">
            
            {/* TAB 1: PROFILE */}
            {activeTab === "profile" && (
              <div className="space-y-8 max-w-xl">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#0F172A]">
                    Profile Settings
                  </h2>
                  <p className="text-xs font-medium text-[#64748B] mt-1">
                    Update your public display name and account details.
                  </p>
                </div>

                {/* User Avatar Card */}
                <div className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4F46E5] text-white font-heading font-bold text-lg shadow-xs">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0F172A]">
                      {user?.name}
                    </h3>
                    <p className="text-xs font-medium text-[#64748B]">{user?.email}</p>
                  </div>
                </div>

                <form onSubmit={handleNameSubmit(updateName)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name" className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Display Name
                    </Label>
                    <Input
                      id="profile-name"
                      {...registerName("name")}
                      placeholder="Your name..."
                      className="h-10 text-sm border-[#E2E8F0] bg-white text-[#0F172A] focus-visible:ring-[#4F46E5]"
                    />
                    {nameErrors.name && <p className="text-xs text-rose-600">{nameErrors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email" className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Email Address
                    </Label>
                    <Input
                      id="profile-email"
                      value={user?.email || ""}
                      disabled
                      className="h-10 text-sm border-[#E2E8F0] bg-slate-100 text-[#64748B] cursor-not-allowed"
                    />
                    <p className="text-[11px] text-[#94A3B8]">Email address is managed by authentication system.</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={savingName}
                    className="bg-[#4F46E5] text-white hover:bg-[#4338CA] font-semibold text-xs px-6 h-10 rounded-lg shadow-xs"
                  >
                    {savingName ? "Saving Changes..." : "Save Name"}
                  </Button>
                </form>
              </div>
            )}

            {/* TAB 2: PASSWORD */}
            {activeTab === "password" && (
              <div className="space-y-8 max-w-xl">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#0F172A]">
                    Password & Security
                  </h2>
                  <p className="text-xs font-medium text-[#64748B] mt-1">
                    Ensure your account is using a long, random password to stay secure.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit(changePassword)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      {...registerPassword("currentPassword")}
                      placeholder="••••••••••••"
                      className="h-10 text-sm border-[#E2E8F0] bg-white text-[#0F172A] focus-visible:ring-[#4F46E5]"
                    />
                    {passwordErrors.currentPassword && <p className="text-xs text-rose-600">{passwordErrors.currentPassword.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      {...registerPassword("password")}
                      placeholder="••••••••••••"
                      className="h-10 text-sm border-[#E2E8F0] bg-white text-[#0F172A] focus-visible:ring-[#4F46E5]"
                    />
                    {passwordErrors.password && <p className="text-xs text-rose-600">{passwordErrors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      {...registerPassword("confirmPassword")}
                      placeholder="••••••••••••"
                      className="h-10 text-sm border-[#E2E8F0] bg-white text-[#0F172A] focus-visible:ring-[#4F46E5]"
                    />
                    {passwordErrors.confirmPassword && <p className="text-xs text-rose-600">{passwordErrors.confirmPassword.message}</p>}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-[#64748B]">
                    Use at least 8 characters with a mix of uppercase, lowercase, numbers, and special symbols.
                  </div>

                  <Button
                    type="submit"
                    disabled={savingPassword}
                    className="bg-[#4F46E5] text-white hover:bg-[#4338CA] font-semibold text-xs px-6 h-10 rounded-lg shadow-xs"
                  >
                    {savingPassword ? "Updating Password..." : "Update Password"}
                  </Button>
                </form>
              </div>
            )}

            {/* TAB 3: SETTINGS & API KEYS */}
            {activeTab === "settings" && (
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#0F172A]">
                    Settings & API Integration
                  </h2>
                  <p className="text-xs font-medium text-[#64748B] mt-1">
                    Manage Personal Access Tokens (PATs) for connecting Second Brain to MCP Servers, Claude Desktop, and Cursor.
                  </p>
                </div>

                {/* Generated Key Modal Notice */}
                {generatedKey && (
                  <div className="rounded-xl border border-[#4F46E5]/30 bg-[#4F46E5]/5 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#4F46E5]">
                      <Shield className="h-4 w-4" />
                      Save Your New Personal Access Token
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Please copy this key now. For security reasons, it will not be displayed again.
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 font-mono text-xs text-[#0F172A] overflow-x-auto">
                        {generatedKey}
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(generatedKey)}
                        className="shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setGeneratedKey("")}
                      className="w-full bg-[#4F46E5] text-white hover:bg-[#4338CA] text-xs font-semibold"
                    >
                      I have saved my token
                    </Button>
                  </div>
                )}

                {/* Active Tokens List */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
                    Active Tokens
                  </h3>

                  {loadingKeys ? (
                    <p className="text-xs text-[#64748B] italic">Loading access tokens...</p>
                  ) : apiKeys.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#E2E8F0] p-6 text-center text-xs text-[#64748B]">
                      No access tokens generated yet. Create one below to connect your AI tools.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {apiKeys.map((key) => (
                        <div
                          key={key._id}
                          className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs"
                        >
                          <div>
                            <p className="font-heading font-bold text-sm text-[#0F172A]">{key.name}</p>
                            <p className="font-mono text-xs text-[#64748B] mt-0.5">
                              {key.shortKey ? `••••••••••••${key.shortKey.slice(-4)}` : '••••••••••••••••'}
                            </p>
                            <p className="text-[10px] text-[#94A3B8] mt-1">
                              Created: {new Date(key.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => revokeApiKey(key._id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Revoke Token"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate Token Form */}
                <form onSubmit={handleKeySubmit(generateApiKey)} className="space-y-4 border-t border-[#E2E8F0] pt-6">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
                    Generate New Personal Access Token
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="key-name" className="text-xs font-semibold text-[#64748B]">
                        Token Description / App Name
                      </Label>
                      <Input
                        id="key-name"
                        placeholder="e.g. Claude Desktop, Cursor IDE"
                        {...registerKey("newKeyName")}
                        className="h-10 text-sm border-[#E2E8F0] bg-white text-[#0F172A]"
                      />
                      {keyErrors.newKeyName && <p className="text-xs text-rose-600 mt-1">{keyErrors.newKeyName.message}</p>}
                    </div>
                    <Button
                      type="submit"
                      className="bg-[#4F46E5] text-white hover:bg-[#4338CA] font-semibold text-xs px-6 h-10 rounded-lg shadow-xs"
                    >
                      Generate Token
                    </Button>
                  </div>
                </form>

                {/* Quick MCP Config Snippet */}
                <div className="space-y-3 border-t border-[#E2E8F0] pt-6">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0F172A]">
                    <Code2 className="h-4 w-4 text-[#4F46E5]" />
                    Claude Desktop Integration Snippet
                  </div>
                  <pre className="rounded-xl border border-[#E2E8F0] bg-[#0F172A] p-4 text-xs font-mono text-slate-200 overflow-x-auto">
{`"second-brain": {
  "command": "node",
  "args": ["../second-brain/mcp/dist/index.js"],
  "env": {
    "SECOND_BRAIN_API_KEY": "<YOUR_TOKEN_HERE>",
    "SECOND_BRAIN_API_URL": "http://localhost:3000/api/v1/"
  }
}`}
                  </pre>
                </div>

                {/* GitHub */}
                <div>
                  <p>Follow the steps on <Link to="https://github.com/opdsbanasya/second-brain" target="_blank">GitHub</Link> to connect your GitHub repositories.</p>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
