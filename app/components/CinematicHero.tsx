"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { shortenVellumVaultAddress, useVellumVaultAddress } from "../lib/vellumVaultAddress";
import styles from "./CinematicHero.module.css";

export default function CinematicHero() {
  const [copied, setCopied] = useState(false);
  const contractAddress = useVellumVaultAddress();
  const shortContractAddress = shortenVellumVaultAddress(contractAddress);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-floating-nav]");
    let frame = 0;
    const update = () => {
      frame = 0;
      nav?.toggleAttribute("data-compact", window.scrollY > 32);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  async function copyContractAddress() {
    if (!contractAddress) return;
    await navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className={styles.hero}>
      <Image className={styles.image} src="/brand/vellum-hero-landscape.webp" alt="" fill priority quality={100} sizes="100vw" />
      <div className={styles.content}>
        <div className={styles.copy}>
          <h1><span className={styles.heroLine}>Positions that</span><em className={styles.heroLine}>outlive the trade.</em></h1>
          <p>Lock a real balance. Carry its claim as one clear, transferable instrument.</p>
          <div className={styles.actions}>
            <Link href="/app" className={styles.primary}>Open Vellum</Link>
            <button type="button" className={styles.contractPanel} onClick={copyContractAddress} aria-label={contractAddress ? "Copy Vellum contract address" : "Vellum contract address coming soon"} disabled={!contractAddress}>
              <span className={styles.contractLogo}><Image src="/brand/instrument-tag.png" alt="" fill sizes="48px" /></span>
              <span className={styles.contractMeta}>
                <b>CONTRACT ADDRESS</b>
                <code>{copied ? "COPIED TO CLIPBOARD" : shortContractAddress}</code>
              </span>
            </button>
          </div>
          <a className={styles.socialLink} href="https://x.com/VellumRH" target="_blank" rel="noreferrer" aria-label="VellumRH on X"><span>X</span><b>VellumRH</b></a>
        </div>
      </div>
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
