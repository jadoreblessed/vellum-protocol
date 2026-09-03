"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TokenLogo from "../components/TokenLogo";
import TextReveal from "../components/TextReveal";
import BearerNote from "../components/BearerNote";
import motion from "../components/AppPreviewMotion.module.css";
import refinement from "../components/AppVisualRefinement.module.css";
import { baseSepolia } from "viem/chains";
import { createPublicClient, createWalletClient, custom, decodeEventLog, erc20Abi, http, isAddress, parseUnits, type Address } from "viem";
import { VELLUM_TEST_VAULT_ABI, VELLUM_TEST_VAULT_BYTECODE } from "../lib/vellumTestVaultArtifact";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window { ethereum?: EthereumProvider }
}

const tokens = [
  { symbol: "$CASHCAT", name: "Cash Cat", color: "#218547", accent: "#d8ef61", mark: "$0.0870" },
  { symbol: "$PONS", name: "Pons", color: "#2f5be8", accent: "#a9b8ff", mark: "$0.0365" },
  { symbol: "$IF", name: "What IF", color: "#c7432c", accent: "#ffb36d", mark: "$0.0114" },
];
const terms = ["30D", "90D", "180D", "1Y"];
const shorten = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const hexToChain = (hex: string) => Number.parseInt(hex, 16).toString();
const publicClient = createPublicClient({ chain: baseSepolia, transport: http() });
const configuredVault = process.env.NEXT_PUBLIC_VELLUM_TEST_VAULT_ADDRESS?.trim() ?? "";
const termSeconds: Record<string, number> = { "30D": 30 * 86400, "90D": 90 * 86400, "180D": 180 * 86400, "1Y": 365 * 86400 };
const messageFrom = (error: unknown) => error instanceof Error ? (error as Error & { shortMessage?: string }).shortMessage || error.message : "Transaction failed";

export default function AppPage() {
  const [tab, setTab] = useState<"notes" | "wrap">("wrap");
  const [token, setToken] = useState(tokens[0]);
  const [term, setTerm] = useState("90D");
  const [amount, setAmount] = useState("250000");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [vaultAddress, setVaultAddress] = useState(configuredVault);
  const [noteId, setNoteId] = useState("");
  const [transaction, setTransaction] = useState("");
  const [working, setWorking] = useState(false);
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("");
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
  }, [token.symbol, amount, term, chain]);

  function walletClient() {
    if (!window.ethereum) throw new Error("Install MetaMask, Rabby, or Coinbase Wallet");
    return createWalletClient({ chain: baseSepolia, transport: custom(window.ethereum as never) });
  }

  async function ensureBaseSepolia() {
    if (!window.ethereum) throw new Error("Wallet not found");
    const target = `0x${baseSepolia.id.toString(16)}`;
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
          chainName: baseSepolia.name,
          nativeCurrency: baseSepolia.nativeCurrency,
          rpcUrls: [...baseSepolia.rpcUrls.default.http],
          blockExplorerUrls: [baseSepolia.blockExplorers.default.url],
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
    const rememberedVault = window.localStorage.getItem("vellum-test-vault");
    if (!configuredVault && rememberedVault && isAddress(rememberedVault)) setVaultAddress(rememberedVault);
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
      setError("Enter a valid Base Sepolia ERC-20 contract address");
      return;
    }
    try {
      const addressToRead = tokenAddress as Address;
      const [name, symbol, decimals] = await Promise.all([
        publicClient.readContract({ address: addressToRead, abi: erc20Abi, functionName: "name" }),
        publicClient.readContract({ address: addressToRead, abi: erc20Abi, functionName: "symbol" }),
        publicClient.readContract({ address: addressToRead, abi: erc20Abi, functionName: "decimals" }),
      ]);
      setToken({ symbol: `$${symbol}`, name, color: "#218547", accent: "#d8ef61", mark: "$—" });
      setTokenDecimals(Number(decimals));
    } catch (readError) {
      setError(`Couldn't read this token: ${messageFrom(readError)}`);
    }
  }

  async function deployTestVault() {
    if (!address || !isAddress(address)) {
      await connectWallet();
      return;
    }
    setWorking(true);
    setError("");
    setTransaction("");
    try {
      await ensureBaseSepolia();
      const hash = await walletClient().deployContract({
        account: address as Address,
        abi: VELLUM_TEST_VAULT_ABI,
        bytecode: VELLUM_TEST_VAULT_BYTECODE,
      });
      setTransaction(hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (!receipt.contractAddress) throw new Error("Deployment did not return a contract address");
      setVaultAddress(receipt.contractAddress);
      window.localStorage.setItem("vellum-test-vault", receipt.contractAddress);
    } catch (deployError) {
      setError(messageFrom(deployError));
    } finally {
      setWorking(false);
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
      setError("Enter a valid Base Sepolia ERC-20 contract address");
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
      await ensureBaseSepolia();
      const tokenContract = tokenAddress as Address;
      const vault = vaultAddress as Address;
      const parsedAmount = parseUnits(amount, tokenDecimals);
      if (parsedAmount <= BigInt(0)) throw new Error("Amount must be greater than zero");
      const [allowance, nextId] = await Promise.all([
        publicClient.readContract({ address: tokenContract, abi: erc20Abi, functionName: "allowance", args: [address as Address, vault] }),
        publicClient.readContract({ address: vault, abi: VELLUM_TEST_VAULT_ABI, functionName: "nextTokenId" }),
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
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }
      const wrapHash = await walletClient().writeContract({
        account: address as Address,
        address: vault,
        abi: VELLUM_TEST_VAULT_ABI,
        functionName: "wrap",
        args: [tokenContract, parsedAmount, BigInt(selectedTerm)],
      });
      setTransaction(wrapHash);
      await publicClient.waitForTransactionReceipt({ hash: wrapHash });
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
      await ensureBaseSepolia();
      const hash = await walletClient().writeContract({
        account: address as Address,
        address: vaultAddress as Address,
        abi: VELLUM_TEST_VAULT_ABI,
        functionName: "claim",
        args: [BigInt(noteId)],
      });
      setTransaction(hash);
      await publicClient.waitForTransactionReceipt({ hash });
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
          <TextReveal as="section" className="app-form-panel">
            <h1 className="app-title">
              {tab === "wrap" ? <>Lock a token,<br/><em>hold the note.</em></> : <>Your notes<br/><em>carry the claim.</em></>}
            </h1>
            <div className="tabs">
              <button className={`tab ${tab === "notes" ? "active" : ""}`} onClick={() => setTab("notes")}>Notes</button>
              <button className={`tab ${tab === "wrap" ? "active" : ""}`} onClick={() => setTab("wrap")}>Wrap</button>
            </div>

            {tab === "notes" ? (
              <>
                <label className="form-label mono"><span>Note ID</span><span>BASE SEPOLIA</span></label>
                <input className="field" value={noteId} onChange={(event) => setNoteId(event.target.value)} placeholder="Enter Vellum note ID" inputMode="numeric" />
                <div className="notice">{vaultAddress ? `Vault ${shorten(vaultAddress)} · claim is available after maturity` : "Deploy the Vellum test vault in Wrap first."}</div>
                <div className="wrap-action">
                  <div><div className="label">Network</div><div className="position" style={{ fontSize: 30 }}>Base Sepolia</div></div>
                  <button className="wrap-submit" onClick={claimPosition} disabled={working}><span>{working ? "Confirming..." : "Claim note"}</span><b>↗</b></button>
                </div>
              </>
            ) : (
              <>
                <div className="network-fields">
                  <label className="form-label mono"><span>Network</span><span>CHAIN</span></label>
                  <div className="field network-select">Base Sepolia · testnet</div>
                  <label className="form-label mono"><span>Token address</span><span>ERC-20 STANDARD</span></label>
                </div>
                <input className="field" value={tokenAddress} onChange={(event) => setTokenAddress(event.target.value)} onBlur={() => void readTokenMetadata()} placeholder="Paste the Base Sepolia ERC-20 contract address" />
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
                <div className="notice">Base Sepolia only · connect a test ERC-20 · this test vault is not for real funds</div>
                {!vaultAddress && <button className="wrap-submit" onClick={deployTestVault} disabled={working}><span>{working ? "Deploying..." : "Deploy Vellum test vault"}</span><b>↗</b></button>}
                {vaultAddress && <div className="notice">Test vault ready · {shorten(vaultAddress)}</div>}
                <div className="wrap-action">
                  <div><div className="label">Term</div><div className="position" style={{ fontSize: 38 }}>{term}</div></div>
                  <div><div className="label">Token</div><b style={{ fontFamily: "var(--mono)" }}>{token.symbol}</b></div>
                  <button className="wrap-submit" onClick={wrapPosition} disabled={working}><span>{working ? "Confirming..." : address ? "Approve and wrap" : "Connect to wrap"}</span><b>↗</b></button>
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
                  network={chain === String(baseSepolia.id) ? "BASE SEPOLIA" : "BASE SEPOLIA TESTNET"}
                  signalOnView={false}
                />
              </div>
            ) : <div className="empty-card">NO NOTES YET</div>}
          </section>
        </div>
      </div>
      {transaction && <a className="wallet-error" href={`${baseSepolia.blockExplorers.default.url}/tx/${transaction}`} target="_blank" rel="noreferrer">View transaction on Base Sepolia ↗</a>}
    </main>
  );
}
