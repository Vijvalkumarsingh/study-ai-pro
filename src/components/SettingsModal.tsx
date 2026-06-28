import { useState } from "react";
import { X, Save, Trash2, RotateCcw, User } from "lucide-react";
import { loadProfile, saveProfile, type ProfileData } from "@/lib/progress-store";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [profile, setProfile] = useState<ProfileData>(loadProfile);
  const [saved,   setSaved]   = useState(false);

  if (!open) return null;

  function handleSave() {
    const parts    = profile.fullName.trim().split(" ").filter(Boolean);
    const initials = parts.length >= 2
      ? parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
      : parts[0]?.slice(0, 2).toUpperCase() ?? "VK";
    saveProfile({ fullName: profile.fullName, initials });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearProgress() {
    if (confirm("Clear all chapter progress? Your subjects will remain but all chapter completions and XP will be reset.")) {
      localStorage.removeItem("studyai:progress");
      localStorage.removeItem("studyai:streak");
      localStorage.removeItem("studyai:schedule");
      localStorage.removeItem("studyai:profile");
      onClose();
      window.location.reload();
    }
  }

  function handleClearAll() {
    if (confirm("Delete EVERYTHING? This removes all subjects, progress, XP and settings permanently.")) {
      ["studyai:subjects","studyai:progress","studyai:streak","studyai:schedule","studyai:profile"]
        .forEach((k) => localStorage.removeItem(k));
      onClose();
      window.location.reload();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-3xl glass-strong shadow-card p-6 space-y-6 animate-fade-in-up">

        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Settings & Profile</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Profile</span>
          </div>

          <label className="block">
            <span className="text-xs text-muted-foreground">Full Name</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 px-3.5 h-11 bg-white/[0.03] focus-within:border-primary/50 transition">
              <input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Your full name"
              />
            </div>
          </label>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Level</span>
              <span className="font-display font-bold">{profile.level}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">XP</span>
              <span className="font-display font-bold">{profile.xp} / {profile.xpToNext}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full transition-all"
                style={{ width: `${Math.round((profile.xp / profile.xpToNext) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              ⚡ Earn XP by completing chapters. No shortcuts! 💪
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Profile"}
          </button>
        </div>

        <div className="border-t border-white/10" />

        <div className="space-y-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Data Management</div>
          <button
            onClick={handleClearProgress}
            className="w-full flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
          >
            <RotateCcw className="h-4 w-4 shrink-0" />
            Reset all progress (keep subjects)
          </button>
          <button
            onClick={handleClearAll}
            className="w-full flex items-center gap-3 rounded-xl border border-zinc-500/30 px-4 py-3 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-500/10 transition"
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            Delete all data permanently
          </button>
        </div>

      </div>
    </div>
  );
}