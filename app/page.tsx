import Link from "next/link";
import Image from "next/image";
import CinematicHero from "./components/CinematicHero";
import PositionLab from "./components/PositionLab";
import ScrollClock from "./components/ScrollClock";
import ScrollReveal from "./components/ScrollReveal";
import TokenLogo from "./components/TokenLogo";
import TextReveal from "./components/TextReveal";
import styles from "./home.module.css";

const instruments = [
  { symbol: "$CASHCAT", name: "Cash Cat", color: "#147b43", amount: "250,000", value: "$30,150", pnl: "+38.6%", term: "90d", number: "000421" },
  { symbol: "$PONS", name: "Pons", color: "#315eea", amount: "1,200,000", value: "$43,836", pnl: "−11.3%", term: "30d", number: "000188" },
  { symbol: "$IF", name: "What IF", color: "#cf452f", amount: "4,000,000", value: "$45,320", pnl: "+85.7%", term: "365d", number: "000097" },
];

const useCases = [
  ["OTC", "Move a position between parties without market impact.", "/classes", "/brand/vellum-case-bond.png"],
  ["Vesting", "Make team allocations timed, public and transferable.", "/vesting", "/brand/vellum-case-folio.png"],
  ["Collateral", "Lock a known balance with a visible maturity date.", "/collateral", "/brand/vellum-case-vault.png"],
  ["Access", "Gate communities by size and remaining conviction.", "/gating", "/brand/vellum-case-arch.png"],
] as const;

function InstrumentCard({ item, index }: { item: (typeof instruments)[number]; index: number }) {
  return (
    <Link href="/app/note" className={styles.instrument} style={{ "--token": item.color, "--delay": `${index * 120}ms` } as React.CSSProperties}>
      <div className={styles.instrumentTop}><span>NOTE / {item.number}</span><span>VIEW ↗</span></div>
      <div className={styles.instrumentIdentity}>
        <span className={styles.instrumentLogo}><TokenLogo symbol={item.symbol} color={item.color} /></span>
        <div><small>UNDERLYING</small><b>{item.name}</b><em>{item.symbol}</em></div>
      </div>
      <div className={styles.instrumentBalance}><small>POSITION BALANCE</small><strong>{item.amount}</strong><span>{item.symbol.slice(1)}</span></div>
      <div className={styles.instrumentReadout}><span><small>MARK</small><b>{item.value}</b></span><span><small>TERM</small><b>{item.term}</b></span><span><small>P/L</small><b className={item.pnl.startsWith("+") ? styles.up : styles.down}>{item.pnl}</b></span></div>
      <div className={styles.instrumentRoute}><i /><span>CLAIM MOVES WITH HOLDER</span><b>SEALED</b></div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.nav} data-floating-nav>
        <Link href="/" className={styles.wordmark}>vellum<span>.</span></Link>
        <nav><Link href="#market">Market</Link><Link href="#how">How it works</Link><Link href="/protocol">Protocol</Link><Link href="/docs">Docs</Link></nav>
        <Link href="/app" className={styles.launch}>Open app <span>↗</span></Link>
      </header>
      <CinematicHero />

      <section className={styles.signalRail} aria-label="Network status">
        <div><span className={styles.liveDot} /> Network live</div><div>18,421 block</div><div>$119.2m tracked</div><div>12s finality</div><div>ERC-20 → ERC-721</div>
      </section>

      <section className={styles.market} id="market">
        <TextReveal className={styles.sectionIntro}>
          <div><span className={styles.index}>01 / LIVE NOTES</span><h2>A market of positions,<br /><em>not promises.</em></h2></div>
          <div className={styles.introSide}><p>Every note is a readable onchain object with its amount, mark, maturity and current bearer attached.</p><Link href="/notes">Browse all notes ↗</Link></div>
        </TextReveal>
        <div className={styles.marketWorld}>
          <div className={styles.marketLandscapeStrip} aria-hidden="true">
            <Image src="/brand/vellum-fibre-valley-v1.webp" alt="" width={1440} height={960} priority />
          </div>
          <ScrollReveal className={styles.marketCards}>
            <div className={styles.instrumentGrid}>{instruments.map((item, index) => <InstrumentCard item={item} index={index} key={item.symbol} />)}</div>
          </ScrollReveal>
        </div>
      </section>

      <section className={styles.flow} id="how">
        <TextReveal className={styles.flowSticky}>
          <span className={styles.index}>02 / THE MECHANISM</span><h2>One deposit.<br />Two things<br /><em>can move.</em></h2>
          <p>The balance stays inside the vault. Its claim becomes a visible instrument you can carry, transfer or redeem.</p><Link href="/how-it-works">Read the full flow ↗</Link>
        </TextReveal>
        <ScrollReveal className={styles.flowSteps}>
          <article><span>01</span><div className={styles.stepGraphic}><i className={styles.coin} /><i className={styles.coin} /><i className={styles.coin} /></div><h3>Lock</h3><p>Send a supported balance into custody with a term that everyone can read.</p><small>TOKEN · AMOUNT</small></article>
          <article><span>02</span><h3>Carry</h3><p>Vellum forms one instrument from the position, maturity and owner route.</p><small>POSITION · TERM</small></article>
          <article><span>03</span><div className={styles.transferGraphic}><div className={styles.transferEndpoint}><small>FROM</small><strong>WALLET A</strong><em>0x020b...18B4</em></div><div className={styles.transferRoute}><span /><em>CLAIM</em><span /></div><div className={styles.transferEndpoint}><small>TO</small><strong>WALLET B</strong><em>0x14a8...72C1</em></div></div><h3>Claim</h3><p>Move the note, then unwrap the same position at the agreed maturity.</p><small>NOTE → POSITION</small></article>
        </ScrollReveal>
      </section>

      <PositionLab />

      <section className={styles.useCases}>
        <TextReveal className={styles.sectionIntro}>
          <div><span className={styles.index}>04 / USE CASES</span><h2>Built to carry<br /><em>real intent.</em></h2></div>
          <div className={styles.introSide}><p>One instrument standard, used wherever ownership and liquidity should not be the same thing.</p></div>
        </TextReveal>
        <ScrollReveal className={styles.caseGrid}>
          {useCases.map(([title, copy, href, image], index) => <Link href={href} key={title} className={styles.case}><Image className={styles.caseImage} src={image} alt="" width={1254} height={1254} /><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><b>Explore <i>↗</i></b></Link>)}
        </ScrollReveal>
      </section>

      <section className={styles.sceneStories}>
        <article className={styles.sceneStory}>
          <Image className={styles.sceneImage} src="/brand/vellum-moon-valley.png" alt="A Vellum fibre landscape" width={1536} height={1024} />
          <TextReveal className={styles.sceneStoryCopy}>
            <span>01 / CUSTODY</span>
            <h2>Hold the balance.<br /><em>Move the right.</em></h2>
            <p>The position remains protected in custody while its bearer note travels onchain.</p>
            <Link href="/ownership">See ownership ↗</Link>
          </TextReveal>
          <div className={styles.sceneReadout}><span>POSITION</span><b>250,000</b><small>CASHCAT · IN CUSTODY</small></div>
        </article>
        <article className={`${styles.sceneStory} ${styles.sceneStoryReverse}`}>
          <Image className={styles.sceneImage} src="/brand/vellum-column-mark.png" alt="A Vellum material landmark" width={1536} height={1024} />
          <TextReveal className={styles.sceneStoryCopy} delay={90}>
            <span>02 / TERM</span>
            <h2>Keep every<br /><em>fact intact.</em></h2>
            <p>Amount, term and provenance are bound into the same readable object from day one.</p>
            <Link href="/how-it-works">Read the lifecycle ↗</Link>
          </TextReveal>
          <div className={styles.sceneReadout}><span>MATURITY</span><b>90 DAYS</b><small>IMMUTABLE · VERIFIED</small></div>
        </article>
      </section>

      <section className={styles.anatomy}>
        <TextReveal className={styles.anatomyHead}><div><h2>Position anatomy.</h2></div><p>One readable object. Four facts that remain attached through the full lifecycle.</p></TextReveal>
        <ScrollReveal className={styles.anatomyBoard}>
          <div className={styles.anatomyOrb}><i /><i /><span className={styles.anatomyTicket}><Image src="/brand/vellum-anatomy-ticket-v2.webp" alt="A Vellum bearer note" width={1024} height={1536} /></span></div>
          <div className={styles.anatomySignals} aria-hidden="true"><span>VLM / 000421</span><span>BEARER NOTE · VERIFIED</span></div>
          <div className={styles.anatomyRows}>
            <div><span>01</span><b>Underlying balance</b><em>250,000 CASHCAT</em></div>
            <div><span>02</span><b>Term</b><em>90 days · sealed</em></div>
            <div><span>03</span><b>Bearer ownership</b><em>0x020b...18B4</em></div>
            <div><span>04</span><b>Claim state</b><em>Unlocks at maturity</em></div>
          </div>
        </ScrollReveal>
      </section>

      <ScrollClock />

      <section className={styles.docs}>
        <TextReveal className={styles.docsTop}><span className={styles.index}>06 / READ THE SYSTEM</span><h2>Nothing hidden.<br /><em>Every state legible.</em></h2><Link href="/docs">Open documentation ↗</Link></TextReveal>
        <ScrollReveal className={styles.docsLinks}>
          <Link href="/issuance"><span>01</span>Issuance<b>↗</b></Link><Link href="/ownership"><span>02</span>Ownership<b>↗</b></Link><Link href="/transfer"><span>03</span>Transfer<b>↗</b></Link><Link href="/claimable"><span>04</span>Claimable state<b>↗</b></Link><Link href="/security"><span>05</span>Guarantees<b>↗</b></Link><Link href="/faq"><span>06</span>FAQ<b>↗</b></Link>
        </ScrollReveal>
        <TextReveal as="footer" className={styles.footer}>
          <div><Link href="/" className={styles.wordmark}>vellum<span>.</span></Link><p>Portable positions for Robinhood Chain.</p></div>
          <div><span>PRODUCT</span><Link href="/app">App</Link><Link href="/notes">Notes</Link><Link href="/protocol">Protocol</Link></div>
          <div><span>LEARN</span><Link href="/how-it-works">How it works</Link><Link href="/docs">Docs</Link><Link href="/faq">FAQ</Link></div>
          <div><span>SOCIAL</span><a href="https://x.com/vellum" target="_blank" rel="noreferrer">X / Twitter ↗</a></div>
        </TextReveal>
        <div className={styles.footerWord}>vellum</div>
        <div className={styles.footerRidge} aria-hidden="true"><Image src="/brand/terminal-fibre-ridge-v2.webp" alt="" width={1536} height={864} /></div>
      </section>
    </main>
  );
}
