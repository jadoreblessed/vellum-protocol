"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import TokenLogo from "./TokenLogo";
import TextReveal from "./TextReveal";
import BearerNote from "./BearerNote";
import styles from "../home.module.css";
import refinement from "./PositionLabRefinement.module.css";

export default function PositionLab() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const distance = window.innerHeight + rect.height;
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / distance));
        section.style.setProperty("--lab-progress", progress.toFixed(3));
      });
    };
    const updatePointer = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      section.style.setProperty("--lab-x", x.toFixed(3));
      section.style.setProperty("--lab-y", y.toFixed(3));
    };
    const resetPointer = () => {
      section.style.setProperty("--lab-x", "0");
      section.style.setProperty("--lab-y", "0");
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    section.addEventListener("pointermove", updatePointer, { passive: true });
    section.addEventListener("pointerleave", resetPointer);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      section.removeEventListener("pointermove", updatePointer);
      section.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <section className={styles.lab} ref={sectionRef}>
      <div className={styles.labGlow} />
      <div className={styles.labAurora} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.labHeader}>
        <span className={styles.index}>03 / POSITION LAB</span>
        <span><i className={styles.liveDot} /> Live preview</span>
      </div>
      <TextReveal className={styles.labCopy}>
        <h2>Pick the facts.<br /><em>Watch the note form.</em></h2>
        <p>A product preview that behaves like the app: token, amount and time converge into one transferable object.</p>
      </TextReveal>

      <div className={styles.builder}>
        <div className={styles.builderControls}>
          <div className={styles.controlLabel}><span>UNDERLYING TOKEN</span><b>01</b></div>
          <div className={`${styles.tokenChoice} ${refinement.tokenChoice}`}>
            <span><TokenLogo symbol="$CASHCAT" color="#147b43" /></span>
            <div><b>$CASHCAT</b><small>Cash Cat</small></div>
            <em>SELECTED</em>
          </div>
          <label><span>POSITION AMOUNT</span><b>250,000</b><i>CASHCAT</i></label>
          <label><span>LOCK TERM</span><b>90</b><i>DAYS</i></label>
          <div className={styles.builderStatus}><span>ENTRY MARK</span><b>$0.0870</b><span>EST. VALUE</span><b>$30,150</b></div>
          <div className={styles.labSteps} aria-hidden="true">
            <span className={styles.labStepActive}>01 TOKEN</span><i />
            <span>02 TERM</span><i />
            <span>03 NOTE</span>
          </div>
          <Link href="/app" className={styles.buildButton}>Continue in app <span>↗</span></Link>
        </div>

        <div className={styles.builderScene}>
          <div className={styles.sceneGrid} />
          <div className={styles.builderOrbit} /><div className={styles.builderOrbit} />
          <div className={styles.assemblyRail} aria-hidden="true"><i /><i /><i /><i /></div>
          <div className={styles.noteStack}>
            <BearerNote className={refinement.labNote} />
          </div>
        </div>
      </div>
    </section>
  );
}
