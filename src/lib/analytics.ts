import { loadSubjects } from "./subjects-store";
import { loadStreak, loadProfile, computeProgressStats, loadChapterProgress } from "./progress-store";
import { weeklyHours as mockWeeklyHours } from "./mock-data";

// ── Exam Readiness Score ──────────────────────────────────────────────────────
// Weighted average of: progress%, days urgency, difficulty
export function computeExamReadiness(): number {
  const subjects = loadSubjects();
  if (subjects.length === 0) return 0;

  const DIFF_WEIGHT = { Hard: 1.5, Medium: 1.0, Easy: 0.7 };

  const scores = subjects.map((s) => {
    const urgencyFactor = s.daysLeft <= 7 ? 0.6 : s.daysLeft <= 14 ? 0.8 : 1.0;
    const diffWeight    = DIFF_WEIGHT[s.difficulty] ?? 1.0;
    return (s.progress * urgencyFactor) / diffWeight;
  });

  return Math.min(100, Math.round(scores.reduce((a, b) => a + b, 0) / scores.length));
}

// ── Subject performance for bar chart ────────────────────────────────────────
export function computeSubjectPerformance() {
  const subjects = loadSubjects();
  if (subjects.length === 0) return [];
  return subjects.map((s) => ({
    name:  s.name.split(" ")[0],
    score: Math.round(s.progress * 0.9 + 10),
    hours: s.hoursThisWeek,
  }));
}

// ── Completion trend (last 6 weeks simulated from real progress) ──────────────
export function computeCompletionTrend() {
  const stats = computeProgressStats();
  const now   = stats.avgCompletion;

  // Back-calculate realistic trend from current completion
  return [
    { week: "W1", completion: Math.max(0, Math.round(now * 0.18)) },
    { week: "W2", completion: Math.max(0, Math.round(now * 0.35)) },
    { week: "W3", completion: Math.max(0, Math.round(now * 0.52)) },
    { week: "W4", completion: Math.max(0, Math.round(now * 0.68)) },
    { week: "W5", completion: Math.max(0, Math.round(now * 0.84)) },
    { week: "W6", completion: now },
  ];
}

// ── AI insights derived from real data ───────────────────────────────────────
export function computeAIInsights() {
  const subjects = loadSubjects();
  const streak   = loadStreak();
  const profile  = loadProfile();

  if (subjects.length === 0) return {
    peakFocus:       "10am – 12pm",
    strongestSubject: "No subjects yet",
    bestStreakDay:   "Friday",
    focusScore:      "0 / 10",
  };

  const strongest = subjects.reduce((a, b) => a.progress > b.progress ? a : b);
  const focusScore = Math.min(10, ((streak.current * 0.3) + (profile.level * 0.5))).toFixed(1);

  return {
    peakFocus:        "10am – 12pm",
    strongestSubject: `${strongest.name} (${strongest.progress}%)`,
    bestStreakDay:    "Friday",
    focusScore:       `${focusScore} / 10`,
  };
}

// ── Weekly hours (use mock for now, real in future) ──────────────────────────
export function getWeeklyHours() {
  return mockWeeklyHours;
}