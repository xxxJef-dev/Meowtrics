"use client";
import { useState, useEffect } from "react";

/**
 * Generic localStorage hook — persists state automatically.
 * Falls back to in-memory state if localStorage is unavailable.
 * Returns [value, setValue, reset] tuple.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Silently fail — localStorage unavailable
    }
  }, [key, storedValue]);

  const reset = () => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
    setStoredValue(initialValue);
  };

  return [storedValue, setStoredValue, reset] as const;
}
