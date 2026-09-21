export async function blogLoader() {
  const res = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@bassamelshoraa"
  );
  if (!res.ok) {
    throw new Response("Failed to fetch blog posts", { status: res.status });
  }
  return res.json();
}
