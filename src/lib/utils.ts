/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitTime = (time: string) => {
  return time.split(":").slice(0, 2).join(":") || "-";
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const handleDownloadCsv = (res: any, filename: string) => {
  const blob = new Blob([res], { type: "'text/csv'" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.setAttribute("href", url);
  a.setAttribute("download", `${filename}.xlsx`);

  a.click();
};

export const isPercent = (value: number): boolean => value >= 0 && value <= 1;
