import type { Subject } from "./mock-data";

export interface StudySession {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  topic: string;
  time: string;
  startHour: number;
  durationHours: number;
  priority: "high" | "medium" | "low";
  done: boolean;
}

export interface WeekSlot {
  time: string;
  subject: string;
  color: string;
}

export interface DaySchedule {
  day: string;
  date: string;
  slots: WeekSlot[];
}

export interface ScheduleResult {
  todayPlan: StudySession[];
  weekSchedule: DaySchedule[];
  totalSessionsToday: number;
  totalHoursToday: number;
  status: "on_track" | "behind" | "ahead";
}

const DIFFICULTY_WEIGHT: Record<string, number> = { Hard: 3, Medium: 2, Easy: 1 };

const STUDY_BLOCKS = [
  { startHour: 8,  label: "08:00 – 09:30", duration: 1.5 },
  { startHour: 10, label: "10:00 – 11:30", duration: 1.5 },
  { startHour: 13, label: "13:00 – 14:00", duration: 1.0 },
  { startHour: 15, label: "15:00 – 16:30", duration: 1.5 },
  { startHour: 18, label: "18:00 – 19:00", duration: 1.0 },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const GRADIENT_TO_BG: Record<string, string> = {
  "from-zinc-300 to-zinc-500":       "bg-zinc-300/30 border-zinc-300/50",
  "from-zinc-400 to-zinc-600":       "bg-zinc-400/30 border-zinc-400/50",
  "from-neutral-300 to-neutral-500": "bg-neutral-300/30 border-neutral-300/50",
  "from-gray-400 to-gray-600":       "bg-gray-400/30 border-gray-400/50",
  "from-stone-300 to-stone-500":     "bg-stone-300/30 border-stone-300/50",
  "from-zinc-200 to-zinc-400":       "bg-zinc-200/30 border-zinc-200/50",
  "from-neutral-400 to-neutral-600": "bg-neutral-400/30 border-neutral-400/50",
  "from-gray-300 to-gray-500":       "bg-gray-300/30 border-gray-300/50",
};

const CHAPTER_TOPICS: Record<string, string[]> = {
  Hard:   ["Core Theory", "Advanced Concepts", "Problem Sets", "Past Papers", "Revision"],
  Medium: ["Chapter Review", "Practice Problems", "Key Concepts", "Summary Notes"],
  Easy:   ["Topic Overview", "Quick Review", "Practice Sets"],
};

export function scoreSubject(s: Subject): number {
  const diffWeight = DIFFICULTY_WEIGHT[s.difficulty] ?? 2;
  const urgency    = s.daysLeft <= 7 ? 30 : s.daysLeft <= 14 ? 20 : s.daysLeft <= 21 ? 10 : 0;
  const incomplete = Math.round((1 - s.progress / 100) * 10);
  return diffWeight * 10 + urgency + incomplete;
}

function priorityLabel(score: number): "high" | "medium" | "low" {
  if (score >= 45) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function pickTopic(subject: Subject, blockIndex: number): string {
  const topics = CHAPTER_TOPICS[subject.difficulty] ?? CHAPTER_TOPICS["Medium"];
  return `Ch. ${subject.completedChapters + blockIndex + 1} — ${topics[blockIndex % topics.length]}`;
}

function getBgClass(color: string): string {
  return GRADIENT_TO_BG[color] ?? "bg-zinc-300/30 border-zinc-300/50";
}

export function generateSchedule(subjects: Subject[]): ScheduleResult {
  if (subjects.length === 0) {
    return { todayPlan: [], weekSchedule: buildEmptyWeek(), totalSessionsToday: 0, totalHoursToday: 0, status: "on_track" };
  }

  const ranked = [...subjects].sort((a, b) => scoreSubject(b) - scoreSubject(a));

  const todayPlan: StudySession[] = STUDY_BLOCKS.map((block, i) => {
    const subject = ranked[i % ranked.length];
    return {
      subjectId: subject.id, subjectName: subject.name, subjectColor: subject.color,
      topic: pickTopic(subject, i), time: block.label, startHour: block.startHour,
      durationHours: block.duration, priority: priorityLabel(scoreSubject(subject)), done: false,
    };
  });

  const totalHoursToday = todayPlan.reduce((sum, s) => sum + s.durationHours, 0);
  const top = ranked[0];
  const expectedProgress = top.daysLeft > 0 ? Math.max(0, 100 - (top.daysLeft / 30) * 100) : 100;
  const status: ScheduleResult["status"] =
    top.progress >= expectedProgress + 10 ? "ahead" :
    top.progress <  expectedProgress - 10 ? "behind" : "on_track";

  return { todayPlan, weekSchedule: buildWeekSchedule(ranked), totalSessionsToday: todayPlan.length, totalHoursToday, status };
}

function buildWeekSchedule(ranked: Subject[]): DaySchedule[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const week: DaySchedule[] = [];

  for (let d = 0; d < 7; d++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + d);
    let slots: WeekSlot[] = [];

    if (d === 5) {
      slots = [{ time: "10–13", subject: "Revision", color: "bg-zinc-500/30 border-zinc-500/50" }];
    } else if (d === 6) {
      const light = ranked[ranked.length - 1];
      slots = [{ time: "11–12", subject: light.name.split(" ")[0], color: getBgClass(light.color) }];
    } else {
      const timeSets = [["9–11","14–16","19–20"],["8–10","15–17","19–20"],["10–12","14–16"],["9–11","13–15","18–19"],["8–10","11–13","16–18"]];
      const dayTimes = timeSets[d] ?? ["9–11", "14–16"];
      const count = d < 3 ? Math.min(3, dayTimes.length) : Math.min(2, dayTimes.length);
      for (let s = 0; s < count; s++) {
        const subject = ranked[(d + s) % ranked.length];
        slots.push({ time: dayTimes[s], subject: subject.name.split(" ")[0], color: getBgClass(subject.color) });
      }
    }
    week.push({ day: DAY_NAMES[date.getDay()], date: date.toISOString().split("T")[0], slots });
  }
  return week;
}

function buildEmptyWeek(): DaySchedule[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, d) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + d);
    return { day: DAY_NAMES[date.getDay()], date: date.toISOString().split("T")[0], slots: [] };
  });
}

export function computeTimeAllocation(subjects: Subject[]) {
  if (subjects.length === 0) return [];
  const ranked = [...subjects].sort((a, b) => scoreSubject(b) - scoreSubject(a));
  const totalScore = ranked.reduce((sum, s) => sum + scoreSubject(s), 0);
  return ranked.map((s) => ({
    id: s.id, name: s.name, color: s.color, hoursThisWeek: s.hoursThisWeek,
    targetHours: Math.round((scoreSubject(s) / totalScore) * 35),
  }));
}