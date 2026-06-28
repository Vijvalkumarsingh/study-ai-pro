import { loadSubjects } from "./subjects-store";
import { generateSchedule, type ScheduleResult } from "./scheduler";

const STORAGE_KEY = "studyai:schedule";

export function loadSchedule(): ScheduleResult {
  const result = generateSchedule(loadSubjects());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  return result;
}

export function toggleSessionDone(index: number): ScheduleResult {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return loadSchedule();
  const result: ScheduleResult = JSON.parse(raw);
  if (result.todayPlan[index]) {
    result.todayPlan[index].done = !result.todayPlan[index].done;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  }
  return result;
}