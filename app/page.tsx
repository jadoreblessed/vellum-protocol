import Link from "next/link";
import Image from "next/image";
import CinematicHero from "./components/CinematicHero";
import PositionLab from "./components/PositionLab";
import ScrollClock from "./components/ScrollClock";
import TokenLogo from "./components/TokenLogo";
import styles from "./home.module.css";

const instruments = [
  { symbol: "$CASHCAT", name: "Cash Cat", color: "#147b43", amount: "250,000", value: "$30,150", pnl: "+38.6%", term: "90d", number: "000421" },
  { symbol: "$PONS", name: "Pons", color: "#315eea", amount: "1,200,000", value: "$43,836", pnl: "−11.3%", term: "30d", number: "000188" },
  { symbol: "$IF", name: "What IF", color: "#cf452f", amount: "4,000,000", value: "$45,320", pnl: "+85.7%", term: "365d", number: "000097" },
];

function InstrumentCard({ item, index }: { item: (typeof instruments)[number]; index: number }) {
  return (
    <Link href="/app/note" className={styles.instrument} style={{ "--token": item.color, "--delay": `${index * 120}ms` } as React.CSSProperties}>
      <div className={styles.instrumentTop}><span>VLM / {item.number}</span><span>{item.term} NOTE ↗</span></div>
      <div className={styles.instrumentToken}>
        <span className={styles.instrumentLogo}><TokenLogo symbol={item.symbol} color={item.color} /></span>
        <span><small>UNDERLYING</small><b>{item.symbol}</b><em>{item.name}</em></span>
      </div>
      <div className={styles.instrumentAmount}><small>POSITION</small><b>{item.amount}</b><span>{item.symbol.slice(1)}</span></div>
      <div className={styles.instrumentData}><span>MARK <b>{item.value}</b></span><span>PNL <b className={item.pnl.startsWith("+") ? styles.up : styles.down}>{item.pnl}</b></span></div>
      <div className={styles.instrumentLock}>LOCKED · CLAIM FOLLOWS HOLDER</div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <Link href="/" className={styles.wordmark}>vellum<span>.</span></Link>
        <nav><Link href="#market">Market</Link><Link href="#how">How it works</Link><Link href="/protocol">Protocol</Link><Link href="/docs">Docs</Link></nav>
        <Link href="/app" className={styles.launch}>Open app <span>↗</span></Link>
      </header>
      <CinematicHero />

      <section className={styles.signalRail} aria-label="Network status">
        <div><span className={styles.liveDot} /> Network live</div><div>18,421 block</div><div>$119.2m tracked</div><div>12s finality</div><div>ERC-20 → ERC-721</div>
      </section>

      <section className={styles.market} id="market">
        <div className={styles.sectionIntro}>
          <div><span className={styles.index}>01 / LIVE NOTES</span><h2>A market of positions,<br /><em>not promises.</em></h2></div>
          <div className={styles.introSide}><p>Every note is a readable onchain object with its amount, mark, maturity and current bearer attached.</p><Link href="/notes">Browse all notes ↗</Link></div>
        </div>
        <div className={styles.marketWorld}>
          <div className={styles.marketRidge} aria-hidden="true">
            <Image className={styles.marketLandscape} src="/brand/terminal-fibre-ridge-v2.webp" alt="" width={1536} height={864} />
          </div>
          <div className={styles.instrumentGrid}>{instruments.map((item, index) => <InstrumentCard item={item} index={index} key={item.symbol} />)}</div>
        </div>
      </section>

      <section className={styles.flow} id="how">
        <div className={styles.flowSticky}>
          <span className={styles.index}>02 / THE MECHANISM</span><h2>One deposit.<br />Two things<br /><em>can move.</em></h2>
          <p>The balance stays inside the vault. Its claim becomes a visible instrument you can carry, transfer or redeem.</p><Link href="/how-it-works">Read the full flow ↗</Link>
        </div>
        <div className={styles.flowSteps}>
          <article><span>01</span><div className={styles.stepGraphic}><i className={styles.coin} /><i className={styles.coin} /><i className={styles.coin} /></div><h3>Choose a position</h3><p>Select a supported token and the exact balance that should become portable.</p><small>TOKEN · AMOUNT</small></article>
          <article><span>02</span><div className={styles.vaultGraphic}><i /><b>250,000</b><small>VAULTED</small></div><h3>Seal the facts</h3><p>Vellum records quantity, entry mark, term and provenance in one note.</p><small>PRICE · TERM · OWNER</small></article>
          <article><span>03</span><div className={styles.transferGraphic}><i>WALLET A</i><b>→</b><i>WALLET B</i></div><h3>Move the claim</h3><p>Transfer the note. The underlying token balance remains untouched in the vault.</p><small>ERC-721 TRANSFER</small></article>
          <article><span>04</span><div className={styles.claimGraphic}><b>00</b><i>CLAIM OPEN</i></div><h3>Unwrap at maturity</h3><p>The bearer burns the note and releases the locked position to their wallet.</p><small>NOTE → POSITION</small></article>
        </div>
      </section>

      <PositionLab />

      <section className={styles.useCases}>
        <div className={styles.sectionIntro}>
          <div><span className={styles.index}>04 / USE CASES</span><h2>Built to carry<br /><em>real intent.</em></h2></div>
          <div className={styles.introSide}><p>One instrument standard, used wherever ownership and liquidity should not be the same thing.</p></div>
        </div>
        <div className={styles.caseGrid}>
          {[["OTC", "Move a position between parties without market impact.", "/classes"],["Vesting", "Make team allocations timed, public and transferable.", "/vesting"],["Collateral", "Lock a known balance with a visible maturity date.", "/collateral"],["Access", "Gate communities by size and remaining conviction.", "/gating"]].map(([title, copy, href], index) => <Link href={href} key={title} className={styles.case}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><b>Explore ↗</b><i>{title.slice(0, 1)}</i></Link>)}
        </div>
      </section>

      <ScrollClock />

      <section className={styles.docs}>
        <div className={styles.docsTop}><span className={styles.index}>06 / READ THE SYSTEM</span><h2>Nothing hidden.<br /><em>Every state legible.</em></h2><Link href="/docs">Open documentation ↗</Link></div>
        <div className={styles.docsLinks}>
          <Link href="/issuance"><span>01</span>Issuance<b>↗</b></Link><Link href="/ownership"><span>02</span>Ownership<b>↗</b></Link><Link href="/transfer"><span>03</span>Transfer<b>↗</b></Link><Link href="/claimable"><span>04</span>Claimable state<b>↗</b></Link><Link href="/security"><span>05</span>Guarantees<b>↗</b></Link><Link href="/faq"><span>06</span>FAQ<b>↗</b></Link>
        </div>
        <footer className={styles.footer}>
          <div><Link href="/" className={styles.wordmark}>vellum<span>.</span></Link><p>Portable positions for Robinhood Chain.</p></div>
          <div><span>PRODUCT</span><Link href="/app">App</Link><Link href="/notes">Notes</Link><Link href="/protocol">Protocol</Link></div>
          <div><span>LEARN</span><Link href="/how-it-works">How it works</Link><Link href="/docs">Docs</Link><Link href="/faq">FAQ</Link></div>
          <div><span>SOCIAL</span><a href="https://x.com/vellum" target="_blank" rel="noreferrer">X / Twitter ↗</a></div>
        </footer>
        <div className={styles.footerWord}>vellum</div>
      </section>
    </main>
  );
}
