"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import TokenLogo from "./TokenLogo";
import styles from "./LivingHero.module.css";

export default function LivingHero() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scene.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--mx", `${(event.clientX - rect.left) / rect.width - 0.5}`);
        node.style.setProperty("--my", `${(event.clientY - rect.top) / rect.height - 0.5}`);
      });
    };
    const reset = () => {
      node.style.setProperty("--mx", "0");
      node.style.setProperty("--my", "0");
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <section className={styles.hero} ref={scene}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.hypnotic} aria-hidden="true">
        <i /><i /><i /><i />
        <span className={styles.lensOne} /><span className={styles.lensTwo} />
      </div>
      <svg className={styles.cord} viewBox="0 0 1600 900" fill="none" aria-hidden="true">
        <defs>
          <filter id="living-rope" x="-15%" y="-20%" width="130%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="2" seed="8" result="noise">
              <animate attributeName="baseFrequency" dur="7s" values="0.006 0.018;0.009 0.012;0.006 0.018" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
        <g filter="url(#living-rope)">
        <path className={styles.cordShadow} d="M-80 670C170 610 240 265 530 330C780 386 687 762 1005 705C1284 654 1204 185 1680 130" />
        <path className={styles.cordBase} d="M-80 670C170 610 240 265 530 330C780 386 687 762 1005 705C1284 654 1204 185 1680 130" />
        <path className={styles.cordHighlight} d="M-80 670C170 610 240 265 530 330C780 386 687 762 1005 705C1284 654 1204 185 1680 130" />
        <path className={styles.cordPulse} d="M-80 670C170 610 240 265 530 330C780 386 687 762 1005 705C1284 654 1204 185 1680 130" />
        </g>
        <circle className={styles.signalBead} r="11"><animateMotion dur="5.5s" repeatCount="indefinite" path="M-80 670C170 610 240 265 530 330C780 386 687 762 1005 705C1284 654 1204 185 1680 130" /></circle>
        <circle className={styles.signalBeadSmall} r="5"><animateMotion begin="-2.2s" dur="5.5s" repeatCount="indefinite" path="M-80 670C170 610 240 265 530 330C780 386 687 762 1005 705C1284 654 1204 185 1680 130" /></circle>
      </svg>

      <div className={styles.heroInner}>
        <div className={styles.copy}>
          <div className={styles.kicker}><span>Robinhood Chain</span><i /> Live bearer instruments</div>
          <h1>Positions<br />were static.<br /><em>Not anymore.</em></h1>
          <p>Vellum turns a token balance into a portable onchain note — priced, timed and ready to move without selling the underlying position.</p>
          <div className={styles.actions}>
            <Link href="/app" className={styles.primary}>Build a note <span>↗</span></Link>
            <Link href="/how-it-works" className={styles.secondary}>Trace the lifecycle</Link>
          </div>
          <div className={styles.proof}>
            <span><b>01</b> Vaulted</span><span><b>02</b> Transferable</span><span><b>03</b> Claimable</span>
          </div>
        </div>

        <div className={styles.stage} aria-label="Live Vellum note preview">
          <div className={`${styles.floatTag} ${styles.tagTop}`}><span>MARK</span><b>$0.1206</b><small>+2.41% TODAY</small></div>
          <div className={`${styles.floatTag} ${styles.tagSide}`}><span>OWNER</span><b>0x7C...91BE</b><small>NOTE HOLDER</small></div>
          <div className={styles.noteShadow} />
          <article className={styles.note}>
            <div className={styles.noteHead}><b>vellum</b><span>BEARER POSITION</span><span>№ 000421</span></div>
            <div className={styles.tokenBand}>
              <div className={styles.logo}><TokenLogo symbol="$CASHCAT" color="#147b43" /></div>
              <div><small>UNDERLYING</small><strong>$CASHCAT</strong><span>Cash Cat · Robinhood</span></div>
              <i>LIVE</i>
            </div>
            <div className={styles.amountLabel}>POSITION</div>
            <div className={styles.amount}>250,000 <small>CASHCAT</small></div>
            <div className={styles.price}>≈ $30,150 <span>AT MARK</span></div>
            <div className={styles.stats}>
              <div><span>ENTRY</span><b>$0.0870</b></div><div><span>MARK</span><b>$0.1206</b></div><div><span>PNL</span><b className={styles.positive}>+38.6%</b></div>
            </div>
            <div className={styles.lock}><span>⌗</span><b>LOCKED UNTIL 04 NOV 2026</b><small>SEALED</small></div>
            <div className={styles.noteBottom}><span>90 DAY TERM</span><span>PAYABLE TO BEARER</span></div>
          </article>
          <div className={styles.scan} />
          <div className={styles.routeLabel}><span /> ERC-721 CLAIM IN MOTION</div>
        </div>
      </div>

      <div className={styles.bottomRail}><span>VLM / 001</span><span>POSITION → NOTE → WALLET → CLAIM</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
  );
}
