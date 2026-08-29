import Link from "next/link";

const notes = [
  { symbol: "$ORBIT", name: "Orbit", color: "#146b58", amount: "250,000", pnl: "+38.6%", term: "90 DAYS" },
  { symbol: "$MOTE", name: "Mote", color: "#d05b2d", amount: "1,200,000", pnl: "−11.3%", term: "30 DAYS" },
  { symbol: "$INDEX", name: "Index", color: "#5d49c8", amount: "4,000,000", pnl: "+85.7%", term: "365 DAYS" },
];

function NoteCard({ note, compact = false }: { note: typeof notes[number]; compact?: boolean }) {
  return <article className={compact ? "mini-note" : "note"}>
    <div className="note-top"><strong>vellum</strong><span>BEARER NOTE · ERC-721</span><b>W/ 000421</b></div>
    <div className="note-band" style={{background: note.color}}><div className="token-icon">◈</div><div><div className="token-symbol">{note.symbol}</div><div>{note.name}</div><div className="token-meta">VELLUM NETWORK</div></div></div>
    <div className="note-body"><div className="label">Position</div><div className="position">{note.amount} <small>{note.symbol.slice(1)}</small></div><div className="label">≈ $30,150 &nbsp; at mark</div>
      <div className="note-stats"><div className="stat"><div className="label">Entry</div><b>$0.0870</b></div><div className="stat"><div className="label">Mark</div><b>$0.1206</b></div><div className="stat"><div className="label">PnL</div><b className={note.pnl.startsWith("+") ? "positive" : ""}>{note.pnl}</b></div></div>
      <div className="lock-band">⌗ &nbsp; LOCKED UNTIL 04 NOV 2026</div>
      <div className="note-details"><div><div className="label">Supply share</div><b>0.03%</b></div><div><div className="label">Term</div><b>{note.term}</b></div><div><div className="label">Deposit date</div><b>06 AUG 2026</b></div><div><div className="label">Unlock</div><b>04 NOV 2026</b></div></div>
    </div>
    {!compact && <div className="note-foot"><span>PAYABLE TO BEARER</span><span>0x9c4e...7a21</span></div>}
  </article>;
}

export default function Home() {
  return <main>
    <header className="nav"><div className="container nav-inner"><Link href="/" className="wordmark">vellum</Link><nav className="nav-links"><a href="#how"><span>01</span>How it works</a><a href="#notes"><span>02</span>Notes</a><a href="#protocol"><span>03</span>Protocol</a><a href="#docs"><span>04</span>Docs</a></nav><Link className="button acid" href="/app">Launch App</Link></div></header>
    <section className="hero container grid-bg"><div><div className="eyebrow mono">BEARER POSITIONS · VELLUM NETWORK</div><h1>Make any token <em>holdable.</em></h1><p className="hero-copy">Lock an ERC-20 position in a deterministic vault and receive a transferable note carrying the position. Pass the note on without moving the underlying tokens.</p><div className="hero-actions"><Link className="button acid" href="/app">Create a note →</Link><a className="button" href="#how">How it works</a></div><div className="fine mono">NO FEES · NO ADMINS · AUDITABLE BY DEFAULT</div></div><div className="note-wrap"><NoteCard note={notes[0]} /></div></section>
    <section id="how" className="section container"><div className="section-head"><div><div className="eyebrow mono">01 / ISSUANCE</div><h2 className="section-title">The token stays.<em>The note travels.</em></h2></div><p className="section-intro">Vellum separates ownership from the chart. The underlying position stays inside an immutable vault while its claim becomes a portable instrument.</p></div><div className="steps">{[["01","Deposit","Tokens enter a vault. The contract records the amount that actually arrived."],["02","Issue","Vellum prints one ERC-721 note with amount, entry, term and provenance."],["03","Transfer","The note moves between wallets. The underlying position never does."],["04","Claim","At maturity, the holder can unwrap the position back to the wallet."]].map(([n,t,p])=><div className="step" key={n}><div className="step-num">{n}</div><h3>{t}</h3><p>{p}</p></div>)}</div></section>
    <div className="ticker"><div className="ticker-track">PAYABLE TO BEARER · ISSUED ONCHAIN · TRANSFERABLE · IMMUTABLE · &nbsp; PAYABLE TO BEARER · ISSUED ONCHAIN · TRANSFERABLE · IMMUTABLE · &nbsp;</div></div>
    <section id="notes" className="section container"><div className="section-head"><div><div className="eyebrow mono">02 / NOTEBOOK</div><h2 className="section-title">One position.<em>Many ways to carry it.</em></h2></div><p className="section-intro">A note keeps the facts that matter visible: quantity, entry, mark, PnL, unlock date and the wallet that can claim it.</p></div><div className="notes-grid">{notes.map(note=><NoteCard key={note.symbol} note={note} compact />)}</div></section>
    <section id="protocol" className="section container"><div className="protocol"><div><div className="eyebrow mono">03 / PROTOCOL</div><h2 className="section-title">No owner.<em>No pause.</em></h2><p className="section-intro">The contract is the custodian. Three public functions make the lifecycle legible and verifiable.</p></div><div className="protocol-list">{[["wrap(token, amount, term)","Deposit, price and mint one note."],["transfer(noteId)","Move the claim without selling the position."],["unwrap(noteId)","Burn the note and release the underlying tokens."]].map(([a,b])=><div className="protocol-row" key={a}><b>{a}</b><span>{b}</span></div>)}<div className="fine mono" style={{paddingTop:24}}>REBASING TOKENS ARE NOT SUPPORTED.</div></div></div></section>
    <section id="docs" className="section dark"><div className="container"><div className="section-head"><div><div className="eyebrow mono">04 / DOCUMENTATION</div><h2 className="section-title">Turn a position <em>into an instrument.</em></h2></div><p className="section-intro">Read the protocol, inspect the note standard and understand the lifecycle before connecting a wallet.</p></div><Link className="button acid" href="/app">Enter the app →</Link><footer className="footer" style={{marginTop:100}}><span className="mono">VELLUM PROTOCOL</span><span className="mono">ROBINHOOD NETWORK · ERC-721</span></footer></div></section>
  </main>;
}
