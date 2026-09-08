"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check, Menu, X } from "lucide-react";
import s from "./VellumExperience.module.css";

const notes = [
  { name: "Cash Cat", ticker: "CASHCAT", amount: "250,000", term: "90 days", image: "/tokens/cashcat.png", art: "/brand/vellum-card-cashcat.webp", color: "#9edab1", number: "001" },
  { name: "Wrapped Ether", ticker: "WETH", amount: "12.50", term: "30 days", image: "/tokens/weth.png", art: "/brand/vellum-card-weth.webp", color: "#91b9e8", number: "002" },
  { name: "Global Dollar", ticker: "USDG", amount: "10,000", term: "180 days", image: "/tokens/usdg.png", art: "/brand/vellum-card-usdg.webp", color: "#edc184", number: "003" },
];
const useCases = [
  { title: "OTC", heading: "A position.\nA different owner.", copy: "Transfer the note to another wallet. Its underlying balance and maturity stay attached, so both sides can read exactly what changes hands.", href: "/classes", label: "Read about OTC", state: "TRANSFERABLE" },
  { title: "Vesting", heading: "Time is part\nof the position.", copy: "Make a token allocation and its chosen horizon legible in one object. Ownership can move while the original term remains the same.", href: "/vesting", label: "Explore vesting", state: "TERM-VISIBLE" },
  { title: "Collateral", heading: "Know what\nyou are holding.", copy: "Bring a readable balance and maturity to your agreements. The note carries the position details that counterparties need to evaluate.", href: "/collateral", label: "Explore collateral", state: "READABLE" },
  { title: "Access", heading: "A little more\nthan a balance.", copy: "Use a position’s size and remaining duration to define access. A portable note makes those requirements easy to inspect.", href: "/gating", label: "Explore access", state: "PORTABLE" },
];
const steps = [
  { name: "Lock", copy: "Choose your asset, amount and term. Deposit the balance into a Vellum vault to form an immediately active bearer note.", detail: "ASSET + AMOUNT + TERM" },
  { name: "Carry", copy: "Keep the note, or transfer it to another wallet. Its amount and maturity stay attached as ownership changes.", detail: "ONE NOTE. ONE POSITION." },
  { name: "Claim", copy: "Claim immediately after mint, or carry the note for the selected term. The current bearer controls redemption.", detail: "MINT → CLAIMABLE" },
];
function Chapter({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`${s.chapter} ${light ? s.chapterLight : ""}`}><span /><p><i aria-hidden="true" />({children})</p><span /></div>;
}
export default function VellumExperience() {
  const root = useRef<HTMLElement>(null);
  const ownership = useRef<HTMLElement>(null);
  const process = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const currentCase = useCases[activeCase];
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveals = section.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.setAttribute("data-entered", "true"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        section.style.setProperty("--scroll", `${Math.min(window.scrollY, 950)}`);
        section.toggleAttribute("data-scrolled", window.scrollY > 80);
        const ownershipBox = ownership.current?.getBoundingClientRect();
        if (ownershipBox) {
          const distance = Math.max(ownershipBox.height - window.innerHeight, 1);
          const progress = Math.min(1, Math.max(0, -ownershipBox.top / distance));
          section.style.setProperty("--ownership-progress", progress.toFixed(3));
          setActiveCase(Math.min(3, Math.floor(progress * 4)));
        }
        const processBox = process.current?.getBoundingClientRect();
        if (processBox) {
          const distance = Math.max(processBox.height - window.innerHeight, 1);
          const progress = Math.min(1, Math.max(0, -processBox.top / distance));
          section.style.setProperty("--process-progress", progress.toFixed(3));
          setActiveStep(Math.min(2, Math.floor(progress * 3)));
        }
        frame = 0;
      });
    };
    if (!reduced.matches) {
      section.dataset.motion = "true";
    }
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  return <main className={s.experience} ref={root}>
    <a href="#about" className={s.skipLink}>Skip introduction</a>
    <header className={s.navigation}>
      <Link href="/" className={s.navBrand} aria-label="Vellum home"><span className={s.miniMark} aria-hidden="true"><Image src="/brand/vellum-mark.webp" alt="" width={32} height={32} /></span>VELLUM<sup>®</sup></Link>
      <nav className={s.navLinks} aria-label="Primary navigation"><a href="#positions">Positions</a><a href="#how">How it works</a><Link href="/docs">Docs</Link></nav>
      <a className={s.xLink} href="https://x.com/VellumRH" target="_blank" rel="noreferrer" aria-label="Vellum on X">𝕏</a>
      <Link href="/app" className={s.navCta}>Open app</Link>
      <button className={s.menuButton} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="vellum-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      {menuOpen && <nav id="vellum-menu" className={s.menuPanel} aria-label="Site navigation"><a href="#about" onClick={() => setMenuOpen(false)}>About Vellum</a><a href="#positions" onClick={() => setMenuOpen(false)}>Positions</a><a href="#how" onClick={() => setMenuOpen(false)}>How it works</a><Link href="/docs">Documentation</Link><a href="https://x.com/VellumRH" target="_blank" rel="noreferrer">X / Twitter</a><Link href="/app" className={s.menuCta}>Open app</Link></nav>}
    </header>
    <section className={s.hero} aria-labelledby="hero-title">
      <Image className={s.heroPoster} src="/brand/vellum-sky-hero.webp" alt="Translucent amber and emerald Vellum tickets suspended in a blue sky" fill priority sizes="100vw" quality={90} />
      <div className={s.heroShade} />
      <div className={s.heroCopy}><h1 id="hero-title">Hold the position.<br />Move the possibility.</h1><p>Your tokens. A visible term. One active note<br className={s.desktopBreak} /> you can hold, transfer or claim immediately.</p><div className={s.actions}><Link href="/app" className={s.primaryButton}>Open Vellum</Link><span className={`${s.glassButton} ${s.comingSoon}`}>CA COMING SOON</span></div></div>
      <div className={s.heroWord} aria-label="Vellum">VELLUM<sup>®</sup></div>
    </section>
    <section className={s.about} id="about">
      <Chapter>About Vellum</Chapter>
      <div className={s.aboutGrid}><div className={s.aboutAside} data-reveal><div className={s.smallArt}><Image src="/brand/vellum-glass-note.webp" alt="Sculptural emerald glass Vellum note" fill sizes="280px" /></div></div><div className={s.aboutBody}><p className={s.statement} data-reveal>A balance can stay in the vault.<br /><span>Its claim stays active.</span><br />Vellum turns a token position into a note you can carry. The asset, amount and selected term travel together. The current holder can claim whenever they choose.</p><div className={s.compatibility} data-reveal><Link href="/protocol"><span className={s.chainLogo}><Image src="/brand/robinhood-mark.png" alt="Robinhood" width={72} height={72} /></span><span>Robinhood Chain</span></Link><Link href="/notes"><strong>20<span>/</span>721</strong><span>Tokens into notes</span></Link><Link href="/ownership"><strong className={s.infinity}>∞</strong><span>Portable ownership</span></Link></div></div></div>
    </section>
    <section className={s.positions} id="positions">
      <Chapter>The instruments</Chapter>
      <div className={s.sectionHeading} data-reveal><h2>Positions.</h2><Link href="/notes" className={s.textLink}>Explore notes</Link></div>
      <div className={s.railMeta}><span>ANATOMY OF A NOTE / ILLUSTRATIVE POSITIONS</span></div>
      <div className={s.noteRail} aria-label="Example bearer notes" tabIndex={0}>{notes.map(note => <Link href="/app" className={s.note} key={note.ticker} style={{"--note-accent":note.color} as CSSProperties}><div className={s.noteHeader}><span>VELLUM / {note.number}</span></div><div className={s.noteVisual}><Image src={note.art} alt={`${note.name} glass coin`} fill sizes="(max-width:700px) 80vw, 400px" /></div><div className={s.noteIdentity}><h3>{note.name}</h3><span>{note.ticker}</span></div><strong className={s.noteAmount}>{note.amount}</strong><div className={s.noteFacts}><span>Selected term<b>{note.term}</b></span><span>Claim status<b>Active now</b></span></div><div className={s.noteBottom}><span>EXAMPLE POSITION</span><span>Make it yours</span></div></Link>)}</div>
    </section>
    <section className={s.ownership} id="ownership" ref={ownership}>
      <div className={s.ownershipSticky}><Image src="/brand/vellum-ownership-transfer.webp" alt="Emerald transfer filament connecting two glass portals" fill sizes="100vw" className={s.ownershipBackdrop} /><div className={s.ownershipShade} /><Chapter light>One note. Many possibilities.</Chapter><h2 className={s.ownershipTitle}>Ownership.</h2>
      <div className={s.useCaseStage} aria-live="polite"><div className={s.useCaseIntro} key={currentCase.title}><h3>{currentCase.heading}</h3><p>{currentCase.copy}</p><Link href={currentCase.href} className={s.glassButton}>{currentCase.label}</Link></div></div>
      <div className={s.scrollProgress} aria-hidden="true">{useCases.map((item,index)=><span key={item.title} data-active={index===activeCase} />)}</div></div>
    </section>
    <section className={s.principles}>
      <Chapter>In the details</Chapter><div className={s.sectionHeading} data-reveal><h2>Nothing<br />lost in transit.</h2><p>The useful part of a position<br />is the information it carries.</p></div>
      <div className={s.principleGrid}><article data-reveal style={{"--delay":"0ms"} as CSSProperties}><span className={s.eyebrow}>(01 — THE BALANCE)</span><h3>Same asset.<br />Same amount.</h3><p>The underlying tokens stay in the vault until the note is claimed.</p><div className={s.largeFact}>1:1</div><footer><Check size={15} /> One note represents one position</footer></article><article data-reveal style={{"--delay":"110ms"} as CSSProperties}><span className={s.eyebrow}>(02 — THE TERM)</span><h3>A date.<br />Not a barrier.</h3><p>The selected term stays attached to the position without delaying redemption.</p><div className={s.largeFact}>90<small>days*</small></div><footer><Check size={15} /> *Illustrative selected term</footer></article><article data-reveal style={{"--delay":"220ms"} as CSSProperties}><span className={s.eyebrow}>(03 — THE BEARER)</span><h3>Your note.<br />Your claim.</h3><p>The current holder can redeem the underlying balance immediately.</p><div className={s.largeFact}>NOW</div><footer><Check size={15} /> Claim active from mint</footer></article></div><div className={s.principleFoot}><Link href="/protocol">Explore the protocol</Link></div>
    </section>
    <section className={s.process} id="how" ref={process}>
      <div className={s.processSticky}><div className={s.processGrid}><div className={s.processCopy}><span className={s.processKicker}>THE PROCESS</span><h2>Make room<br />for what’s next.</h2><Link href="/how-it-works" className={s.processLink}>Read the mechanics</Link></div><div className={s.processLine} aria-hidden="true"><span /></div><div className={s.stepList}>{steps.map((step,index)=><article className={s.step} data-active={activeStep===index} key={step.name}><h3>{step.name}</h3><p>{step.copy}</p><small>{step.detail}</small></article>)}</div></div></div>
    </section>
    <footer className={s.footer}><div className={s.footerScene}><Image src="/brand/vellum-sky-hero.webp" alt="" fill sizes="100vw" /><div className={s.footerShade}/><div className={s.footerColumns}><nav aria-label="Footer"><span>MENU</span><a href="#hero-title">Home</a><Link href="/docs">Docs</Link><a href="#how">How it works</a><Link href="/app">Open app</Link></nav><nav aria-label="Social links"><span>SOCIAL</span><a href="https://x.com/VellumRH" target="_blank" rel="noreferrer">Twitter / X</a></nav></div><div className={s.footerMarquee} aria-label="Vellum"><div><span>VELLUM®</span><span>VELLUM®</span><span>VELLUM®</span></div></div></div></footer>
  </main>;
}
