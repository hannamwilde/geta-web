import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import BlogPostBody from "./components/blogPostBody";
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
  // Wide crop around the hotspot — the hero is a letterbox band, not a 1200x630 card.
  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1920).height(900).url()
    : null;

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        data-has-cover={coverUrl ? "true" : undefined}
      >
        {coverUrl && (
          <>
            <Image
              src={coverUrl}
              alt=""
              width={1920}
              height={1000}
              sizes="100vw"
              priority
              className={styles.coverMedia}
            />
            <div className={styles.overlay} aria-hidden />
          </>
        )}
        <div className={`container ${styles.heroContent}`}>
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

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

      {post.body && post.body.length > 0 && (
        <article className={styles.body}>
          <div className="container">
            <div className={styles.prose}>
              <BlogPostBody value={post.body} />
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
