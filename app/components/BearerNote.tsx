import Image from "next/image";
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
      <Image className={styles.referenceImage} src="/brand/vellum-bearer-note-v2.webp" alt={`${name} bearer note`} width={861} height={1827} priority />
      <span className={styles.portalLight} aria-hidden="true" />
      <span className={styles.cashcatMark}><TokenLogo symbol={symbol} color={color} /></span>
    </article>
  );
}
