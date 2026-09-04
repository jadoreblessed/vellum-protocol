"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TokenLogo from "../components/TokenLogo";
import TextReveal from "../components/TextReveal";
import BearerNote from "../components/BearerNote";
import motion from "../components/AppPreviewMotion.module.css";
import refinement from "../components/AppVisualRefinement.module.css";
import { createPublicClient, createWalletClient, custom, erc20Abi, formatEther, http, isAddress, parseUnits, type Address } from "viem";
import { VELLUM_VAULT_ABI } from "../lib/vellumVaultArtifact";
import { DEFAULT_NETWORK_ID, getVellumNetwork, VELLUM_NETWORKS, type VellumNetwork, type VellumToken } from "../lib/vellumNetworks";
import { useVellumVaultAddress } from "../lib/vellumVaultAddress";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window { ethereum?: EthereumProvider }
}

const terms = ["30D", "90D", "180D", "1Y"];
const shorten = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const termSeconds: Record<string, number> = { "30D": 30 * 86400, "90D": 90 * 86400, "180D": 180 * 86400, "1Y": 365 * 86400 };
const messageFrom = (error: unknown) => error instanceof Error ? (error as Error & { shortMessage?: string }).shortMessage || error.message : "Transaction failed";
const publicClientFor = (network: VellumNetwork) => createPublicClient({ chain: network.chain, transport: http(network.chain.rpcUrls.default.http[0]) });

export default function AppPage() {
  const [tab, setTab] = useState<"notes" | "wrap">("wrap");
  const network = getVellumNetwork(DEFAULT_NETWORK_ID) ?? VELLUM_NETWORKS[0];
  const [token, setToken] = useState<VellumToken>(network.tokens[0]);
  const [term, setTerm] = useState("90D");
  const [amount, setAmount] = useState("250000");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const vaultAddress = useVellumVaultAddress();
  const [noteId, setNoteId] = useState("");
  const [transaction, setTransaction] = useState("");
  const [working, setWorking] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [previewRevision, setPreviewRevision] = useState(0);
  const hasPreviewMounted = useRef(false);

  useEffect(() => {
    if (!hasPreviewMounted.current) {
      hasPreviewMounted.current = true;
      return;
    }
    const revealTimer = window.setTimeout(() => setPreviewRevision((revision) => revision + 1), 180);
    return () => window.clearTimeout(revealTimer);
  }, [token.symbol, amount, term]);

  useEffect(() => {
    setToken(network.tokens[0]);
    setTokenAddress(network.tokens[0].address ?? "");
    setTokenDecimals(18);
    setNoteId("");
    setTransaction("");
  }, [network.tokens]);

  function selectToken(nextToken: VellumToken) {
    setToken(nextToken);
    setTokenAddress(nextToken.address ?? "");
    setTokenDecimals(18);
    setError("");
  }

  function walletClient(activeNetwork = network) {
    if (!window.ethereum) throw new Error("Install MetaMask, Rabby, or Coinbase Wallet");
    return createWalletClient({ chain: activeNetwork.chain, transport: custom(window.ethereum as never) });
  }

  async function ensureNetwork(activeNetwork = network) {
    if (!window.ethereum) throw new Error("Wallet not found");
    const target = `0x${activeNetwork.chain.id.toString(16)}`;
    const current = await window.ethereum.request({ method: "eth_chainId" }) as string;
    if (current === target) return;
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: target }] });
    } catch (switchError) {
      const code = (switchError as { code?: number }).code;
      if (code !== 4902) throw switchError;
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: target,
          chainName: activeNetwork.chain.name,
          nativeCurrency: activeNetwork.chain.nativeCurrency,
          rpcUrls: [...activeNetwork.chain.rpcUrls.default.http],
          blockExplorerUrls: [activeNetwork.chain.blockExplorers?.default.url ?? ""].filter(Boolean),
        }],
      });
    }
  }

  async function readWallet(nextAddress?: string) {
    const provider = window.ethereum;
    if (!provider) return;
    const accounts = nextAddress ? [nextAddress] : await provider.request({ method: "eth_accounts" }) as string[];
    const current = accounts[0] || "";
    setAddress(current);
    const chainId = await provider.request({ method: "eth_chainId" }) as string;
    const numericChainId = Number.parseInt(chainId, 16);
    const connectedNetwork = getVellumNetwork(numericChainId);
    if (current) {
      const raw = await provider.request({ method: "eth_getBalance", params: [current, "latest"] }) as string;
      const unit = connectedNetwork?.chain.nativeCurrency.symbol ?? "ETH";
      setBalance(`${Number(formatEther(BigInt(raw))).toFixed(4)} ${unit}`);
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

  async function readTokenMetadata() {
    setError("");
    if (!isAddress(tokenAddress)) {
      setError("Enter a valid ERC-20 contract address");
      return;
    }
    try {
      const addressToRead = tokenAddress as Address;
      const [name, symbol, decimals] = await Promise.all([
        publicClientFor(network).readContract({ address: addressToRead, abi: erc20Abi, functionName: "name" }),
        publicClientFor(network).readContract({ address: addressToRead, abi: erc20Abi, functionName: "symbol" }),
        publicClientFor(network).readContract({ address: addressToRead, abi: erc20Abi, functionName: "decimals" }),
      ]);
      setToken({ symbol: `$${symbol}`, name, color: "#218547", accent: "#d8ef61", mark: "$—" });
      setTokenDecimals(Number(decimals));
    } catch (readError) {
      setError(`Couldn't read this token: ${messageFrom(readError)}`);
    }
  }

  async function wrapPosition() {
    if (!address || !isAddress(address)) {
      await connectWallet();
      return;
    }
    if (!vaultAddress || !isAddress(vaultAddress)) {
      setError("Deploy the Vellum test vault first");
      return;
    }
    if (!isAddress(tokenAddress)) {
      setError("Enter a valid ERC-20 contract address");
      return;
    }
    const selectedTerm = termSeconds[term];
    if (!selectedTerm) {
      setError("Choose a fixed term from 30D, 90D, 180D, or 1Y");
      return;
    }
    setWorking(true);
    setError("");
    setTransaction("");
    try {
      await ensureNetwork();
      const tokenContract = tokenAddress as Address;
      const vault = vaultAddress as Address;
      const parsedAmount = parseUnits(amount, tokenDecimals);
      if (parsedAmount <= BigInt(0)) throw new Error("Amount must be greater than zero");
      const [allowance, nextId] = await Promise.all([
        publicClientFor(network).readContract({ address: tokenContract, abi: erc20Abi, functionName: "allowance", args: [address as Address, vault] }),
        publicClientFor(network).readContract({ address: vault, abi: VELLUM_VAULT_ABI, functionName: "nextTokenId" }),
      ]);
      if (allowance < parsedAmount) {
        const approveHash = await walletClient().writeContract({
          account: address as Address,
          address: tokenContract,
          abi: erc20Abi,
          functionName: "approve",
          args: [vault, parsedAmount],
        });
        setTransaction(approveHash);
        await publicClientFor(network).waitForTransactionReceipt({ hash: approveHash });
      }
      const wrapHash = await walletClient().writeContract({
        account: address as Address,
        address: vault,
        abi: VELLUM_VAULT_ABI,
        functionName: "wrap",
        args: [tokenContract, parsedAmount, BigInt(selectedTerm)],
      });
      setTransaction(wrapHash);
      await publicClientFor(network).waitForTransactionReceipt({ hash: wrapHash });
      setNoteId(nextId.toString());
      setTab("notes");
    } catch (wrapError) {
      setError(messageFrom(wrapError));
    } finally {
      setWorking(false);
    }
  }

  async function claimPosition() {
    if (!address || !isAddress(address)) {
      await connectWallet();
      return;
    }
    if (!vaultAddress || !isAddress(vaultAddress) || !noteId.trim()) {
      setError("Enter a deployed vault and note ID");
      return;
    }
    setWorking(true);
    setError("");
    setTransaction("");
    try {
      await ensureNetwork();
      const hash = await walletClient().writeContract({
        account: address as Address,
        address: vaultAddress as Address,
        abi: VELLUM_VAULT_ABI,
        functionName: "claim",
        args: [BigInt(noteId)],
      });
      setTransaction(hash);
      await publicClientFor(network).waitForTransactionReceipt({ hash });
    } catch (claimError) {
      setError(messageFrom(claimError));
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className={`app-shell ${refinement.app}`}>
      <header className="app-nav">
        <Link href="/" className="wordmark">vellum<span>.</span></Link>
        <div className="app-nav-right">
          {address ? (
            <button className="wallet wallet-connected" onClick={disconnectWallet}>
              <span className="wallet-dot" />{shorten(address)}
            </button>
          ) : (
            <button className="wallet" onClick={connectWallet}>{connecting ? "Connecting..." : "Connect wallet"}</button>
          )}
        </div>
      </header>

      <div className="app-main">
        {error && <div className="wallet-error">{error}</div>}

        <div className="app-layout">
          <TextReveal as="section" className="app-form-panel">
            <h1 className="app-title">
              {tab === "wrap" ? <>Lock a token,<br/><em>hold the note.</em></> : <>Your notes<br/><em>carry the claim.</em></>}
            </h1>
            <div className="tabs">
              <button className={`tab ${tab === "wrap" ? "active" : ""}`} onClick={() => setTab("wrap")}>Wrap</button>
              <button className={`tab ${tab === "notes" ? "active" : ""}`} onClick={() => setTab("notes")}>Notes</button>
            </div>

            {tab === "notes" ? (
              <>
                <label className="form-label mono"><span>Note ID</span></label>
                <input className="field" value={noteId} onChange={(event) => setNoteId(event.target.value)} placeholder="Enter Vellum note ID" inputMode="numeric" />
                <div className="wrap-action notes-action">
                  <button className="wrap-submit" onClick={claimPosition} disabled={working || !vaultAddress}><span>{working ? "Confirming..." : "Claim note"}</span></button>
                </div>
              </>
            ) : (
              <>
                <label className="form-label mono"><span>Token address</span><span>ERC-20</span></label>
                <input className="field" value={tokenAddress} onChange={(event) => setTokenAddress(event.target.value)} onBlur={() => void readTokenMetadata()} placeholder="Paste ERC-20 contract address" />
                <div className="token-pills">
                  {network.tokens.map((item) => (
                    <button key={item.symbol} className={`pill token-pill ${token.symbol === item.symbol ? "active" : ""}`} onClick={() => selectToken(item)}>
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
                <div className="wrap-action">
                  <div><div className="label">Term</div><div className="position" style={{ fontSize: 38 }}>{term}</div></div>
                  <div><div className="label">Token</div><b style={{ fontFamily: "var(--mono)" }}>{token.symbol}</b></div>
                  <button className={`wrap-submit ${!vaultAddress ? "vault-required" : ""}`} onClick={wrapPosition} disabled={working || (Boolean(address) && !vaultAddress)}><span>{working ? "Confirming..." : !vaultAddress ? "Vault required" : address ? "Approve and wrap" : "Connect to wrap"}</span></button>
                </div>
              </>
            )}
          </TextReveal>

          <section className={`preview-card ${motion.preview}`}>
            {tab === "wrap" ? (
              <div className="app-bearer-wrap">
                <BearerNote
                  key={previewRevision}
                  className="app-note-enter"
                  symbol={token.symbol}
                  name={token.name}
                  color={token.color}
                  accent={token.accent}
                  amount={amount || "250,000"}
                  term={term === "NONE" ? "OPEN" : term}
                  mark={token.mark}
                  network=""
                  signalOnView={false}
                />
              </div>
            ) : <div className="empty-card">NO NOTES YET</div>}
          </section>
        </div>
      </div>
      {transaction && network.chain.blockExplorers?.default.url && <a className="wallet-error" href={`${network.chain.blockExplorers.default.url}/tx/${transaction}`} target="_blank" rel="noreferrer">View transaction</a>}
    </main>
  );
}
