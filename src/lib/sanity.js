import { createClient } from "@sanity/client";

export const client = createClient({
  // projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  // dataset: "production",
  // useCdn: false,
  // apiVersion: "2025-05-14",
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID, // غيّرها إلى Project ID الخاص بك
  dataset: "production", // أو dataset آخر إن كان مختلف
  apiVersion: "2025-05-14", // آخر إصدار
  useCdn: false, // false = بيانات محدثة
  token: import.meta.env.VITE_SANITY_API_TOKEN, // اختياري إن كانت Private
});
