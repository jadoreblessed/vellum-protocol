type TokenLogoProps = { symbol: string; color?: string };

export default function TokenLogo({ symbol, color = "#dfe9df" }: TokenLogoProps) {
  const short = symbol.replace("$", "").slice(0, 2);
  return <span className="token-logo" style={{ background: color }} aria-label={`${symbol} logo`}><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M11 24c5-9 13-9 18 0M14 17h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><text x="20" y="34" textAnchor="middle" fontSize="6" fontFamily="monospace" fontWeight="700">{short}</text></svg></span>;
}
