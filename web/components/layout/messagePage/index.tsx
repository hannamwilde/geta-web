import styles from "./styles.module.scss";

type Props = {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
};

export default function MessagePage({ eyebrow, title, body, children }: Props) {
  return (
    <main className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {body && <p className={styles.body}>{body}</p>}
          {children && <div className={styles.actions}>{children}</div>}
        </div>
      </div>
    </main>
  );
}
