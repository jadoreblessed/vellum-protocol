"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./CinematicHero.module.css";

const contractAddress = process.env.NEXT_PUBLIC_VELLUM_CONTRACT_ADDRESS?.trim()
  ?? process.env.NEXT_PUBLIC_VELLUM_TEST_VAULT_ADDRESS?.trim()
  ?? "";

function HeroLetters({ text, offset = 0 }: { text: string; offset?: number }) {
  return <>{[...text].map((letter, index) => <span className={styles.heroLetter} style={{ "--letter-delay": `${offset + index * 28}ms` } as React.CSSProperties} aria-hidden="true" key={`${letter}-${index}`}>{letter === " " ? "\u00a0" : letter}</span>)}</>;
}

export default function CinematicHero() {
  const [copied, setCopied] = useState(false);

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
          <h1 aria-label="Positions that outlive the trade."><span className={styles.heroLine}><HeroLetters text="Positions that" /></span><em className={styles.heroLine}><HeroLetters text="outlive the trade." offset={15} /></em></h1>
          <p>Lock a real balance. Carry its claim as one clear, transferable instrument.</p>
          <div className={styles.actions}>
            <Link href="/app" className={styles.primary}>Open Vellum <span>↗</span></Link>
            <div className={styles.contractPanel}>
              <div>
                <small>CONTRACT ADDRESS</small>
                <code>{contractAddress || "CA TO BE ANNOUNCED"}</code>
              </div>
              <button type="button" onClick={copyContractAddress} disabled={!contractAddress} aria-label="Copy contract address">
                {copied ? "COPIED" : "COPY CA"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
