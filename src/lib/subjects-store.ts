import { emitUpdate } from "./store-events";
import type { Difficulty, Subject } from "./mock-data";

const STORAGE_KEY = "studyai:subjects";

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(dateStr);
  exam.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((exam.getTime() - today.getTime()) / 86_400_000));
}

function generateCode(name: string, id: string): string {
  const words = name.trim().split(/\s+/);
  const prefix =
    words.length >= 2
      ? words.slice(0, 2).map((w) => w[0]).join("").toUpperCase()
      : name.slice(0, 2).toUpperCase();
  return `${prefix}-${id.slice(-3).toUpperCase()}`;
}

const GRADIENT_POOL = [
  "from-zinc-300 to-zinc-500",
  "from-zinc-400 to-zinc-600",
  "from-neutral-300 to-neutral-500",
  "from-gray-400 to-gray-600",
  "from-stone-300 to-stone-500",
  "from-zinc-200 to-zinc-400",
  "from-neutral-400 to-neutral-600",
  "from-gray-300 to-gray-500",
];

function pickColor(index: number): string {
  return GRADIENT_POOL[index % GRADIENT_POOL.length];
}

export interface SubjectFormData {
  name: string;
  examDate: string;
  difficulty: Difficulty;
  chapters: string[];
  hoursPerDay: number;
}

export function loadSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: Subject[] = JSON.parse(raw);
    return parsed.map((s) => ({ ...s, daysLeft: daysUntil(s.examDate) }));
  } catch {
    return [];
  }
}

function saveSubjects(subjects: Subject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  emitUpdate();
}

export function createSubject(data: SubjectFormData): Subject {
  const existing = loadSubjects();
  const id = `subj_${Date.now()}`;
  const totalChapters = data.chapters.length || 8;
  const newSubject: Subject = {
    id,
    name: data.name,
    code: generateCode(data.name, id),
    color: pickColor(existing.length),
    difficulty: data.difficulty,
    examDate: data.examDate,
    daysLeft: daysUntil(data.examDate),
    progress: 0,
    totalChapters,
    completedChapters: 0,
    hoursThisWeek: 0,
    targetHours: totalChapters * data.hoursPerDay,
  };
  saveSubjects([...existing, newSubject]);
  return newSubject;
}

export function updateSubject(id: string, data: SubjectFormData): Subject | null {
  const existing = loadSubjects();
  const idx = existing.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const totalChapters = data.chapters.length || existing[idx].totalChapters;
  const updated: Subject = {
    ...existing[idx],
    name: data.name,
    code: generateCode(data.name, id),
    difficulty: data.difficulty,
    examDate: data.examDate,
    daysLeft: daysUntil(data.examDate),
    totalChapters,
    targetHours: totalChapters * data.hoursPerDay,
  };
  const next = [...existing];
  next[idx] = updated;
  saveSubjects(next);
  return updated;
}

export function deleteSubject(id: string): void {
  saveSubjects(loadSubjects().filter((s) => s.id !== id));
}