import type { CSSProperties } from "react";
import TokenLogo from "./TokenLogo";
import styles from "./BearerNote.module.css";

type BearerNoteProps = {
  symbol?: string;
  name?: string;
  color?: string;
  amount?: string;
  term?: string;
  className?: string;
};

export default function BearerNote({
  symbol = "$CASHCAT",
  name = "Cash Cat",
  color = "#147b43",
  amount = "250,000",
  term = "90D",
  className = "",
}: BearerNoteProps) {
  return (
    <article className={`${styles.note} ${className}`} aria-label={`${name} bearer note`}>
      <div className={styles.edge} />
      <header className={styles.head}>
        <strong>vellum<span>.</span></strong>
        <span>BEARER NOTE · 000421</span>
      </header>

      <div className={styles.identity} style={{ "--token-color": color } as CSSProperties}>
        <span className={styles.logo}><TokenLogo symbol={symbol} color={color} /></span>
        <div><small>ROBINHOOD CHAIN</small><b>{symbol}</b><em>{name}</em></div>
        <i>VERIFIED</i>
      </div>

      <div className={styles.wave} aria-hidden="true">
        <svg viewBox="0 0 520 150" fill="none" preserveAspectRatio="none">
          {Array.from({ length: 11 }, (_, index) => <path key={index} d={`M-20 ${30 + index * 9} C 88 ${-14 + index * 7}, 148 ${150 - index * 7}, 258 ${75} S 428 ${-4 + index * 8}, 540 ${80 + index * 4}`} />)}
        </svg>
      </div>

      <div className={styles.custody}>
        <div className={styles.amount}><small>UNDER CUSTODY</small><strong>{amount}</strong><b>{symbol.replace("$", "")}</b></div>
      </div>

      <div className={styles.facts}>
        <span><small>ENTRY MARK</small><b>$0.0870</b></span>
        <span><small>TERM</small><b>{term}</b></span>
        <span><small>CLAIM</small><b>ACTIVE</b></span>
      </div>
      <footer className={styles.status}><i /><span>TRANSFERABLE CLAIM · UNLOCKS 04 NOV 2026</span><b>↗</b></footer>
    </article>
  );
}
