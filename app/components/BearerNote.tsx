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
  return (
    <article className={`${styles.note} ${className}`} aria-label={`${name} bearer note`}>
      <Image className={styles.referenceImage} src="/brand/vellum-bearer-note-reference.png" alt={`${name} bearer note`} width={418} height={850} priority />
    </article>
  );
}
