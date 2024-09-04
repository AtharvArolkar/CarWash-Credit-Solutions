import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isStringFiniteNumber(value?: string | null): boolean {
  return Number.isFinite(Number(value ?? "NaN"));
}
