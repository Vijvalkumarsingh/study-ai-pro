// ── Data Portability ──────────────────────────────────────────────────────────
// Export and import all StudyFlow data as a single JSON file.

const STORAGE_KEYS = [
    "studyai:subjects",
    "studyai:progress",
    "studyai:streak",
    "studyai:schedule",
    "studyai:profile",
    "studyai:theme",
  ];
  
  export interface StudyFlowBackup {
    version: 1;
    exportedAt: string;
    data: Record<string, unknown>;
  }
  
  // ── Export ────────────────────────────────────────────────────────────────────
  
  export function exportData(): void {
    const data: Record<string, unknown> = {};
  
    STORAGE_KEYS.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          data[key] = JSON.parse(raw);
        } catch {
          data[key] = raw;
        }
      }
    });
  
    const backup: StudyFlowBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    };
  
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `studyflow-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // ── Import ────────────────────────────────────────────────────────────────────
  
  export function importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        try {
          const raw    = e.target?.result as string;
          const backup = JSON.parse(raw) as StudyFlowBackup;
  
          if (!backup.version || !backup.data) {
            reject(new Error("Invalid backup file format."));
            return;
          }
  
          // Write each key back to localStorage
          Object.entries(backup.data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
  
          resolve();
        } catch {
          reject(new Error("Failed to parse backup file. Make sure it's a valid StudyFlow export."));
        }
      };
  
      reader.onerror = () => reject(new Error("Failed to read the file."));
      reader.readAsText(file);
    });
  }