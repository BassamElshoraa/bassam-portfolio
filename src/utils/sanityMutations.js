// src/utils/sanityMutations.js
// import { client } from "./sanityClient"; // ملف الإعدادات كما في الخطوات السابقة

/**
 * يضيف مستند Project جديد إلى Sanity عبر HTTP API
 * @param {{ title: string; slug: {current:string}; description: string; image: any; projectUrl: string; demoUrl: string; skills: string[]; codeFiles: {url:string}[] }} newProj
 */
export const addProject = async (newProj) => {
  const url = `https://${import.meta.env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/production`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SANITY_API_TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ create: { _type: "project", ...newProj } }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Sanity mutation failed: ${error}`);
  }
  return response.json();
};
