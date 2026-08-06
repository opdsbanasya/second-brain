import { useState, useEffect } from "react";
import { KeyRound, User, Copy, Trash, Plug } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { restoreSession } from "@/store/slices/authSlice";
import api from "@/lib/api";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");

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

  const updateName = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    setSavingName(true);
    try {
      await api.put("/users/update", { name: name.trim() });
      await dispatch(restoreSession()).unwrap();
      toast.success("Name updated");
    } catch (error: any) {
      toast.error("Could not update name", {
        description: error.response?.data?.message,
      });
    } finally {
      setSavingName(false);
    }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwords.password !== passwords.confirmPassword)
      return toast.error("New passwords do not match");
    setSavingPassword(true);
    try {
      await api.put("/users/update", {
        currentPassword: passwords.currentPassword,
        password: passwords.password,
      });
      setPasswords({ currentPassword: "", password: "", confirmPassword: "" });
      toast.success("Password changed");
    } catch (error: any) {
      toast.error("Could not change password", {
        description: error.response?.data?.message,
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const generateApiKey = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newKeyName.trim()) return toast.error("Key name cannot be empty");
    try {
      const { data } = await api.post("/api-key", { name: newKeyName.trim() });
      setGeneratedKey(data.apiKey.key);
      setNewKeyName("");
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <section className="mx-auto max-w-xl py-8">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your account details and password.
      </p>
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <form
          className="mt-6 space-y-3 border-t border-border pt-6"
          onSubmit={updateName}
        >
          <Label htmlFor="profile-name">Display name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <Button type="submit" disabled={savingName}>
            {savingName ? "Saving..." : "Save name"}
          </Button>
        </form>
      </div>
      <form
        className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6"
        onSubmit={changePassword}
      >
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Change password</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your current password before setting a new one.
          </p>
        </div>

        <Field
          id="current-password"
          label="Current password"
          value={passwords.currentPassword}
          onChange={(value) =>
            setPasswords({ ...passwords, currentPassword: value })
          }
        />

        <Field
          id="new-password"
          label="New password"
          value={passwords.password}
          onChange={(value) => setPasswords({ ...passwords, password: value })}
        />

        <Field
          id="confirm-password"
          label="Confirm new password"
          value={passwords.confirmPassword}
          onChange={(value) =>
            setPasswords({ ...passwords, confirmPassword: value })
          }
        />

        <p className="text-xs text-muted-foreground">
          Use at least 8 characters with uppercase, lowercase, number, and
          special character.
        </p>

        <Button type="submit" disabled={savingPassword}>
          {savingPassword ? "Updating..." : "Update password"}
        </Button>
      </form>

      {/* API Keys Section */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Plug className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Personal Access Tokens</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Use these tokens to access your Second Brain via the API or MCP servers.
          </p>
        </div>

        {generatedKey && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="font-medium text-primary">Save your new key</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Please copy this key and store it securely. For security reasons, we will not show it to you again.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono border border-border overflow-x-auto">
                {generatedKey}
              </code>
              <Button size="icon" variant="outline" onClick={() => copyToClipboard(generatedKey)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={() => setGeneratedKey("")}>
              I have saved my key
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {loadingKeys ? (
            <p className="text-sm text-muted-foreground">Loading tokens...</p>
          ) : apiKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No access tokens generated yet.</p>
          ) : (
            apiKeys.map((key) => (
              <div key={key._id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{key.name}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    ••••••••••••{key.key.slice(-4)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Created: {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => revokeApiKey(key._id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={generateApiKey} className="mt-6 flex items-end gap-3 border-t border-border pt-6">
          <div className="flex-1 space-y-2">
            <Label htmlFor="key-name">New token name</Label>
            <Input 
              id="key-name" 
              placeholder="e.g. MCP Server Desktop" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <Button type="submit">Generate</Button>
        </form>
      </div>

    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}
