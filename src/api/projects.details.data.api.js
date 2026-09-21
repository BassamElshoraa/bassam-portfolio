// // "use server";
export async function getProjectBySlug(slug) {
  try {
    const res = await fetch("/data/portfolioProjects.json");
    if (!res.ok) throw new Error("Failed to load projects");

    const projects = await res.json();

    // البحث عن المشروع المطلوب بناءً على الـ slug
    const project = projects.find((p) => p.slug === slug);

    return project || null;
  } catch (err) {
    console.error("Error loading project:", err);
    return null;
  }
}

// import { client } from "../lib/sanity";

// export async function getProjectBySlug(slug) {
//   const query = `*[_type == "project" && slug.current == $slug][0]{
//       title,
//       slug,
//       description,
//       "imageUrl": image.asset->url,
//       projectUrl,
//       demoUrl,
//       skills,
//       codeFiles[]{title, url},
//       date
//     }`;

//   try {
//     return await client.fetch(query, { slug });
//   } catch (err) {
//     console.log(err);
//     return [];
//   }
// }
