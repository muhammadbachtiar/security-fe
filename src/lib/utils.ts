import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitTime = (time: string) => {
  return time.split(":").slice(0, 2).join(":") || "-";
};
