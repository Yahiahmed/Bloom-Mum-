import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const remixiconUrl = "https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css";

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export const defaultTopics = [
  {
    id: 1,
    title: "First Trimester",
    description: "Guidance for weeks 1-12 of pregnancy",
    icon: "ri-calendar-line",
  },
  {
    id: 2,
    title: "Second Trimester",
    description: "Information for weeks 13-26 of pregnancy",
    icon: "ri-calendar-2-line",
  },
  {
    id: 3,
    title: "Third Trimester",
    description: "Advice for weeks 27-40 of pregnancy",
    icon: "ri-calendar-check-line",
  },
  {
    id: 4,
    title: "Nutrition",
    description: "Dietary recommendations during pregnancy",
    icon: "ri-heart-pulse-line",
  },
  {
    id: 5,
    title: "Exercise",
    description: "Safe physical activities for expectant mothers",
    icon: "ri-walk-line",
  },
  {
    id: 6,
    title: "Common Symptoms",
    description: "Understanding normal pregnancy symptoms",
    icon: "ri-psychotherapy-line",
  },
  {
    id: 7,
    title: "Preparing for Birth",
    description: "Getting ready for labor and delivery",
    icon: "ri-home-heart-line",
  },
  {
    id: 8,
    title: "Mental Health",
    description: "Emotional wellbeing during pregnancy",
    icon: "ri-mental-health-line",
  },
];
