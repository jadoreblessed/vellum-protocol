"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import styles from "./CinematicHero.module.css";

function HeroLetters({ text, offset = 0 }: { text: string; offset?: number }) {
  return <>{[...text].map((letter, index) => <span className={styles.heroLetter} style={{ "--letter-delay": `${offset + index * 28}ms` } as React.CSSProperties} aria-hidden="true" key={`${letter}-${index}`}>{letter === " " ? "\u00a0" : letter}</span>)}</>;
}

export default function CinematicHero() {
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

  return (
    <section className={styles.hero}>
      <Image className={styles.image} src="/brand/terminal-fibre-ridge-v2.webp" alt="" fill priority quality={100} sizes="100vw" />
      <div className={styles.content}>
        <div className={styles.copy}>
          <h1 aria-label="Positions that outlive the trade."><span className={styles.heroLine}><HeroLetters text="Positions that" /></span><em className={styles.heroLine}><HeroLetters text="outlive the trade." offset={15} /></em></h1>
          <p>Lock a real balance. Carry its claim as one clear, transferable instrument.</p>
          <div className={styles.actions}>
            <Link href="/app" className={styles.primary}>Open Vellum <span>↗</span></Link>
            <Link href="#how" className={styles.secondary}>How it works</Link>
          </div>
        </div>

        <div className={styles.terminal} aria-label="Vellum contract panel">
          <div className={styles.terminalTop}><span><i /> VELLUM CONTRACT</span><span>ROBINHOOD CHAIN</span></div>
          <div className={styles.terminalScreen}>
            <span className={styles.terminalLabel}>POSITION VAULT · VERIFIED</span>
            <strong>0x020b...18B4</strong>
            <p className={styles.terminalHint}>A live position becomes a bearer note.</p>
            <Link href="/app" className={styles.terminalCta}>Open Vellum <b>↗</b></Link>
          </div>
        </div>
      </div>
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
