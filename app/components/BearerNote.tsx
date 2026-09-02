import TokenLogo from "./TokenLogo";
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

function WaveField() {
  return <svg className={styles.waveSvg} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
    <g className={styles.primaryWave}>{Array.from({ length: 13 }, (_, index) => {
      const y = 5 + index * 4.25;
      const lift = 15 - Math.abs(6 - index) * 1.2;
      return <path key={index} d={`M-8 ${y} C 12 ${y + lift}, 25 ${y + lift}, 43 ${y} S 70 ${y - lift}, 108 ${y + 3}`} />;
    })}</g>
    <g className={styles.counterWave}>{Array.from({ length: 9 }, (_, index) => {
      const y = 10 + index * 5;
      const pull = 9 - Math.abs(4 - index) * .9;
      return <path key={index} d={`M-8 ${60 - y} C 17 ${60 - y - pull}, 35 ${30 - (y - 30) * .22}, 50 30 S 78 ${y + pull}, 108 ${y}`} />;
    })}</g>
    <circle className={styles.coreDot} cx="50" cy="30" r="1.35" />
  </svg>;
}

export default function BearerNote({
  symbol = "$CASHCAT",
  name = "Cash Cat",
  color = "#147b43",
  amount = "250,000",
  term = "90D",
  className = "",
  variant = "default",
}: BearerNoteProps) {
  const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));
  const displayAmount = Number.isFinite(numericAmount) && numericAmount > 0 ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(numericAmount) : amount;
  const displayTerm = term === "OPEN" ? "OPEN" : term;

  return (
    <article className={`${styles.note} ${variant === "compact" ? styles.compact : ""} ${className}`} aria-label={`${name} bearer note`}>
      <span className={styles.edgeGlow} aria-hidden="true" />
      <header className={styles.header}><b>vellum<span>.</span></b><small>VLM / 000421</small></header>
      <div className={styles.identity}><div><small>{symbol}</small><b>{name}</b><em>BEARER POSITION</em></div><span className={styles.logo}><TokenLogo symbol={symbol} color={color} /></span></div>
      <div className={styles.wave}><WaveField /></div>
      <div className={styles.balance}><small>BALANCE</small><strong>{displayAmount}</strong><b>{symbol.replace("$", "")}</b></div>
      <div className={styles.facts}><span><small>ENTRY MARK</small><b>$0.0870</b></span><span><small>TERM</small><b>{displayTerm}</b></span><span><small>CLAIM</small><b>ACTIVE</b></span></div>
      <footer className={styles.status}>TRANSFERABLE CLAIM</footer>
    </article>
  );
}
