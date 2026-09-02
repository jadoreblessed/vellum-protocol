import styles from "./BearerNote.module.css";

type BearerNoteProps = {
  symbol?: string;
  name?: string;
  color?: string;
  amount?: string;
  term?: string;
  className?: string;
  variant?: "default" | "compact";
};

const stoneGlyph: Record<string, string> = { "$CASHCAT": "✦", "$PONS": "P", "$IF": "I" };

export default function BearerNote({
  symbol = "$CASHCAT",
  name = "Cash Cat",
  amount = "250,000",
  term = "90D",
  className = "",
  variant = "default",
}: BearerNoteProps) {
  const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));
  const displayAmount = Number.isFinite(numericAmount) && numericAmount > 0
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(numericAmount)
    : amount;
  const displaySymbol = symbol.replace("$", "");
  const displayTerm = term === "OPEN" ? "OPEN" : term.replace(/D$/i, " DAYS");
  const glyph = stoneGlyph[symbol] ?? "V";

  return (
    <article className={`${styles.note} ${variant === "compact" ? styles.compact : ""} ${className}`} aria-label={`${name} bearer note`}>
      <header className={styles.header}><b>vellum<span>.</span></b><small>VLM / 000421</small></header>
      <div className={styles.portal} aria-hidden="true"><i /><i /><i /><span>{glyph}</span></div>
      <div className={styles.identity}>
        <div className={`${styles.stone} ${symbol === "$PONS" ? styles.ponsStone : symbol === "$IF" ? styles.ifStone : ""}`}><i>{glyph}</i></div>
        <div><small>UNDERLYING</small><b>{name}</b><em>{symbol}</em></div>
      </div>
      <div className={styles.balance}><small>POSITION BALANCE</small><strong>{displayAmount}</strong><b>{displaySymbol}</b></div>
      <div className={styles.facts}><span><small>MARK</small><b>$0.0870</b></span><span><small>TERM</small><b>{displayTerm}</b></span><span><small>CLAIM</small><b>TRANSFERABLE</b></span></div>
      <footer className={styles.status}><i /> <span>CLAIM MOVES WITH HOLDER</span><b>SEALED</b></footer>
    </article>
  );
}
