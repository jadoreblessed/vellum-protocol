"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { isAddress } from "viem";
import {
  clearVellumVaultAddress,
  saveVellumVaultAddress,
  shortenVellumVaultAddress,
  useVellumVaultAddress,
} from "../lib/vellumVaultAddress";
import { logout } from "./actions";
import styles from "./admin.module.css";

export default function AdminPanel() {
  const currentAddress = useVellumVaultAddress();
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "copied" | "cleared">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(currentAddress);
  }, [currentAddress]);

  function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextAddress = draft.trim();

    if (!isAddress(nextAddress)) {
      setError("Enter a valid 0x contract address.");
      setStatus("idle");
      return;
    }

    saveVellumVaultAddress(nextAddress);
    setDraft(nextAddress);
    setError("");
    setStatus("saved");
  }

  function clearAddress() {
    clearVellumVaultAddress();
    setDraft("");
    setError("");
    setStatus("cleared");
  }

  async function copyAddress() {
    if (!currentAddress) return;
    await navigator.clipboard.writeText(currentAddress);
    setStatus("copied");
  }

  const statusText = error
    || (status === "saved" ? "Saved. The CA is live in this browser."
      : status === "copied" ? "Copied to clipboard."
        : status === "cleared" ? "Cleared. The site is back to coming soon."
          : "");

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <section className={styles.card}>
        <header className={styles.header}>
          <Link href="/" className={styles.wordmark} aria-label="Back to Vellum">Vellum</Link>
          <form action={logout}><button className={styles.logout} type="submit">Log out</button></form>
        </header>

        <div className={styles.intro}>
          <p>VAULT CONFIGURATION</p>
          <h1>Contract address.</h1>
        </div>

        <form className={styles.form} onSubmit={saveAddress}>
          <label htmlFor="vault-address">CA</label>
          <input
            id="vault-address"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setError("");
              setStatus("idle");
            }}
            placeholder="0x..."
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="none"
          />
          <div className={styles.actions}>
            <button className={styles.save} type="submit">Save CA</button>
            <button className={styles.clear} type="button" onClick={clearAddress}>Clear</button>
          </div>
        </form>

        <div className={styles.current}>
          <span>CURRENT CA</span>
          <button type="button" onClick={copyAddress} disabled={!currentAddress}>
            <code>{shortenVellumVaultAddress(currentAddress)}</code>
            <small>{currentAddress ? "CLICK TO COPY" : "NOT CONFIGURED"}</small>
          </button>
        </div>

        <p className={`${styles.status} ${error ? styles.error : ""}`} role="status" aria-live="polite">
          {statusText}
        </p>
      </section>
    </main>
  );
}
