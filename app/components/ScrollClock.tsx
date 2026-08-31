"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../home.module.css";
import TextReveal from "./TextReveal";

export default function ScrollClock() {
  const sectionRef = useRef<HTMLElement>(null);
  const [days, setDays] = useState(90);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / travel));
        section.style.setProperty("--clock-progress", progress.toFixed(3));
        setDays(Math.round(90 - progress * 23));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className={styles.maturity} ref={sectionRef}>
      <div className={styles.maturitySticky}>
        <TextReveal className={styles.maturityCopy}>
          <span className={styles.index}>05 / BLOCK CLOCK</span>
          <h2>Time is part<br />of the <em>instrument.</em></h2>
          <p>Maturity cannot be edited, paused or hidden. The state changes when the chain says it does.</p>
          <Link href="/maturity">Inspect maturity ↗</Link>
          <div className={styles.clockStates}><span>LOCKED</span><i /><span>MATURING</span><i /><span>CLAIMABLE</span></div>
        </TextReveal>
        <div className={styles.clock}>
          <div className={styles.clockRings}><i /><i /><i /></div>
          <div className={styles.clockGhost}>CLAIM</div>
          <b>{days}</b><span>DAYS REMAINING</span>
          <div className={styles.progress}><i /></div>
          <footer><span>06 AUG 2026</span><span>04 NOV 2026</span></footer>
          <div className={styles.blockReadout}><span>BLOCK</span><b>18,421</b><i /> FINALITY 12s</div>
        </div>
      </div>
    </section>
  );
}
