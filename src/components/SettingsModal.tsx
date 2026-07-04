import { useState, useRef } from "react";
import { X, Save, Trash2, RotateCcw, User, Download, Upload, Database } from "lucide-react";
import { loadProfile, saveProfile, type ProfileData } from "@/lib/progress-store";
import { exportData, importData } from "@/lib/data-portability";
import { Toast } from "@/components/Toast";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [profile,    setProfile]    = useState<ProfileData>(loadProfile);
  const [importing,  setImporting]  = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function handleSave() {
    const parts    = profile.fullName.trim().split(" ").filter(Boolean);
    const initials = parts.length >= 2
      ? parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
      : parts[0]?.slice(0, 2).toUpperCase() ?? "VK";
    saveProfile({ fullName: profile.fullName, initials });
    Toast.settingsSaved();
    onClose();
  }

  function handleExport() {
    try {
      exportData();
      Toast.success("Backup downloaded!", "Your data has been exported as a JSON file.");
    } catch {
      Toast.error("Export failed", "Something went wrong while exporting your data.");
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      await importData(file);
      Toast.success("Data imported!", "Your backup has been restored. Reloading…");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      Toast.error("Import failed", err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
      <div className="relative w-full max-w-md mx-4 rounded-3xl glass-strong shadow-card p-6 space-y-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Settings & Profile</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Profile */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Profile</span>
          </div>

          <label className="block">
            <span className="text-xs text-muted-foreground">Full Name</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 px-3.5 h-11 bg-white/3 focus-within:border-primary/50 transition">
              <input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Your full name"
              />
            </div>
          </label>

          {/* XP display — read only */}
          <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3 space-y-2">
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
            <p className="text-[11px] text-muted-foreground">⚡ Earn XP by completing chapters. No shortcuts! 💪</p>
          </div>

          <button
            onClick={handleSave}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
          >
            <Save className="h-4 w-4" /> Save Profile
          </button>
        </div>

        <div className="border-t border-white/10" />

        {/* Data Portability */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Data Portability</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Export your subjects, progress, and settings as a JSON backup file. Import it later to restore everything.
          </p>

          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-foreground hover:bg-white/5 transition"
          >
            <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">Export backup</div>
              <div className="text-[11px] text-muted-foreground">Downloads a JSON file with all your data</div>
            </div>
          </button>

          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="w-full flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-foreground hover:bg-white/5 transition disabled:opacity-50"
          >
            <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">{importing ? "Importing…" : "Import backup"}</div>
              <div className="text-[11px] text-muted-foreground">Restore from a StudyFlow JSON export</div>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        <div className="border-t border-white/10" />

        {/* Danger zone */}
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Danger Zone</div>
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