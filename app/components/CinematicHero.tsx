"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./CinematicHero.module.css";

export default function CinematicHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-floating-nav]");
    const hero = heroRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      nav?.toggleAttribute("data-compact", window.scrollY > 32);

      if (!hero || reduceMotion) return;

      const bounds = hero.getBoundingClientRect();
      const travel = Math.max(1, bounds.height * 0.78);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));

      hero.style.setProperty("--hero-copy-y", `${Math.round(progress * -60)}px`);
      hero.style.setProperty("--hero-copy-opacity", (1 - progress).toFixed(3));
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <Image className={styles.image} src="/brand/vellum-hero-forest-pool.webp" alt="" fill priority quality={100} sizes="100vw" />
      <div className={styles.waterMist} aria-hidden="true">
        <span className={styles.mistNear} />
        <span className={styles.mistMiddle} />
        <span className={styles.mistFar} />
      </div>
      <div className={styles.content}>
        <div className={styles.copy}>
          <h1><span className={styles.heroLine}>Positions that</span><em className={styles.heroLine}>outlive the trade.</em></h1>
          <p>Lock a real balance. Carry its claim as one clear, transferable instrument.</p>
          <div className={styles.actions}>
            <Link href="/app" className={styles.primary}>Open Vellum</Link>
            <button type="button" className={styles.contractPanel} aria-label="Vellum contract address coming soon" disabled>
              <span className={styles.contractLogo}><Image src="/brand/instrument-tag.png" alt="" fill sizes="48px" /></span>
              <span className={styles.contractMeta}>
                <code>CA COMING SOON</code>
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
