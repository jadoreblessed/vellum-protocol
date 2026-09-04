import Image from "next/image";
import Link from "next/link";
import CinematicHero from "./components/CinematicHero";
import TokenLogo from "./components/TokenLogo";
import styles from "./home.module.css";
import readable from "./components/MarketReadability.module.css";
import header from "./components/HeaderPerformance.module.css";
import surface from "./components/SurfaceRefinement.module.css";
import market from "./components/MarketScene.module.css";

const instruments = [
  { symbol: "$CASHCAT", name: "Cash Cat", color: "#147b43", amount: "250,000", value: "$30,150", pnl: "+38.6%", term: "90d", number: "000421" },
  { symbol: "$PONS", name: "Pons", color: "#315eea", amount: "1,200,000", value: "$43,836", pnl: "−11.3%", term: "30d", number: "000188" },
  { symbol: "$IF", name: "What IF", color: "#cf452f", amount: "4,000,000", value: "$45,320", pnl: "+85.7%", term: "365d", number: "000097" },
];

const useCases = [
  ["OTC", "Move a position without touching the market.", "/classes"],
  ["Vesting", "Make allocations timed and transferable.", "/vesting"],
  ["Collateral", "Lock a balance against a visible term.", "/collateral"],
  ["Access", "Gate by balance and remaining duration.", "/gating"],
] as const;

function InstrumentCard({ item }: { item: (typeof instruments)[number] }) {
  return (
    <Link href="/app/note" className={`${styles.instrument} ${readable.card} ${market.card}`} style={{ "--token": item.color } as React.CSSProperties}>
      <div className={`${styles.instrumentTop} ${readable.top}`}><span>NOTE / {item.number}</span></div>
      <div className={`${styles.instrumentIdentity} ${readable.identity}`}>
        <span className={styles.instrumentLogo}><TokenLogo symbol={item.symbol} color={item.color} /></span>
        <div><small>UNDERLYING</small><b>{item.name}</b><em>{item.symbol}</em></div>
      </div>
      <div className={`${styles.instrumentBalance} ${readable.balance}`}><small>POSITION BALANCE</small><strong>{item.amount}</strong><span>{item.symbol.slice(1)}</span></div>
      <div className={`${styles.instrumentReadout} ${readable.readout}`}><span><small>MARK</small><b>{item.value}</b></span><span><small>TERM</small><b>{item.term}</b></span><span><small>P/L</small><b className={item.pnl.startsWith("+") ? styles.up : styles.down}>{item.pnl}</b></span></div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className={`${styles.page} ${surface.home}`}>
      <header className={`${styles.nav} ${header.nav}`} data-floating-nav>
        <Link href="/" className={styles.wordmark}>vellum<span>.</span></Link>
        <nav><Link href="#market">Market</Link><Link href="/how-it-works">How it works</Link><Link href="/protocol">Protocol</Link><Link href="/docs">Docs</Link></nav>
        <Link href="/app" className={styles.launch}>Open app</Link>
      </header>
      <CinematicHero />

      <section className={`${styles.market} ${market.root}`} id="market">
        <div className={styles.sectionIntro}>
          <div><span className={styles.index}>01 / LIVE NOTES</span><h2>A market of positions,<br /><em>not promises.</em></h2></div>
          <div className={styles.introSide}><p>Amount, mark, maturity and bearer stay attached to every note.</p><Link href="/notes">Browse notes</Link></div>
        </div>
        <div className={`${styles.marketWorld} ${market.world}`}>
          <div className={`${styles.marketLandscapeStrip} ${market.landscape}`} aria-hidden="true">
            <Image src="/brand/vellum-fibre-valley-v1.webp" alt="" width={1440} height={960} priority quality={100} sizes="(max-width: 900px) 100vw, 1220px" />
          </div>
          <div className={`${styles.marketCards} ${market.cards}`}>
            <div className={`${styles.instrumentGrid} ${market.grid}`}>{instruments.map((item) => <InstrumentCard item={item} key={item.symbol} />)}</div>
          </div>
        </div>
      </section>

      <section className={styles.useCases}>
        <div className={styles.sectionIntro}>
          <div><span className={styles.index}>02 / USE CASES</span><h2>Built to carry<br /><em>real intent.</em></h2></div>
        </div>
        <div className={`${styles.caseGrid} ${styles.caseList}`}>
          {useCases.map(([title, copy, href], index) => <Link href={href} key={title} className={styles.case}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><b>Explore</b></Link>)}
        </div>
      </section>

      <section className={styles.anatomy}>
        <div className={styles.anatomyHead}><div><h2>Position anatomy.</h2></div><p>Four facts stay attached through the full lifecycle.</p></div>
        <div className={`${styles.anatomyBoard} ${styles.anatomyOriginal}`}>
          <div className={styles.anatomyOrb}><span className={styles.anatomyTicket}><Image src="/brand/vellum-anatomy-ticket-v2.webp" alt="A Vellum bearer note" width={1024} height={1536} /></span></div>
          <div className={styles.anatomyRows}>
            <div><span>01</span><b>Underlying</b><em>250,000 CASHCAT</em></div>
            <div><span>02</span><b>Term</b><em>90 days</em></div>
            <div><span>03</span><b>Bearer</b><em>0x020b...18B4</em></div>
            <div><span>04</span><b>State</b><em>Claimable at maturity</em></div>
          </div>
        </div>
      </section>

      <section className={`${styles.docs} ${styles.footerOnly}`}>
        <footer className={styles.footer}>
          <div><Link href="/" className={styles.wordmark}>vellum<span>.</span></Link><p>Portable positions for Robinhood Chain.</p></div>
          <div><span>PRODUCT</span><Link href="/app">App</Link><Link href="/notes">Notes</Link><Link href="/protocol">Protocol</Link></div>
          <div><span>LEARN</span><Link href="/how-it-works">How it works</Link><Link href="/docs">Docs</Link><Link href="/faq">FAQ</Link></div>
          <div><span>SOCIAL</span><a href="https://x.com/VellumRH" target="_blank" rel="noreferrer">X / VellumRH</a></div>
        </footer>
        <div className={styles.footerWord}>vellum</div>
        <div className={styles.footerRidge} aria-hidden="true"><Image src="/brand/terminal-fibre-ridge-v2.webp" alt="" width={1672} height={941} quality={100} sizes="100vw" /></div>
      </section>
    </main>
  );
}
