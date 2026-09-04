import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "../../lib/adminAuth";
import LoginForm from "./LoginForm";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (isAdminSession(session)) {
    redirect("/admin");
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <section className={`${styles.card} ${styles.loginCard}`}>
        <header className={styles.header}>
          <Link href="/" className={styles.wordmark} aria-label="Back to Vellum">Vellum</Link>
          <span>ADMIN</span>
        </header>
        <div className={`${styles.intro} ${styles.loginIntro}`}>
          <p>RESTRICTED ACCESS</p>
          <h1>Enter.</h1>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
