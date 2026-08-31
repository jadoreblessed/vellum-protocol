import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

type DocPageProps = { index: string; eyebrow: string; title: React.ReactNode; intro: string; action?: { label: string; href: string }; facts: [string, string][]; steps: [string, string, string][]; dark?: boolean };

export default function DocPage({ index, eyebrow, title, intro, action = { label: "Open the app", href: "/app" }, facts, steps, dark = false }: DocPageProps) {
  return <main className={`doc-shell ${dark ? "doc-dark" : ""}`}>
    <header className="nav"><div className="container nav-inner"><Link href="/" className="wordmark">vellum</Link><nav className="nav-links"><Link href="/how-it-works">How it works</Link><Link href="/notes">Notes</Link><Link href="/protocol">Protocol</Link><Link href="/docs">Docs</Link></nav><Link href={action.href} className="button acid">{action.label}</Link></div></header>
    <section className="doc-hero container"><div className="doc-hero-copy"><div className="eyebrow mono">{index} / {eyebrow}</div><h1 className="doc-title">{title}</h1><p>{intro}</p><Link className="button acid" href={action.href}>{action.label} <span>↗</span></Link></div><div className="doc-index mono"><span>VLM / {index}</span><span>READING NOTE</span></div></section>
    <ScrollReveal><section className="doc-facts container">{facts.map(([key, value]) => <div className="doc-fact" key={key}><span className="mono">{key}</span><strong>{value}</strong></div>)}</section></ScrollReveal>
    <ScrollReveal><section className="doc-body container"><div className="eyebrow mono">HOW IT MOVES</div><div className="doc-steps">{steps.map(([num, heading, body]) => <article className="doc-step" key={num}><span className="mono">{num}</span><h2>{heading}</h2><p>{body}</p></article>)}</div></section></ScrollReveal>
    <section className="doc-footer container"><div className="mono">END OF NOTE · {eyebrow}</div><Link href="/docs">Back to documentation →</Link></section>
  </main>;
}
