"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TokenLogo from "../components/TokenLogo";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window { ethereum?: EthereumProvider }
}

const tokens = [
  { symbol: "$CASHCAT", name: "Cash Cat", color: "#218547" },
  { symbol: "$PONS", name: "Pons", color: "#2f5be8" },
  { symbol: "$IF", name: "What IF", color: "#c7432c" },
];
const terms = ["NONE", "30D", "90D", "180D", "1Y", "CUSTOM"];
const shorten = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const hexToChain = (hex: string) => Number.parseInt(hex, 16).toString();

export default function AppPage() {
  const [tab, setTab] = useState<"notes" | "wrap">("wrap");
  const [token, setToken] = useState(tokens[0]);
  const [term, setTerm] = useState("90D");
  const [network, setNetwork] = useState("Robinhood Chain");
  const [amount, setAmount] = useState("250000");
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("");
  const [balance, setBalance] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  async function readWallet(nextAddress?: string) {
    const provider = window.ethereum;
    if (!provider) return;
    const accounts = nextAddress ? [nextAddress] : await provider.request({ method: "eth_accounts" }) as string[];
    const current = accounts[0] || "";
    setAddress(current);
    const chainId = await provider.request({ method: "eth_chainId" }) as string;
    setChain(hexToChain(chainId));
    if (current) {
      const raw = await provider.request({ method: "eth_getBalance", params: [current, "latest"] }) as string;
      setBalance(`${(Number.parseInt(raw, 16) / 1e18).toFixed(4)} ETH`);
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setError("Установите MetaMask, Rabby или Coinbase Wallet");
      return;
    }
    setConnecting(true);
    setError("");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      await readWallet(accounts[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Подключение отменено");
    } finally {
      setConnecting(false);
    }
  }

  function disconnectWallet() {
    setAddress("");
    setBalance("");
  }

  useEffect(() => {
    if (!window.ethereum) return;
    void readWallet();
    const accountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts?.[0]) void readWallet(accounts[0]);
      else disconnectWallet();
    };
    const chainChanged = () => void readWallet();
    window.ethereum.on?.("accountsChanged", accountsChanged);
    window.ethereum.on?.("chainChanged", chainChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", accountsChanged);
      window.ethereum?.removeListener?.("chainChanged", chainChanged);
    };
  }, []);

  return (
    <main className="app-shell">
      <header className="app-nav">
        <Link href="/" className="wordmark">vellum<span>.</span></Link>
        <div className="app-nav-right">
          <button className="button" onClick={() => setTab("notes")}>Notes</button>
          <button className="button" onClick={() => setTab("wrap")}>Wrap</button>
          {address ? (
            <button className="wallet wallet-connected" onClick={disconnectWallet}>
              <span className="wallet-dot" />{shorten(address)} <small>CHAIN {chain}</small>
            </button>
          ) : (
            <button className="wallet" onClick={connectWallet}>{connecting ? "Connecting..." : "Connect wallet"}</button>
          )}
        </div>
      </header>

      <div className="app-main">
        {error && <div className="wallet-error">{error}</div>}

        <div className="app-layout">
          <section className="app-form-panel">
            <h1 className="app-title">
              {tab === "wrap" ? <>Lock a token,<br/><em>hold the note.</em></> : <>Your notes<br/><em>carry the claim.</em></>}
            </h1>
            <div className="tabs">
              <button className={`tab ${tab === "notes" ? "active" : ""}`} onClick={() => setTab("notes")}>Notes</button>
              <button className={`tab ${tab === "wrap" ? "active" : ""}`} onClick={() => setTab("wrap")}>Wrap</button>
            </div>

            {tab === "notes" ? (
              <div className="notice">{address ? "No active notes found for this wallet yet. Connect the deployed contract to load onchain notes." : "No active notes in this wallet. Connect a wallet to continue."}</div>
            ) : (
              <>
                <div className="network-fields">
                  <label className="form-label mono"><span>Network</span><span>CHAIN</span></label>
                  <select className="field network-select" value={network} onChange={(event) => setNetwork(event.target.value)}>
                    <option>Robinhood Chain</option><option>Ethereum</option><option>Base</option><option>Polygon</option>
                  </select>
                  <label className="form-label mono"><span>Token address</span><span>ERC-20 STANDARD</span></label>
                </div>
                <input className="field" placeholder="Paste the ERC-20 contract address" />
                <div className="token-pills">
                  {tokens.map((item) => (
                    <button key={item.symbol} className={`pill token-pill ${token.symbol === item.symbol ? "active" : ""}`} onClick={() => setToken(item)}>
                      <TokenLogo symbol={item.symbol} color={item.color}/><span><b>{item.symbol}</b><small>{item.name}</small></span>
                    </button>
                  ))}
                </div>
                <label className="form-label mono"><span>Amount</span><span>{token.symbol}</span></label>
                <input className="field" value={amount} onChange={(event) => setAmount(event.target.value)} />
                <label className="form-label mono"><span>Term</span><span>UNWRAP REVERTS UNTIL MATURITY</span></label>
                <div className="term-pills">
                  {terms.map((item) => <button key={item} className={`pill ${term === item ? "active" : ""}`} onClick={() => setTerm(item)}>{item}</button>)}
                </div>
                <div className="notice">{network} · {token.name} uses the ERC-20 token standard · unlocks 04 NOV 2026</div>
                <div className="wrap-action">
                  <div><div className="label">Days</div><div className="position" style={{ fontSize: 52 }}>90</div></div>
                  <div><div className="label">Entry · 30-min TWAP</div><b style={{ fontFamily: "var(--mono)" }}>—</b></div>
                  <button className="wrap-submit" onClick={address ? () => setError("Wrap contract is not configured yet") : connectWallet}><span>{address ? "Approve and wrap" : "Connect to wrap"}</span><b>↗</b></button>
                </div>
              </>
            )}
          </section>

          <section className="preview-card">
            {tab === "wrap" ? (
              <div className="note-wrap app-note">
                <article className="note">
                  <div className="note-top"><strong>vellum<span>.</span></strong><b>W / 421</b></div>
                  <div className="note-band" style={{ background: token.color }}>
                    <div className="token-icon"><TokenLogo symbol={token.symbol} color={token.color}/></div>
                    <div><div className="token-symbol">{token.symbol}</div><div className="token-name">{token.name}</div></div>
                  </div>
                  <div className="empty-card deposit-state" style={{ height: 220, margin: "15px 0" }}>
                    <span className="deposit-orbit"><i /><i /><b>V</b></span>
                    <strong>{address ? "Ready to seal" : "Connect to seal"}</strong>
                  </div>
                  <div className="note-foot"><span>TRANSFERABLE CLAIM</span><b>{term === "NONE" ? "OPEN" : term}</b></div>
                </article>
              </div>
            ) : <div className="empty-card">NO NOTES YET</div>}
          </section>
        </div>
      </div>
    </main>
  );
}
