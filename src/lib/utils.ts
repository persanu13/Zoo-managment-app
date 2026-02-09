import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDateOnly(
  value: FormDataEntryValue | null,
): Date | undefined {
  if (!value || typeof value !== "string" || value.length === 0)
    return undefined;

  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d); // date local, fără shift aiurea
}
