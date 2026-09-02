import Image from "next/image";
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
  const rawAmount = Number(amount.replace(/[^0-9.]/g, ""));
  const displayAmount = Number.isFinite(rawAmount) && rawAmount > 0
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(rawAmount)
    : amount;
  const displaySymbol = symbol.replace("$", "");
  const displayTerm = term === "OPEN" ? "OPEN" : term.replace(/D$/i, " DAYS");

  return (
    <article className={`${styles.note} ${className}`} aria-label={`${name} bearer note`}>
      <Image className={styles.referenceImage} src="/brand/vellum-bearer-note-v3.webp" alt={`${name} bearer note`} width={665} height={1740} priority />
      <span className={styles.portalLight} aria-hidden="true" />
      <span className={styles.portalLines} aria-hidden="true" />
      <div className={styles.dynamicAmount} aria-label={`Amount ${displayAmount} ${displaySymbol}`}>{displayAmount}</div>
      <div className={styles.dynamicToken}><span>{name}</span><b>{displaySymbol}</b></div>
      <div className={styles.dynamicTerm}>{displayTerm}</div>
    </article>
  );
}
