import Link from "next/link";
import ScrollReveal from "./components/ScrollReveal";

const notes = [
  { symbol: "$ORBIT", name: "Orbit", color: "#176b57", amount: "250,000", pnl: "+38.6%", term: "90 DAYS" },
  { symbol: "$MOTE", name: "Mote", color: "#d15d35", amount: "1,200,000", pnl: "−11.3%", term: "30 DAYS" },
  { symbol: "$INDEX", name: "Index", color: "#5d49c8", amount: "4,000,000", pnl: "+85.7%", term: "365 DAYS" },
];

function NoteCard({ note, compact = false }: { note: typeof notes[number]; compact?: boolean }) {
  return <article className={compact ? "mini-note" : "note"}>
    <div className="note-top"><strong>vellum</strong><span>BEARER NOTE · ERC-721</span><b>W/ 000421</b></div>
    <div className="note-band" style={{ background: note.color }}><div className="token-icon">◈</div><div><div className="token-symbol">{note.symbol}</div><div>{note.name}</div><div className="token-meta">VELLUM NETWORK</div></div></div>
    <div className="note-body"><div className="label">Position</div><div className="position">{note.amount} <small>{note.symbol.slice(1)}</small></div><div className="label">≈ $30,150 &nbsp; at mark</div>
      <div className="note-stats"><div className="stat"><div className="label">Entry</div><b>$0.0870</b></div><div className="stat"><div className="label">Mark</div><b>$0.1206</b></div><div className="stat"><div className="label">PnL</div><b className={note.pnl.startsWith("+") ? "positive" : ""}>{note.pnl}</b></div></div>
      <div className="lock-band">⌗ &nbsp; LOCKED UNTIL 04 NOV 2026</div>
      <div className="note-details"><div><div className="label">Supply share</div><b>0.03%</b></div><div><div className="label">Term</div><b>{note.term}</b></div><div><div className="label">Deposit date</div><b>06 AUG 2026</b></div><div><div className="label">Unlock</div><b>04 NOV 2026</b></div></div>
    </div>
    {!compact && <div className="note-foot"><span>PAYABLE TO BEARER</span><span>0x9c4e...7a21</span></div>}
  </article>;
}

function HeroScene() {
  return <section className="hero-v2">
    <video className="hero-v2-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/hero-motion.mp4" type="video/mp4" /></video>
    <div className="hero-v2-grid" aria-hidden="true" />
    <div className="hero-v2-ribbon ribbon-one" aria-hidden="true" /><div className="hero-v2-ribbon ribbon-two" aria-hidden="true" />
    <div className="hero-v2-orbit orbit-one" aria-hidden="true" /><div className="hero-v2-orbit orbit-two" aria-hidden="true" />
    <div className="hero-v2-content">
      <div className="hero-v2-copy">
        <div className="eyebrow mono hero-reveal">BEARER POSITIONS · VELLUM NETWORK</div>
        <h1 className="hero-v2-title hero-reveal delay-one">Make any token <em>holdable.</em></h1>
        <p className="hero-v2-description hero-reveal delay-two">A living position deserves a document. Lock the balance, carry the claim, and let the facts travel with it.</p>
        <div className="hero-actions hero-reveal delay-three"><Link className="button acid" href="/app">Create a note <span>↗</span></Link><Link className="button" href="/how-it-works">See the flow</Link></div>
        <div className="hero-v2-meta mono hero-reveal delay-three"><span>01 / WRAP</span><span>02 / CARRY</span><span>03 / UNWRAP</span></div>
      </div>
      <div className="hero-v2-art" aria-label="Animated Vellum bearer note preview">
        <div className="hero-v2-token token-float token-float-one"><span>ERC-20</span><b>ORBIT</b><small>250,000</small></div>
        <div className="hero-v2-token token-float token-float-two"><span>NOTE / 000421</span><b>90 DAYS</b><small>TRANSFERABLE</small></div>
        <div className="hero-note-shadow" /><div className="hero-note-card"><NoteCard note={notes[0]} /></div>
        <div className="hero-v2-caption mono"><span>LIVE INSTRUMENT</span><span>VLM / 001</span></div>
      </div>
    </div>
    <div className="hero-v2-scroll mono">SCROLL TO TRACE THE POSITION <span>↓</span></div>
  </section>;
}

export default function Home() {
  return <main>
    <header className="nav"><div className="container nav-inner"><Link href="/" className="wordmark">vellum</Link><nav className="nav-links"><Link href="/how-it-works"><span>01</span>How it works</Link><Link href="/notes"><span>02</span>Notes</Link><Link href="/protocol"><span>03</span>Protocol</Link><Link href="/docs"><span>04</span>Docs</Link></nav><Link className="button acid" href="/app">Launch App</Link></div></header>
    <HeroScene />
    <ScrollReveal><section id="how" className="section container"><div className="section-head"><div><div className="eyebrow mono">01 / ISSUANCE</div><h2 className="section-title">The token stays.<em>The note travels.</em></h2></div><p className="section-intro">Vellum separates ownership from the chart. The underlying position stays inside an immutable vault while its claim becomes a portable instrument.</p></div><div className="steps">{[["01","Deposit","Tokens enter a vault. The contract records the amount that actually arrived."],["02","Issue","Vellum prints one ERC-721 note with amount, entry, term and provenance."],["03","Transfer","The note moves between wallets. The underlying position never does."],["04","Claim","At maturity, the holder can unwrap the position back to the wallet."]].map(([n,t,p])=><div className="step" key={n}><div className="step-num">{n}</div><h3>{t}</h3><p>{p}</p></div>)}</div></section></ScrollReveal>
    <ScrollReveal><section className="trace-section"><div className="container trace-layout"><div className="trace-copy"><div className="eyebrow mono">02 / OWNERSHIP</div><h2 className="section-title">The position changed hands.<em>The balance did not.</em></h2><p className="section-intro">A Vellum note is the moving part. Wallet A can pass the claim to Wallet B while the vault continues to hold the same underlying tokens.</p></div><div className="ownership-map"><div className="wallet-node"><span className="mono">WALLET A</span><b>0xA1...FA3D</b></div><div className="map-line"><i /><span className="mono">ERC-721 TRANSFER</span><i /></div><div className="wallet-node active"><span className="mono">WALLET B</span><b>0x7C...91BE</b></div><div className="vault-node"><span className="mono">UNDERLYING VAULT</span><b>250,000 ORBIT</b><small>UNCHANGED</small></div></div></div></section></ScrollReveal>
    <div className="ticker"><div className="ticker-track">PAYABLE TO BEARER · ISSUED ONCHAIN · TRANSFERABLE · IMMUTABLE · &nbsp; PAYABLE TO BEARER · ISSUED ONCHAIN · TRANSFERABLE · IMMUTABLE · &nbsp;</div></div>
    <ScrollReveal><section id="notes" className="section container"><div className="section-head"><div><div className="eyebrow mono">03 / NOTEBOOK</div><h2 className="section-title">One position.<em>Many ways to carry it.</em></h2></div><p className="section-intro">A note keeps the facts that matter visible: quantity, entry, mark, PnL, unlock date and the wallet that can claim it.</p></div><div className="notes-grid">{notes.map(note=><NoteCard key={note.symbol} note={note} compact />)}</div></section></ScrollReveal>
    <ScrollReveal><section className="maturity-scene"><div className="container maturity-inner"><div><div className="eyebrow mono">04 / MATURITY</div><h2 className="section-title">Locked now.<em>Claimable later.</em></h2><p className="section-intro">The clock is part of the instrument. It can move, but it cannot be rewritten.</p></div><div className="countdown-art"><div className="countdown-number">90</div><div className="mono">DAYS REMAINING</div><div className="countdown-line"><span /><b>06 AUG 2026</b><b>04 NOV 2026</b></div></div></div></section></ScrollReveal>
    <ScrollReveal><section id="protocol" className="section container"><div className="protocol"><div><div className="eyebrow mono">05 / PROTOCOL</div><h2 className="section-title">No owner.<em>No pause.</em></h2><p className="section-intro">The contract is the custodian. Three public functions make the lifecycle legible and verifiable.</p></div><div className="protocol-list">{[["wrap(token, amount, term)","Deposit, price and mint one note."],["transfer(noteId)","Move the claim without selling the position."],["unwrap(noteId)","Burn the note and release the underlying tokens."]].map(([a,b])=><div className="protocol-row" key={a}><b>{a}</b><span>{b}</span></div>)}</div></div></section></ScrollReveal>
    <section id="docs" className="section dark"><div className="container"><div className="section-head"><div><div className="eyebrow mono">06 / DOCUMENTATION</div><h2 className="section-title">Turn a position <em>into an instrument.</em></h2></div><p className="section-intro">Read the protocol, inspect the note standard and understand the lifecycle before connecting a wallet.</p></div><div className="hero-links"><Link href="/issuance">Issuance</Link><Link href="/ownership">Ownership</Link><Link href="/classes">Instrument classes</Link><Link href="/maturity">Maturity</Link><Link href="/claimable">Claimable state</Link><Link href="/security">Guarantees</Link></div><Link className="button acid" href="/app">Enter the app →</Link><footer className="footer" style={{marginTop:100}}><span className="mono">VELLUM PROTOCOL</span><span className="mono">ROBINHOOD NETWORK · ERC-721</span></footer></div></section>
  </main>;
}
