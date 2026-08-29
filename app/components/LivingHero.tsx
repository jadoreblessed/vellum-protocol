"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import TokenLogo from "./TokenLogo";
import styles from "./LivingHero.module.css";

const tokens = [
  { symbol: "$CASHCAT", amount: "250K", color: "#19834b", position: "tokenA" },
  { symbol: "$PONS", amount: "1.2M", color: "#4168e8", position: "tokenB" },
  { symbol: "$IF", amount: "4M", color: "#d34e36", position: "tokenC" },
];

export default function LivingHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const updatePointer = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--pointer-x", String((event.clientX - rect.left) / rect.width - 0.5));
        hero.style.setProperty("--pointer-y", String((event.clientY - rect.top) / rect.height - 0.5));
      });
    };
    const resetPointer = () => {
      hero.style.setProperty("--pointer-x", "0");
      hero.style.setProperty("--pointer-y", "0");
    };
    hero.addEventListener("pointermove", updatePointer, { passive: true });
    hero.addEventListener("pointerleave", resetPointer);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", updatePointer);
      hero.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.surface} aria-hidden="true">
        <div className={`${styles.wave} ${styles.waveBack}`} />
        <div className={`${styles.wave} ${styles.waveMid}`} />
        <div className={`${styles.wave} ${styles.waveFront}`} />
        <div className={styles.grain} />
        <div className={`${styles.orbit} ${styles.orbitOne}`} />
        <div className={`${styles.orbit} ${styles.orbitTwo}`} />
        <div className={styles.glow} />
      </div>

      <div className={styles.content}>
        <div className={styles.copy}>
          <div className={styles.kicker}><span /> Robinhood Chain · Live instrument layer</div>
          <h1>Positions<br />enter here.<br /><em>Claims move.</em></h1>
          <p>Vellum turns a real token balance into a clear, transferable position — held in custody while its ownership travels.</p>
          <div className={styles.actions}>
            <Link href="/app" className={styles.primary}>Route a position <span>↗</span></Link>
            <Link href="/how-it-works" className={styles.secondary}>Watch the lifecycle</Link>
          </div>
          <div className={styles.metrics}>
            <span><b>$119.2M</b> routed value</span>
            <span><b>18,421</b> live block</span>
            <span><b>12s</b> finality</span>
          </div>
        </div>

        <div className={styles.scene} aria-label="Live Vellum position visualization">
          <div className={styles.sceneHeader}><span>01 / POSITION ROUTE</span><b><i /> LIVE</b></div>
          <div className={styles.sceneCenter}>
            <div className={`${styles.ring} ${styles.ringOuter}`} />
            <div className={`${styles.ring} ${styles.ringMiddle}`} />
            <div className={`${styles.ring} ${styles.ringInner}`} />
            <div className={styles.core}><span>V</span><small>VELLUM</small></div>
            <div className={styles.coreLabel}>IMMUTABLE<br /><b>POSITION</b></div>
          </div>
          <div className={styles.flowLine}><i /><i /><i /><span>OWNERSHIP ROUTE</span></div>
          {tokens.map((token, index) => (
            <div className={`${styles.token} ${styles[token.position as "tokenA" | "tokenB" | "tokenC"]}`} key={token.symbol}>
              <span className={styles.tokenLogo}><TokenLogo symbol={token.symbol} color={token.color} /></span>
              <span><small>{index === 0 ? "IN CUSTODY" : "CLAIM MOVING"}</small><b>{token.symbol}</b><em>{token.amount}</em></span>
            </div>
          ))}
          <div className={styles.destination}><span>WALLET B</span><b>0x7C...91BE</b><small>RECEIVING CLAIM ↗</small></div>
          <div className={styles.sceneFoot}><span><i /> VAULT SEALED</span><span>TERM 90D</span><span>BLOCK 18,421</span></div>
        </div>
      </div>

      <div className={styles.scrollRail}><span>VELLUM ROUTING LAYER</span><i /><span>SCROLL TO ENTER THE SYSTEM ↓</span></div>
    </section>
  );
}
