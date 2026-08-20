import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/client";
import styles from "./styles.module.scss";

type PostData = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: { asset?: { _ref?: string }; alt?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPost({ post }: { post: PostData }) {
  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : null;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Brödsmulor">
            <Link href="/blog">← Blogg</Link>
          </nav>

          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className={styles.title}>{post.title}</h1>

          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

          <div className={styles.meta}>
            {post.author && (
              <span className={styles.author}>{post.author}</span>
            )}
            {post.publishedAt && (
              <span className={styles.date}>
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </header>

      {coverUrl && (
        <div className={styles.cover}>
          <div className="container">
            <img
              src={coverUrl}
              alt={post.coverImage?.alt || post.title}
              className={styles.coverImage}
            />
          </div>
        </div>
      )}

      {post.body && post.body.length > 0 && (
        <article className={styles.body}>
          <div className="container">
            <div className={styles.prose}>
              <PortableText value={post.body} />
            </div>
          </div>
        </article>
      )}

      <div className={styles.back}>
        <div className="container">
          <Link href="/blog" className={styles.backLink}>
            ← Alla inlägg
          </Link>
        </div>
      </div>
    </div>
  );
}
