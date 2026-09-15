import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import { fetchTranslations } from "@/lib/translations/server";
import type { Translations } from "@/lib/translations";
import styles from "./styles.module.scss";

type PostItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: { asset?: { _ref?: string }; alt?: string };
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function pageHref(page: number) {
  return page === 1 ? "/blog" : `/blog?page=${page}`;
}

function Pagination({
  page,
  totalPages,
  t,
}: {
  page: number;
  totalPages: number;
  t: Translations["blogList"];
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  const delta = 2;
  const left = page - delta;
  const right = page + delta;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav className={styles.pagination} aria-label={t.paginationLabel}>
      <Link
        href={pageHref(page - 1)}
        className={`${styles.pageBtn} ${page === 1 ? styles.pageBtnDisabled : ""}`}
        aria-disabled={page === 1}
        tabIndex={page === 1 ? -1 : undefined}
        aria-label={t.prevPage}
      >
        ←
      </Link>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p)}
            className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={pageHref(page + 1)}
        className={`${styles.pageBtn} ${page === totalPages ? styles.pageBtnDisabled : ""}`}
        aria-disabled={page === totalPages}
        tabIndex={page === totalPages ? -1 : undefined}
        aria-label={t.nextPage}
      >
        →
      </Link>
    </nav>
  );
}

export default async function BlogList({
  posts,
  page,
  totalPages,
}: {
  posts: PostItem[];
  page: number;
  totalPages: number;
}) {
  const { blogList: t } = await fetchTranslations();

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>{t.title}</h1>
          <p className={styles.heroLead}>{t.lead}</p>
        </div>
      </header>

      <section className={styles.list}>
        <div className="container">
          {posts.length === 0 ? (
            <p className={styles.empty}>{t.empty}</p>
          ) : (
            <>
              <div className={styles.grid}>
                {posts.map((post) => {
                  const imgUrl = post.coverImage?.asset
                    ? urlFor(post.coverImage).width(800).height(500).url()
                    : null;
                  return (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug}`}
                      className={styles.card}
                    >
                      {imgUrl && (
                        <div className={styles.cardImage}>
                          <Image
                            src={imgUrl}
                            alt={post.coverImage?.alt || post.title}
                            width={800}
                            height={500}
                            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className={styles.cardBody}>
                        {post.tags && post.tags.length > 0 && (
                          <div className={styles.tags}>
                            {post.tags.map((tag) => (
                              <span key={tag} className={styles.tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <h2 className={styles.cardTitle}>{post.title}</h2>
                        {post.excerpt && (
                          <p className={styles.cardExcerpt}>{post.excerpt}</p>
                        )}
                        <div className={styles.cardMeta}>
                          {post.author && <span>{post.author}</span>}
                          {post.publishedAt && (
                            <span>{formatDate(post.publishedAt)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Pagination page={page} totalPages={totalPages} t={t} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
