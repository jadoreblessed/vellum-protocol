"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import TokenLogo from "./TokenLogo";
import styles from "./BearerNote.module.css";

type BearerNoteProps = {
  symbol?: string;
  name?: string;
  color?: string;
  accent?: string;
  amount?: string;
  term?: string;
  mark?: string;
  network?: string;
  signalOnView?: boolean;
  className?: string;
  variant?: "default" | "compact";
};

function WaveField({ seed }: { seed: string }) {
  const signature = [...seed].reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 17);
  const primaryLift = 11 + (signature % 7);
  const counterPull = 7 + ((signature >>> 3) % 6);
  const phase = (signature % 9) - 4;

  return <svg className={styles.waveSvg} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
    <g className={styles.primaryWave}>{Array.from({ length: 13 }, (_, index) => {
      const y = 5 + index * 4.25;
      const lift = primaryLift - Math.abs(6 - index) * 1.05;
      return <path key={index} d={`M-8 ${y} C 12 ${y + lift}, ${25 + phase} ${y + lift}, 43 ${y} S ${70 - phase} ${y - lift}, 108 ${y + 3}`} />;
    })}</g>
    <g className={styles.counterWave}>{Array.from({ length: 9 }, (_, index) => {
      const y = 10 + index * 5;
      const pull = counterPull - Math.abs(4 - index) * .85;
      return <path key={index} d={`M-8 ${60 - y} C ${17 + phase} ${60 - y - pull}, ${35 - phase} ${30 - (y - 30) * .22}, 50 30 S ${78 + phase} ${y + pull}, 108 ${y}`} />;
    })}</g>
  </svg>;
}

export default function BearerNote({
  symbol = "$CASHCAT",
  name = "Cash Cat",
  color = "#147b43",
  accent = "#d7e94f",
  amount = "250,000",
  term = "90D",
  mark = "$0.0870",
  network = "ROBINHOOD CHAIN",
  signalOnView = true,
  className = "",
  variant = "default",
}: BearerNoteProps) {
  const noteRef = useRef<HTMLElement>(null);
  const [signalPlayed, setSignalPlayed] = useState(false);
  const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));
  const displayAmount = Number.isFinite(numericAmount) && numericAmount > 0 ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(numericAmount) : amount;
  const displayTerm = term === "OPEN" ? "OPEN" : term;

  useEffect(() => {
    const note = noteRef.current;
    if (!note || !signalOnView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setSignalPlayed(true);
      observer.disconnect();
    }, { threshold: 0.42 });

    observer.observe(note);
    return () => observer.disconnect();
  }, [signalOnView]);

  return (
    <article
      ref={noteRef}
      className={`${styles.note} ${variant === "compact" ? styles.compact : ""} ${signalPlayed ? styles.signalPlayed : ""} ${className}`}
      style={{ "--accent": accent, "--token-color": color } as CSSProperties}
      aria-label={`${name} bearer note`}
    >
      <span className={styles.edgeGlow} aria-hidden="true" />
      <header className={styles.header}><b>vellum<span>.</span></b><small>{network} / 000421</small></header>
      <div className={styles.identity}><div><small>{symbol}</small><b>{name}</b><em>BEARER POSITION</em></div><span className={styles.logo}><TokenLogo symbol={symbol} color={color} /></span></div>
      <div className={styles.wave}><WaveField seed={symbol} /></div>
      <div className={styles.balance}><small>BALANCE</small><strong>{displayAmount}</strong><b>{symbol.replace("$", "")}</b></div>
      <div className={styles.facts}><span><small>ENTRY MARK</small><b>{mark}</b></span><span><small>TERM</small><b>{displayTerm}</b></span><span><small>CLAIM</small><b>ACTIVE</b></span></div>
      <footer className={styles.status}>TRANSFERABLE · {network}</footer>
    </article>
  );
}
