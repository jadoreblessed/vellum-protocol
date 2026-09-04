"use client";

import { useActionState } from "react";
import { login } from "../actions";
import styles from "../admin.module.css";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <form className={styles.form} action={action}>
      <label htmlFor="admin-password">PASSWORD</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
      />
      <button className={styles.loginButton} type="submit" disabled={pending}>
        {pending ? "Checking..." : "Enter admin"}
      </button>
      <p className={`${styles.status} ${state.error ? styles.error : ""}`} role="alert" aria-live="polite">
        {state.error}
      </p>
    </form>
  );
}
