import { writeFile } from "node:fs/promises";
import { localizeArticleImages } from "./localize-article-images.mjs";

const feed = "https://medium.com/feed/@bassamelshoraa";
const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`;
const response = await fetch(endpoint);
if (!response.ok) throw new Error(`Medium feed unavailable: ${response.status}`);
const payload = await response.json();
if (!Array.isArray(payload.items) || !payload.items.length) throw new Error("Medium feed returned no articles.");

const articles = payload.items.map((item, index) => ({
  id: item.guid || String(index),
  title: item.title || `Article ${index + 1}`,
  link: item.link || "",
  thumbnail: item.title === "Analyzing Football Data with Python" ? "image/articles/football-data-python.png" : item.thumbnail || "",
  pubDate: item.pubDate || "",
  author: item.author || "Bassam El-Shoraa",
  categories: item.categories || [],
  description: item.description || "",
  content: item.content || item.description || "",
  slug: `${item.title || `article-${index}`}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
}));

await localizeArticleImages(articles);
await writeFile(new URL("../public/data/articles.json", import.meta.url), `${JSON.stringify(articles, null, 2)}\n`);
console.log(`Saved ${articles.length} article(s).`);
