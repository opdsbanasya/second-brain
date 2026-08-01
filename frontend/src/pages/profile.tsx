import { useState } from "react";
import { KeyRound, User } from "lucide-react";
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
  const [passwords, setPasswords] = useState({ currentPassword: "", password: "", confirmPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  const updateName = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    setSavingName(true);
    try {
      await api.put("/users/update", { name: name.trim() });
      await dispatch(restoreSession()).unwrap();
      toast.success("Name updated");
    } catch (error: any) {
      toast.error("Could not update name", { description: error.response?.data?.message });
    } finally { setSavingName(false); }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwords.password !== passwords.confirmPassword) return toast.error("New passwords do not match");
    setSavingPassword(true);
    try {
      await api.put("/users/update", { currentPassword: passwords.currentPassword, password: passwords.password });
      setPasswords({ currentPassword: "", password: "", confirmPassword: "" });
      toast.success("Password changed");
    } catch (error: any) {
      toast.error("Could not change password", { description: error.response?.data?.message });
    } finally { setSavingPassword(false); }
  };

  return <section className="mx-auto max-w-xl py-8">
    <h1 className="text-2xl font-semibold">Profile</h1>
    <p className="mt-1 text-sm text-muted-foreground">Manage your account details and password.</p>
    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground"><User className="h-5 w-5" /></div><div><p className="font-semibold">{user?.name}</p><p className="text-sm text-muted-foreground">{user?.email}</p></div></div>
      <form className="mt-6 space-y-3 border-t border-border pt-6" onSubmit={updateName}>
        <Label htmlFor="profile-name">Display name</Label>
        <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required />
        <Button type="submit" disabled={savingName}>{savingName ? "Saving..." : "Save name"}</Button>
      </form>
    </div>
    <form className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6" onSubmit={changePassword}>
      <div>
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Change password</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Enter your current password before setting a new one.</p>
      </div>

      <Field
        id="current-password"
        label="Current password"
        value={passwords.currentPassword}
        onChange={(value) => setPasswords({ ...passwords, currentPassword: value })}
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
        onChange={(value) => setPasswords({ ...passwords, confirmPassword: value })}
      />

      <p className="text-xs text-muted-foreground">
        Use at least 8 characters with uppercase, lowercase, number, and special character.
      </p>

      <Button
        type="submit"
        disabled={savingPassword}>
        {savingPassword ? "Updating..." : "Update password"}
      </Button>
    </form>
  </section>;
}

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="password"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required />
  </div>;
}
