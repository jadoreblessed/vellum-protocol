import type { Address, Chain } from "viem";
import { arbitrum, arbitrumSepolia, base, baseSepolia, mainnet, optimism, optimismSepolia, sepolia } from "viem/chains";

export type VellumToken = {
  symbol: string;
  name: string;
  color: string;
  accent: string;
  mark: string;
  address?: Address;
};

export type VellumNetwork = {
  chain: Chain;
  label: string;
  shortLabel: string;
  production: boolean;
  tokens: readonly VellumToken[];
};

const robinhood = {
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.mainnet.chain.robinhood.com"] } },
  blockExplorers: { default: { name: "Robinhood Chain Explorer", url: "https://robinhoodchain.blockscout.com" } },
  testnet: false,
} as const satisfies Chain;

const robinhoodTestnet = {
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.chain.robinhood.com"] } },
  blockExplorers: { default: { name: "Robinhood Chain Testnet Explorer", url: "https://explorer.testnet.chain.robinhood.com" } },
  testnet: true,
} as const satisfies Chain;

const showcaseTokens: readonly VellumToken[] = [
  { symbol: "$CASHCAT", name: "Cash Cat", color: "#218547", accent: "#d8ef61", mark: "$0.0870" },
  { symbol: "$PONS", name: "Pons", color: "#2f5be8", accent: "#a9b8ff", mark: "$0.0365" },
  { symbol: "$IF", name: "What IF", color: "#c7432c", accent: "#ffb36d", mark: "$0.0114" },
];

const robinhoodTokens: readonly VellumToken[] = [
  {
    symbol: "$WETH",
    name: "Wrapped Ether",
    color: "#6678d6",
    accent: "#a9b8ff",
    mark: "$—",
    address: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73",
  },
  {
    symbol: "$USDG",
    name: "Global Dollar",
    color: "#17654a",
    accent: "#d8ef61",
    mark: "$1.00",
    address: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168",
  },
  ...showcaseTokens,
];

const vaultByChain: Record<number, string> = {
  [robinhood.id]: process.env.NEXT_PUBLIC_VELLUM_ROBINHOOD_VAULT_ADDRESS?.trim() ?? "",
  [robinhoodTestnet.id]: process.env.NEXT_PUBLIC_VELLUM_ROBINHOOD_TESTNET_VAULT_ADDRESS?.trim() ?? "",
  [mainnet.id]: process.env.NEXT_PUBLIC_VELLUM_ETHEREUM_VAULT_ADDRESS?.trim() ?? "",
  [sepolia.id]: process.env.NEXT_PUBLIC_VELLUM_SEPOLIA_VAULT_ADDRESS?.trim() ?? "",
  [base.id]: process.env.NEXT_PUBLIC_VELLUM_BASE_VAULT_ADDRESS?.trim() ?? "",
  [baseSepolia.id]: process.env.NEXT_PUBLIC_VELLUM_BASE_SEPOLIA_VAULT_ADDRESS?.trim() ?? process.env.NEXT_PUBLIC_VELLUM_TEST_VAULT_ADDRESS?.trim() ?? "",
  [arbitrum.id]: process.env.NEXT_PUBLIC_VELLUM_ARBITRUM_VAULT_ADDRESS?.trim() ?? "",
  [arbitrumSepolia.id]: process.env.NEXT_PUBLIC_VELLUM_ARBITRUM_SEPOLIA_VAULT_ADDRESS?.trim() ?? "",
  [optimism.id]: process.env.NEXT_PUBLIC_VELLUM_OPTIMISM_VAULT_ADDRESS?.trim() ?? "",
  [optimismSepolia.id]: process.env.NEXT_PUBLIC_VELLUM_OPTIMISM_SEPOLIA_VAULT_ADDRESS?.trim() ?? "",
};

export const VELLUM_NETWORKS: readonly VellumNetwork[] = [
  { chain: robinhood, label: "Robinhood Chain", shortLabel: "ROBINHOOD", production: true, tokens: robinhoodTokens },
  { chain: mainnet, label: "Ethereum", shortLabel: "ETHEREUM", production: true, tokens: showcaseTokens },
  { chain: base, label: "Base", shortLabel: "BASE", production: true, tokens: showcaseTokens },
  { chain: arbitrum, label: "Arbitrum", shortLabel: "ARBITRUM", production: true, tokens: showcaseTokens },
  { chain: optimism, label: "Optimism", shortLabel: "OPTIMISM", production: true, tokens: showcaseTokens },
  { chain: robinhoodTestnet, label: "Robinhood Chain Testnet", shortLabel: "RH TESTNET", production: false, tokens: showcaseTokens },
  { chain: sepolia, label: "Ethereum Sepolia", shortLabel: "ETH SEPOLIA", production: false, tokens: showcaseTokens },
  { chain: baseSepolia, label: "Base Sepolia", shortLabel: "BASE SEPOLIA", production: false, tokens: showcaseTokens },
  { chain: arbitrumSepolia, label: "Arbitrum Sepolia", shortLabel: "ARB SEPOLIA", production: false, tokens: showcaseTokens },
  { chain: optimismSepolia, label: "Optimism Sepolia", shortLabel: "OP SEPOLIA", production: false, tokens: showcaseTokens },
];

export const DEFAULT_NETWORK_ID = robinhood.id;

export function getVellumNetwork(chainId: number) {
  return VELLUM_NETWORKS.find((network) => network.chain.id === chainId);
}

export function configuredVaultFor(chainId: number) {
  const value = vaultByChain[chainId] ?? "";
  return value;
}

export function vaultStorageKey(chainId: number) {
  return `vellum-vault-${chainId}`;
}
