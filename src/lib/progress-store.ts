import { emitUpdate } from "./store-events";
import { loadSubjects } from "./subjects-store";

const PROGRESS_KEY = "studyai:progress";
const STREAK_KEY   = "studyai:streak";
const PROFILE_KEY  = "studyai:profile";

const XP_PER_CHAPTER = 50;
const XP_PER_SUBJECT = 500;
const XP_PER_LEVEL   = 1000;

export interface ChapterEntry {
  subjectId: string;
  chapterIndex: number;
  done: boolean;
  completedAt?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastStudiedDate: string;
}

export interface ProfileData {
  fullName: string;
  initials: string;
  level: number;
  xp: number;
  xpToNext: number;
}

export function loadChapterProgress(): ChapterEntry[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveChapterProgress(entries: ChapterEntry[]): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(entries));
  emitUpdate();
}

export function toggleChapter(subjectId: string, chapterIndex: number): void {
  const entries = loadChapterProgress();
  const idx = entries.findIndex(
    (e) => e.subjectId === subjectId && e.chapterIndex === chapterIndex
  );
  const wasAlreadyDone = idx !== -1 && entries[idx].done;
  if (idx === -1) {
    entries.push({ subjectId, chapterIndex, done: true, completedAt: new Date().toISOString() });
  } else {
    entries[idx].done = !entries[idx].done;
    if (entries[idx].done) entries[idx].completedAt = new Date().toISOString();
  }
  saveChapterProgress(entries);
  const isNowDone = idx === -1 ? true : entries[idx].done;
  const subjects  = loadSubjects();
  const subject   = subjects.find((s) => s.id === subjectId);
  if (subject) {
    const completedCount    = entries.filter((e) => e.subjectId === subjectId && e.done).length;
    const isSubjectComplete = completedCount === subject.totalChapters;
    const wasSubjectComplete = !wasAlreadyDone && completedCount - 1 === subject.totalChapters;
    if (isNowDone) {
      addXP(XP_PER_CHAPTER + (isSubjectComplete ? XP_PER_SUBJECT : 0));
    } else {
      removeXP(XP_PER_CHAPTER + (wasSubjectComplete ? XP_PER_SUBJECT : 0));
    }
  }
  syncSubjectProgress(subjectId, entries);
  updateStreak();
}

export function getCompletedChapters(subjectId: string): number[] {
  return loadChapterProgress()
    .filter((e) => e.subjectId === subjectId && e.done)
    .map((e) => e.chapterIndex);
}

function syncSubjectProgress(subjectId: string, entries: ChapterEntry[]): void {
  const subjects = loadSubjects();
  const subject  = subjects.find((s) => s.id === subjectId);
  if (!subject) return;
  const completed = entries.filter((e) => e.subjectId === subjectId && e.done).length;
  const progress  = subject.totalChapters > 0
    ? Math.round((completed / subject.totalChapters) * 100) : 0;
  const updated = subjects.map((s) =>
    s.id === subjectId ? { ...s, completedChapters: completed, progress } : s
  );
  localStorage.setItem("studyai:subjects", JSON.stringify(updated));
}

function addXP(amount: number): void {
  const profile   = loadProfile();
  let newXP       = profile.xp + amount;
  let newLevel    = profile.level;
  let newXPToNext = profile.xpToNext;
  while (newXP >= newXPToNext) {
    newXP      -= newXPToNext;
    newLevel   += 1;
    newXPToNext = newLevel * XP_PER_LEVEL;
  }
  saveProfile({ xp: newXP, level: newLevel, xpToNext: newXPToNext });
}

function removeXP(amount: number): void {
  const profile = loadProfile();
  let newXP     = Math.max(0, profile.xp - amount);
  let newLevel  = profile.level;
  if (profile.xp - amount < 0 && newLevel > 1) {
    newLevel -= 1;
    newXP     = Math.max(0, newLevel * XP_PER_LEVEL - amount);
  }
  saveProfile({ xp: newXP, level: newLevel });
}

export function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { current: 0, longest: 0, lastStudiedDate: "" };
  } catch { return { current: 0, longest: 0, lastStudiedDate: "" }; }
}

function updateStreak(): void {
  const streak = loadStreak();
  const today  = new Date().toISOString().split("T")[0];
  if (streak.lastStudiedDate === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr       = yesterday.toISOString().split("T")[0];
  const newCurrent = streak.lastStudiedDate === yStr ? streak.current + 1 : 1;
  emitUpdate();
  localStorage.setItem(STREAK_KEY, JSON.stringify({
    current: newCurrent,
    longest: Math.max(newCurrent, streak.longest),
    lastStudiedDate: today,
  }));
}

export function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { fullName: "Vijval Kumar", initials: "VK", level: 1, xp: 0, xpToNext: 1000 };
}

export function saveProfile(data: Partial<ProfileData>): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...loadProfile(), ...data }));
  emitUpdate();
}

export function computeProgressStats() {
  const subjects = loadSubjects();
  if (subjects.length === 0) return { avgCompletion: 0, totalChaptersDone: 0, totalChapters: 0 };
  return {
    avgCompletion:     Math.round(subjects.reduce((s, x) => s + x.progress, 0) / subjects.length),
    totalChaptersDone: subjects.reduce((s, x) => s + x.completedChapters, 0),
    totalChapters:     subjects.reduce((s, x) => s + x.totalChapters, 0),
  };
}

export function buildConsistencyGrid(): number[][] {
  const entries     = loadChapterProgress().filter((e) => e.done && e.completedAt);
  const studiedDays = new Set(entries.map((e) => e.completedAt!.split("T")[0]));
  const today       = new Date();
  const grid: number[][] = [];
  for (let week = 3; week >= 0; week--) {
    const row: number[] = [];
    for (let day = 6; day >= 0; day--) {
      const d = new Date(today);
      d.setDate(today.getDate() - week * 7 - day);
      row.push(studiedDays.has(d.toISOString().split("T")[0]) ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}