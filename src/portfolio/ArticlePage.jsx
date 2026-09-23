import { createElement, useEffect, useMemo } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { usePortfolioContent } from "./context.jsx";
import { assetUrl, readingTime } from "./utils.js";

function renderInline(node, key = "0") {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const tag = node.tagName.toLowerCase();
  const safeTag = ["strong", "b", "em", "i", "code", "br", "a"].includes(tag) ? tag : "span";
  const children = [...node.childNodes].map((child, index) => renderInline(child, `${key}-${index}`));
  const href = tag === "a" ? node.getAttribute("href") : "";
  const safeHref = /^https?:\/\//i.test(href || "") ? href : undefined;
  return createElement(safeTag, { key, ...(safeTag === "a" ? { href: safeHref, target: "_blank", rel: "noreferrer" } : {}) }, ...children);
}

function articleBlocks(html = "") {
  const documentNode = new DOMParser().parseFromString(html, "text/html");
  const elements = [...documentNode.body.querySelectorAll("h1,h2,h3,h4,p,blockquote,pre,figure,ul,ol")]
    .filter((element) => !element.parentElement?.closest("blockquote,figure,ul,ol"));

  return elements.map((element, index) => {
    const tag = element.tagName.toLowerCase();
    if (tag === "figure") {
      const image = element.querySelector("img");
      return image ? { type: "image", src: image.getAttribute("src") || "", alt: image.alt || "Article visual", key: index } : null;
    }
    if (tag === "ul" || tag === "ol") {
      return { type: "list", ordered: tag === "ol", items: [...element.querySelectorAll(":scope > li")].map((item) => [...item.childNodes].map((child, childIndex) => renderInline(child, `${index}-${childIndex}`))), key: index };
    }
    return { type: tag, text: element.textContent.trim(), content: [...element.childNodes].map((child, childIndex) => renderInline(child, `${index}-${childIndex}`)), key: index };
  }).filter((item) => item && (item.text || item.src || item.items?.length));
}

function articleImageSource(src = "") {
  if (src.includes("1*MO-1iW1s45MTOW47whji9A.png")) return assetUrl("image/articles/football-data-python.png");
  if (/^\/?image\//.test(src)) return assetUrl(src);
  if (src.includes("cdn-images-1.medium.com")) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(src.replace(/^https?:\/\//, ""))}`;
  }
  return src;
}

export default function ArticlePage() {
  const { slug } = useParams();
  const { articles, site } = usePortfolioContent();
  const article = articles.find((item) => item.slug === slug);
  const blocks = useMemo(() => articleBlocks(article?.content), [article]);
  const coverBlock = blocks.find((block) => block.type === "image");
  const bodyBlocks = coverBlock ? blocks.filter((block) => block !== coverBlock) : blocks;
  const coverSource = article?.thumbnail || coverBlock?.src;

  useEffect(() => {
    if (article) document.title = `${article.title} | Bassam El-Shoraa`;
  }, [article]);

  if (!article) {
    return (
      <section className="inner-page section-pad error-state">
        <span className="eyebrow">Insight not available</span>
        <h1>This Medium article could not be loaded inside the portfolio.</h1>
        <a className="button" href={site.profile.medium} target="_blank" rel="noreferrer">Browse Medium <ArrowUpRight size={17} /></a>
      </section>
    );
  }

  return (
    <article className="article-page inner-page section-pad">
      <Link className="back-link" to="/#articles"><ArrowLeft size={17} /> Back to articles</Link>
      <header className="article-header">
        <span className="eyebrow">Data note</span>
        <h1>{article.title}</h1>
      </header>

      {coverSource && (
        <figure className="article-cover-hero">
          <img src={articleImageSource(coverSource)} alt={coverBlock?.alt || article.title} />
        </figure>
      )}

      <div className="article-byline">
        <span><CalendarDays size={16} /> {new Date(article.pubDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        <span><Clock3 size={16} /> {readingTime(article.content)} min read</span>
        {article.link && <a href={article.link} target="_blank" rel="noreferrer">Original on Medium <ExternalLink size={14} /></a>}
      </div>

      <div className="article-reading-shell">
        <div className="article-progress"><span /></div>
        <div className="article-content">
          {bodyBlocks.map((block) => {
            if (block.type === "image") return <img key={block.key} src={articleImageSource(block.src)} alt={block.alt} loading="lazy" />;
            if (block.type === "h1" || block.type === "h2" || block.type === "h3" || block.type === "h4") return <h2 key={block.key}>{block.content}</h2>;
            if (block.type === "blockquote") return <blockquote key={block.key}>{block.content}</blockquote>;
            if (block.type === "pre") return <pre key={block.key}><code>{block.text}</code></pre>;
            if (block.type === "list") {
              const List = block.ordered ? "ol" : "ul";
              return <List key={block.key}>{block.items.map((item, index) => <li key={index}>{item}</li>)}</List>;
            }
            return <p key={block.key}>{block.content}</p>;
          })}
        </div>
      </div>
    </article>
  );
}
