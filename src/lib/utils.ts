import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind classes with proper conflict resolution.
 * Uses clsx for conditional classes and twMerge to handle Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a JSON string safely, with fallback to empty array.
 * Used for storing complex data (tags, techStack) as strings in the database.
 */
export function parseJSON<T>(value: string | null, defaultValue: T): T {
  if (!value) return defaultValue
  try {
    return JSON.parse(value) as T
  } catch {
    return defaultValue
  }
}

/**
 * Stringifies data to JSON for storage in the database.
 */
export function stringifyJSON<T>(value: T): string {
  return JSON.stringify(value)
}
