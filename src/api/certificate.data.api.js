import { client } from "../lib/sanity";

export async function certificateDataFromApi() {
  const query = `*[_type == "certificate"] | order(dateReceived desc){
  title,
  "imageUrl": image.asset->url,
  dateReceived
}`;

  try {
    const fetchData = await client.fetch(query);
    return fetchData;
  } catch (err) {
    console.log(err);
    return [];
  }
}
