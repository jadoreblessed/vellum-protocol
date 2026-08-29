"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import TokenLogo from "./TokenLogo";
import styles from "./LivingHero.module.css";

const assets = [
  { symbol: "$CASHCAT", amount: "250K", color: "#147b43", className: styles.podOne },
  { symbol: "$PONS", amount: "1.2M", color: "#315eea", className: styles.podTwo },
  { symbol: "$IF", amount: "4M", color: "#cf452f", className: styles.podThree },
];

export default function LivingHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", String((event.clientX - rect.left) / rect.width - 0.5));
        hero.style.setProperty("--my", String((event.clientY - rect.top) / rect.height - 0.5));
      });
    };
    const reset = () => { hero.style.setProperty("--mx", "0"); hero.style.setProperty("--my", "0"); };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.atmosphere} aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className={styles.copy}>
        <div className={styles.kicker}><span /> Robinhood Chain · Live route</div>
        <h1>Positions<br />enter here.<br /><em>Claims move.</em></h1>
        <p>Vellum routes a real token balance into an immutable vault and sends its ownership forward as a portable onchain instrument.</p>
        <div className={styles.actions}>
          <Link href="/app" className={styles.primary}>Route a position <span>↗</span></Link>
          <Link href="/how-it-works" className={styles.secondary}>Watch the lifecycle</Link>
        </div>
        <div className={styles.metrics}><span><b>$119.2M</b> routed value</span><span><b>18,421</b> live block</span><span><b>12s</b> finality</span></div>
      </div>

      <div className={styles.viewport} aria-label="A live token route entering the Vellum vault">
        <div className={styles.world}>
          <div className={styles.horizon}><i /><i /><i /></div>
          <div className={styles.trackRig}>
            <div className={styles.trackBed}>
              <div className={styles.railLeft} /><div className={styles.railRight} /><div className={styles.energyLane} />
              <div className={styles.sleepers} />
              {assets.map(asset => <div className={`${styles.assetPod} ${asset.className}`} key={asset.symbol}>
                <span><TokenLogo symbol={asset.symbol} color={asset.color} /></span><b>{asset.symbol}</b><small>{asset.amount}</small><i />
              </div>)}
            </div>
          </div>

          <div className={styles.vaultAssembly}>
            <div className={styles.vaultHalo}><i /><i /><i /></div>
            <div className={styles.vaultCube}>
              <div className={styles.vaultTop}><span>VLM // ROUTER</span></div>
              <div className={styles.vaultSide}><span>VAULT 01</span></div>
              <div className={styles.vaultFront}>
                <div className={styles.aperture}><i /><i /><b>V</b></div>
                <span>POSITION IN CUSTODY</span><strong>250,000 CASHCAT</strong><small>IMMUTABLE · VERIFIED</small>
              </div>
            </div>
            <div className={styles.intakeGlow} />
          </div>

          <div className={styles.claimRoute}>
            <div className={styles.routeTube}><i /><i /></div>
            <div className={styles.claimCapsule}><span>ERC-721</span><b>CLAIM / 000421</b><small>IN MOTION →</small></div>
            <div className={styles.walletNode}><span>WALLET B</span><b>0x7C...91BE</b><i>RECEIVING</i></div>
          </div>

          <div className={styles.telemetry}>
            <span><i /> INTAKE OPEN</span><span>TERM 90D</span><span>ROUTE 0.84s</span>
          </div>
        </div>
      </div>
      <div className={styles.scrollRail}><span>VELLUM ROUTING LAYER</span><i /><span>SCROLL TO ENTER THE SYSTEM ↓</span></div>
    </section>
  );
}
