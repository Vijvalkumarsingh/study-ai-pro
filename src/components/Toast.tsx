// ── Centralised toast helpers ─────────────────────────────────────────────────
// Import these instead of calling sonner directly so we keep a consistent
// style and can swap the library in one place if needed.

import { toast } from "sonner";

export const Toast = {
  success: (msg: string, description?: string) =>
    toast.success(msg, { description }),

  error: (msg: string, description?: string) =>
    toast.error(msg, { description }),

  info: (msg: string, description?: string) =>
    toast(msg, { description }),

  // Subject deleted — with undo action
  deletedSubject: (name: string, onUndo: () => void) =>
    toast(`"${name}" deleted`, {
      description: "Your subject has been removed.",
      action: {
        label: "Undo",
        onClick: onUndo,
      },
      duration: 5000,
    }),

  // Chapter toggled
  chapterDone: (chapter: string) =>
    toast.success(`${chapter} complete! +50 XP`, {
      duration: 2000,
    }),

  chapterUndone: (chapter: string) =>
    toast(`${chapter} marked incomplete`, {
      duration: 2000,
    }),

  // Subject completed
  subjectComplete: (name: string) =>
    toast.success(`🎉 ${name} complete! +500 XP`, {
      description: "Excellent work — all chapters done!",
      duration: 4000,
    }),

  // Settings saved
  settingsSaved: () =>
    toast.success("Profile saved!", { duration: 2000 }),
};