import { useState, useEffect, useCallback } from "react";

const EVENT_NAME = "studyai:update";
const isBrowser = typeof window !== "undefined";

export function emitUpdate() {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function onUpdate(callback: () => void): () => void {
  if (!isBrowser) return () => {};
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}

export function useStudyAI<T>(selector: () => T): T {
  const [value, setValue] = useState<T | undefined>(undefined);

  const refresh = useCallback(() => {
    if (!isBrowser) return;
    setValue(selector());
  }, []);

  useEffect(() => {
    refresh();
    return onUpdate(refresh);
  }, [refresh]);

  return value as T;
}