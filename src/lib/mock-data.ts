export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  difficulty: Difficulty;
  examDate: string;
  daysLeft: number;
  progress: number;
  totalChapters: number;
  completedChapters: number;
  hoursThisWeek: number;
  targetHours: number;
}

export const user = {
  name: "Student",
  fullName: "Student\u00a0",
  email: "student@university.edu",
  initials: "ST",
  streak: 14,
  level: 7,
  xp: 2840,
  xpToNext: 3500,
};

export const subjects: Subject[] = [
  {
    id: "dbms",
    name: "Database Management",
    code: "CS-301",
    color: "from-zinc-300 to-zinc-500",
    difficulty: "Hard",
    examDate: "2026-06-27",
    daysLeft: 5,
    progress: 62,
    totalChapters: 12,
    completedChapters: 7,
    hoursThisWeek: 8.5,
    targetHours: 12,
  },
  {
    id: "os",
    name: "Operating Systems",
    code: "CS-302",
    color: "from-zinc-400 to-zinc-600",
    difficulty: "Hard",
    examDate: "2026-07-02",
    daysLeft: 10,
    progress: 45,
    totalChapters: 10,
    completedChapters: 4,
    hoursThisWeek: 6.0,
    targetHours: 10,
  },
  {
    id: "algo",
    name: "Algorithms & DS",
    code: "CS-303",
    color: "from-neutral-300 to-neutral-500",
    difficulty: "Medium",
    examDate: "2026-07-08",
    daysLeft: 16,
    progress: 78,
    totalChapters: 14,
    completedChapters: 11,
    hoursThisWeek: 9.2,
    targetHours: 9,
  },
  {
    id: "net",
    name: "Computer Networks",
    code: "CS-304",
    color: "from-gray-400 to-gray-600",
    difficulty: "Medium",
    examDate: "2026-07-14",
    daysLeft: 22,
    progress: 30,
    totalChapters: 11,
    completedChapters: 3,
    hoursThisWeek: 3.5,
    targetHours: 7,
  },
  {
    id: "math",
    name: "Discrete Math",
    code: "MA-201",
    color: "from-stone-300 to-stone-500",
    difficulty: "Easy",
    examDate: "2026-07-20",
    daysLeft: 28,
    progress: 88,
    totalChapters: 9,
    completedChapters: 8,
    hoursThisWeek: 4.0,
    targetHours: 5,
  },
];

export const todayPlan = [
  { time: "08:00 – 09:30", subject: "Database Management", topic: "Normalization & BCNF", priority: "high", done: true },
  { time: "10:00 – 11:30", subject: "Algorithms & DS", topic: "Dynamic Programming", priority: "high", done: true },
  { time: "13:00 – 14:00", subject: "Operating Systems", topic: "Process Scheduling", priority: "medium", done: false },
  { time: "15:00 – 16:30", subject: "Database Management", topic: "Transactions & ACID", priority: "high", done: false },
  { time: "18:00 – 19:00", subject: "Discrete Math", topic: "Graph Theory Revision", priority: "low", done: false },
];

export const aiRecommendations = [
  {
    title: "Focus on DBMS today",
    description: "Your exam is in 5 days and you're at 62% completion. Aim for 2 more chapters this evening.",
    type: "urgent",
  },
  {
    title: "You're 20% behind schedule",
    description: "Operating Systems needs catch-up. Shift Friday's slot from Networks → OS.",
    type: "warning",
  },
  {
    title: "Streak milestone unlocked",
    description: "14 days strong. Keep going to hit your 21-day badge.",
    type: "success",
  },
];

export const weeklyHours = [
  { day: "Mon", hours: 4.5, target: 5 },
  { day: "Tue", hours: 6.2, target: 5 },
  { day: "Wed", hours: 3.8, target: 5 },
  { day: "Thu", hours: 5.5, target: 5 },
  { day: "Fri", hours: 7.0, target: 5 },
  { day: "Sat", hours: 4.2, target: 5 },
  { day: "Sun", hours: 2.0, target: 3 },
];

export const subjectPerformance = subjects.map((s) => ({
  name: s.name.split(" ")[0],
  score: Math.round(s.progress * 0.9 + 10),
  hours: s.hoursThisWeek,
}));

export const completionTrend = [
  { week: "W1", completion: 12 },
  { week: "W2", completion: 24 },
  { week: "W3", completion: 38 },
  { week: "W4", completion: 49 },
  { week: "W5", completion: 58 },
  { week: "W6", completion: 67 },
];

export const achievements = [
  { name: "Early Bird", desc: "Studied before 8am for 7 days", earned: true, icon: "🌅" },
  { name: "Consistency King", desc: "14-day streak", earned: true, icon: "🔥" },
  { name: "Deep Focus", desc: "4hr session no break", earned: true, icon: "🎯" },
  { name: "Marathon", desc: "Studied 50hrs in a week", earned: false, icon: "🏃" },
  { name: "Polymath", desc: "All subjects above 80%", earned: false, icon: "🧠" },
  { name: "Night Owl", desc: "Studied past midnight x5", earned: true, icon: "🦉" },
];

export const weekSchedule = [
  { day: "Mon", slots: [{ time: "9–11", subject: "DBMS", color: "bg-zinc-300/30 border-zinc-300/50" }, { time: "14–16", subject: "Algorithms", color: "bg-zinc-500/30 border-zinc-500/50" }] },
  { day: "Tue", slots: [{ time: "8–10", subject: "OS", color: "bg-zinc-400/30 border-zinc-400/50" }, { time: "15–17", subject: "DBMS", color: "bg-zinc-300/30 border-zinc-300/50" }, { time: "19–20", subject: "Math", color: "bg-zinc-700/30 border-zinc-700/50" }] },
  { day: "Wed", slots: [{ time: "10–12", subject: "Networks", color: "bg-zinc-600/30 border-zinc-600/50" }, { time: "14–16", subject: "Algorithms", color: "bg-zinc-500/30 border-zinc-500/50" }] },
  { day: "Thu", slots: [{ time: "9–11", subject: "DBMS", color: "bg-zinc-300/30 border-zinc-300/50" }, { time: "13–15", subject: "OS", color: "bg-zinc-400/30 border-zinc-400/50" }, { time: "18–19", subject: "Math", color: "bg-zinc-700/30 border-zinc-700/50" }] },
  { day: "Fri", slots: [{ time: "8–10", subject: "Algorithms", color: "bg-zinc-500/30 border-zinc-500/50" }, { time: "11–13", subject: "Networks", color: "bg-zinc-600/30 border-zinc-600/50" }, { time: "16–18", subject: "DBMS", color: "bg-zinc-300/30 border-zinc-300/50" }] },
  { day: "Sat", slots: [{ time: "10–13", subject: "Revision", color: "bg-zinc-500/30 border-zinc-500/50" }] },
  { day: "Sun", slots: [{ time: "11–12", subject: "Light Review", color: "bg-zinc-400/30 border-zinc-400/50" }] },
];