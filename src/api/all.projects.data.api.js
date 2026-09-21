// import { client } from "../lib/sanity";

export async function getAllProjects() {
  // const query = `*[_type == "project"] | order(date desc){
  //   title,
  //   slug,
  //   description,
  //   "imageUrl": image.asset->url,
  //   projectUrl,
  //   demoUrl,
  //   skills,
  //   codeFiles[]{title, url},
  //   date
  // }`;

  try {
    const res = await fetch("/data/portfolioProjects.json");
    if (!res.ok) throw new Error("Failed to load certificates");

    const data = await res.json();
    return data;
    // return await client.fetch(query);
  } catch (err) {
    console.log(err);
    return [];
  }
}
