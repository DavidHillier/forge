import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function percentage(value: number) {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

export function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}
