"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Pause, Play, X } from "lucide-react";
import s from "./VellumExperience.module.css";

const notes = [
  { name: "Cash Cat", ticker: "CASHCAT", amount: "250,000", term: "90 days", image: "/tokens/cashcat.png", color: "#9edab1", number: "001" },
  { name: "Wrapped Ether", ticker: "WETH", amount: "12.50", term: "30 days", image: "/tokens/weth.png", color: "#91b9e8", number: "002" },
  { name: "Global Dollar", ticker: "USDG", amount: "10,000", term: "180 days", image: "/tokens/usdg.png", color: "#edc184", number: "003" },
];
const useCases = [
  { title: "OTC", heading: "A position.\nA different owner.", copy: "Transfer the note to another wallet. Its underlying balance and maturity stay attached, so both sides can read exactly what changes hands.", href: "/classes", label: "Read about OTC", state: "TRANSFERABLE", foot: "The right moves with the note." },
  { title: "Vesting", heading: "Time is part\nof the position.", copy: "Make a token allocation and its term legible in one object. Ownership can move while the original maturity remains the same.", href: "/vesting", label: "Explore vesting", state: "TIME-LOCKED", foot: "One allocation. A visible term." },
  { title: "Collateral", heading: "Know what\nyou are holding.", copy: "Bring a readable balance and maturity to your agreements. The note carries the position details that counterparties need to evaluate.", href: "/collateral", label: "Explore collateral", state: "READABLE", foot: "Amount, asset and term. Together." },
  { title: "Access", heading: "A little more\nthan a balance.", copy: "Use a position’s size and remaining duration to define access. A portable note makes those requirements easy to inspect.", href: "/gating", label: "Explore access", state: "PORTABLE", foot: "Ownership with context." },
];
const steps = [
  { name: "Lock", copy: "Choose your asset, amount and lock term. Deposit the balance into a Vellum vault to form a bearer note.", detail: "ASSET + AMOUNT + TERM" },
  { name: "Carry", copy: "Keep the note, or transfer it to another wallet. Its amount and maturity stay attached as ownership changes.", detail: "ONE NOTE. ONE POSITION." },
  { name: "Claim", copy: "When the term ends, the current bearer can redeem the underlying balance through the vault.", detail: "MATURITY → REDEMPTION" },
];
function Chapter({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`${s.chapter} ${light ? s.chapterLight : ""}`}><span /><p><i aria-hidden="true" />({children})</p><span /></div>;
}
export default function VellumExperience() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const noteRail = useRef<HTMLDivElement>(null);
  const videoPausedByUser = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
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
        frame = 0;
      });
    };
    if (!reduced.matches) {
      section.dataset.motion = "true";
      void video.current?.play().catch(() => setPlaying(false));
      window.addEventListener("scroll", scroll, { passive: true });
      scroll();
    }
    const media = video.current;
    const heroObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) media?.pause();
      else if (!reduced.matches && !videoPausedByUser.current && !document.hidden) void media?.play().catch(() => setPlaying(false));
    }, { threshold: 0.05 });
    if (media) heroObserver.observe(media);
    const visibility = () => {
      if (document.hidden) media?.pause();
      else if (!reduced.matches && !videoPausedByUser.current && (media?.getBoundingClientRect().bottom ?? 0) > 0) void media?.play().catch(() => setPlaying(false));
    };
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); heroObserver.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  function toggleVideo() {
    if (!video.current) return;
    videoPausedByUser.current = !video.current.paused;
    if (video.current.paused) void video.current.play().catch(() => setPlaying(false));
    else video.current.pause();
  }

  return <main className={s.experience} ref={root}>
    <a href="#about" className={s.skipLink}>Skip introduction</a>
    <header className={s.navigation}>
      <Link href="/" className={s.navBrand} aria-label="Vellum home"><span className={s.miniMark} aria-hidden="true">v</span>VELLUM<sup>®</sup></Link>
      <div className={s.navLinks}><a href="#positions">Positions</a><Link href="/docs">Docs</Link><Link href="/app">Open app <ArrowUpRight size={14} /></Link></div>
      <button className={s.menuButton} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="vellum-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      {menuOpen && <nav id="vellum-menu" className={s.menuPanel} aria-label="Site navigation"><a href="#about" onClick={() => setMenuOpen(false)}>About Vellum <ArrowUpRight /></a><a href="#positions" onClick={() => setMenuOpen(false)}>Positions <ArrowUpRight /></a><a href="#how" onClick={() => setMenuOpen(false)}>How it works <ArrowUpRight /></a><Link href="/docs">Documentation <ArrowUpRight /></Link><Link href="/app" className={s.menuCta}>Open app <ArrowUpRight /></Link></nav>}
    </header>
    <section className={s.hero} aria-labelledby="hero-title">
      <Image className={s.heroPoster} src="/brand/vellum-sky-hero.webp" alt="Translucent amber and emerald Vellum tickets suspended in a blue sky" fill priority sizes="100vw" quality={90} />
      {!videoFailed && <video ref={video} className={s.heroVideo} poster="/brand/vellum-sky-hero.webp" muted loop playsInline preload="none" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setVideoFailed(true)}><source src="/brand/vellum-sky-loop.mp4" type="video/mp4" /></video>}
      <div className={s.heroShade} />
      <div className={s.heroTop}><span>POSITIONS, SET FREE.</span><span>BUILT ON ROBINHOOD CHAIN</span></div>
      <div className={s.heroCopy}><h1 id="hero-title">Hold the position.<br />Move the possibility.</h1><p>Your tokens. A visible term. One note<br className={s.desktopBreak} /> you can hold, transfer and redeem.</p><div className={s.actions}><Link href="/app" className={s.primaryButton}>Open Vellum <ArrowUpRight size={18} /></Link><a href="#how" className={s.glassButton}>How it works <ArrowDown size={16} /></a></div></div>
      <div className={s.heroWord} aria-label="Vellum">VELLUM<sup>®</sup></div>
      <div className={s.videoControls}><button onClick={toggleVideo} disabled={videoFailed} aria-label={playing ? "Pause background video" : "Play background video"}>{playing ? <Pause size={14} /> : <Play size={14} />}</button><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span></div>
    </section>
    <section className={s.about} id="about">
      <Chapter>About Vellum</Chapter>
      <div className={s.aboutGrid}><div className={s.aboutAside} data-reveal><span>01 — A DIFFERENT KIND<br />OF POSITION.</span><div className={s.smallArt}><Image src="/brand/vellum-glass-note.webp" alt="Sculptural emerald glass Vellum note" fill sizes="280px" /></div></div><div className={s.aboutBody}><p className={s.statement} data-reveal>A balance can stay locked.<br /><span>Ownership doesn’t have to.</span><br />Vellum turns a token position into a note you can carry. The asset, amount and maturity travel together. You hold the right to what comes next.</p><div className={s.compatibility} data-reveal><Link href="/protocol"><strong>↗</strong><span>Robinhood Chain</span></Link><Link href="/notes"><strong>20<span>/</span>721</strong><span>Tokens into notes</span></Link><Link href="/ownership"><strong className={s.infinity}>∞</strong><span>Portable ownership</span></Link></div></div></div>
    </section>
    <section className={s.positions} id="positions">
      <Chapter>The instruments</Chapter>
      <div className={s.sectionHeading} data-reveal><h2>Positions.</h2><Link href="/notes" className={s.textLink}>Explore notes <ArrowUpRight size={18} /></Link></div>
      <div className={s.railMeta}><span>ANATOMY OF A NOTE / ILLUSTRATIVE POSITIONS</span><div><button aria-label="Previous positions" onClick={() => noteRail.current?.scrollBy({left: -420, behavior:"smooth"})}><ArrowLeft size={18} /></button><button aria-label="Next positions" onClick={() => noteRail.current?.scrollBy({left:420,behavior:"smooth"})}><ArrowRight size={18} /></button></div></div>
      <div className={s.noteRail} ref={noteRail} aria-label="Example bearer notes" tabIndex={0}>{notes.map(note => <Link href="/app" className={s.note} key={note.ticker} style={{"--note-accent":note.color} as CSSProperties}><div className={s.noteHeader}><span>VELLUM / {note.number}</span><ArrowUpRight size={19} /></div><div className={s.noteVisual}><Image src="/brand/vellum-glass-note.webp" alt="" fill sizes="(max-width:700px) 80vw, 400px" /><span className={s.tokenBadge}><Image src={note.image} width={58} height={58} alt="" /></span></div><div className={s.noteIdentity}><h3>{note.name}</h3><span>{note.ticker}</span></div><strong className={s.noteAmount}>{note.amount}</strong><div className={s.noteFacts}><span>Lock term<b>{note.term}</b></span><span>Instrument<b>Bearer note</b></span></div><div className={s.noteBottom}><span>EXAMPLE POSITION</span><span>Make it yours <ArrowRight size={14} /></span></div></Link>)}</div>
    </section>
    <section className={s.ownership} id="ownership">
      <Image src="/brand/vellum-glass-world.webp" alt="Amber and teal glass forms in a blue atmosphere" fill sizes="100vw" className={s.ownershipBackdrop} /><div className={s.ownershipShade} /><Chapter light>One note. Many possibilities.</Chapter><h2 className={s.ownershipTitle} data-reveal>Ownership.</h2>
      <div className={s.useCaseStage} id="case-description" role="tabpanel" aria-labelledby={`case-tab-${activeCase}`}><div className={s.useCaseIntro}><span className={s.eyebrow}>WHAT YOU CAN DO WITH VELLUM</span><h3 key={currentCase.title}>{currentCase.heading}</h3><p>{currentCase.copy}</p><Link href={currentCase.href} className={s.glassButton}>{currentCase.label} <ArrowUpRight size={16} /></Link></div><div className={s.specimen} key={currentCase.state}><div className={s.specimenTop}><span>VELLUM / EXAMPLE NOTE</span><span>001</span></div><div className={s.specimenObject}><Image src="/brand/vellum-glass-note.webp" alt="Vellum glass note" fill sizes="360px" /></div><div className={s.specimenIdentity}><div><small>UNDERLYING POSITION</small><strong>250,000</strong></div><span>CASHCAT</span></div><div className={s.specimenFacts}><span>TERM<b>90 DAYS</b></span><span>STATE<b>{currentCase.state}</b></span></div><footer>{currentCase.foot}</footer></div></div>
      <div className={s.caseTabs} role="tablist" aria-label="Ways to use Vellum">{useCases.map((item,index)=><button key={item.title} id={`case-tab-${index}`} role="tab" aria-selected={index===activeCase} aria-controls="case-description" onClick={()=>setActiveCase(index)} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=(activeCase+(event.key==='ArrowRight'?1:3))%4;setActiveCase(next);document.getElementById(`case-tab-${next}`)?.focus();}}} tabIndex={index===activeCase?0:-1}><span>0{index+1}</span>{item.title}<ArrowUpRight size={18}/></button>)}</div><p className={s.caseCaption}>{currentCase.foot}</p>
    </section>
    <section className={s.principles}>
      <Chapter>In the details</Chapter><div className={s.sectionHeading} data-reveal><h2>Nothing<br />lost in transit.</h2><p>The useful part of a position<br />is the information it carries.</p></div>
      <div className={s.principleGrid}><article data-reveal><span className={s.eyebrow}>(01 — THE BALANCE)</span><h3>Same asset.<br />Same amount.</h3><p>The underlying tokens stay in the vault while the note changes hands.</p><div className={s.largeFact}>1:1</div><footer><Check size={15} /> One note represents one position</footer></article><article data-reveal><span className={s.eyebrow}>(02 — THE TERM)</span><h3>A date.<br />Not a guess.</h3><p>The lock term stays attached to the position, whoever holds it next.</p><div className={s.largeFact}>90<small>days*</small></div><footer><Check size={15} /> *Illustrative lock term</footer></article><article data-reveal><span className={s.eyebrow}>(03 — THE BEARER)</span><h3>Your note.<br />Your claim.</h3><p>The current holder can redeem the underlying balance at maturity.</p><div className={s.factSymbol}><ArrowUpRight strokeWidth={1} /></div><footer><Check size={15} /> Ownership follows the instrument</footer></article></div><div className={s.principleFoot}><span>THE MECHANICS, IN FULL.</span><Link href="/protocol">Explore the protocol <ArrowUpRight size={18}/></Link></div>
    </section>
    <section className={s.process} id="how">
      <Chapter>The process</Chapter><div className={s.processGrid}><div className={s.processCopy} data-reveal><span className={s.eyebrow}>(FROM A BALANCE TO A NOTE)</span><h2>Make room<br />for what’s next.</h2><Link href="/how-it-works" className={s.primaryButton}>Read the mechanics <ArrowUpRight size={17}/></Link><div className={s.stepList}>{steps.map((step,index)=><div className={s.step} data-active={activeStep===index} key={step.name}><h3><button aria-expanded={activeStep===index} aria-controls={`step-${index}`} onClick={()=>setActiveStep(index)}><span>0{index+1}</span>{step.name}<ChevronDown size={20}/></button></h3><div id={`step-${index}`} hidden={activeStep!==index}><p>{step.copy}</p><small>{step.detail}</small></div></div>)}</div></div><div className={s.processArt}><Image src="/brand/vellum-glass-world.webp" alt="Sculptural translucent Vellum ticket forms" fill sizes="(max-width:900px) 100vw, 50vw" /><div className={s.processArtOverlay}/><span className={s.processNumber}>0{activeStep+1}</span><div className={s.processArtCaption}><span>THE POSITION STAYS INTACT.</span><b>{steps[activeStep].name}.</b></div></div></div>
    </section>
    <footer className={s.footer}><div className={s.footerScene}><Image src="/brand/vellum-sky-hero.webp" alt="" fill sizes="100vw" /><div className={s.footerShade}/><div className={s.footerCta}><h2>A position.<br />More possibilities.</h2><Link href="/app" className={s.primaryButton}>Open Vellum <ArrowUpRight size={19}/></Link></div><div className={s.footerWord} aria-hidden="true">VELLUM<sup>®</sup></div></div><div className={s.footerLinks}><span>© {new Date().getFullYear()} Vellum</span><nav aria-label="Footer"><Link href="/docs">Docs</Link><Link href="/protocol">Protocol</Link><a href="https://x.com/VellumRH" target="_blank" rel="noreferrer">X / Twitter <ArrowUpRight size={14}/></a></nav><a href="#hero-title">Back to top <ArrowUpRight size={14}/></a></div></footer>
  </main>;
}
