type TokenLogoProps = { symbol: string; color?: string };

export default function TokenLogo({ symbol, color = "#dfe9df" }: TokenLogoProps) {
  const short = symbol.replace("$", "").slice(0, 2);
  const logos: Record<string, string> = { "$CASHCAT": "/tokens/cashcat.png", "$PONS": "https://coinbazooka.com/storage/logos/coin-b656c4cb-6694-4192-a0b0-eabcd7f34641.webp", "$IF": "https://dd.dexscreener.com/ds-data/tokens/robinhood/0x232cdfc415d10b673845d83dc02ba2eabe7e30d1.png", "$USDG": "/tokens/usdg.png", "$WETH": "/tokens/weth.png" };
  return <span className="token-logo" style={{ background: color }} aria-label={`${symbol} logo`}><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M11 24c5-9 13-9 18 0M14 17h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><text x="20" y="34" textAnchor="middle" fontSize="6" fontFamily="monospace" fontWeight="700">{short}</text></svg>{logos[symbol] && <img className="token-logo-image" src={logos[symbol]} alt="" />}</span>;
}
