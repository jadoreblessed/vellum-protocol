import { readFile } from "node:fs/promises";
import solc from "solc";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, sepolia } from "viem/chains";

const robinhood = {
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.mainnet.chain.robinhood.com"] } },
  blockExplorers: { default: { name: "Robinhood Chain Explorer", url: "https://robinhoodchain.blockscout.com" } },
  testnet: false,
};

const robinhoodTestnet = {
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.chain.robinhood.com"] } },
  blockExplorers: { default: { name: "Robinhood Chain Testnet Explorer", url: "https://explorer.testnet.chain.robinhood.com" } },
  testnet: true,
};

const networks = {
  "robinhood-testnet": { chain: robinhoodTestnet, vaultEnv: "NEXT_PUBLIC_VELLUM_ROBINHOOD_TESTNET_VAULT_ADDRESS" },
  sepolia: { chain: sepolia, vaultEnv: "NEXT_PUBLIC_VELLUM_SEPOLIA_VAULT_ADDRESS" },
  robinhood: { chain: robinhood, vaultEnv: "NEXT_PUBLIC_VELLUM_ROBINHOOD_VAULT_ADDRESS" },
  ethereum: { chain: mainnet, vaultEnv: "NEXT_PUBLIC_VELLUM_ETHEREUM_VAULT_ADDRESS" },
};

const networkKey = process.env.VELLUM_DEPLOY_NETWORK ?? "robinhood-testnet";
const deployment = networks[networkKey];
if (!deployment) throw new Error(`Unknown network: ${networkKey}. Use ${Object.keys(networks).join(", ")}.`);
if (!deployment.chain.testnet && process.env.VELLUM_ALLOW_MAINNET_DEPLOY !== "true") {
  throw new Error("Mainnet deployment is locked. Review the deployment, then set VELLUM_ALLOW_MAINNET_DEPLOY=true explicitly.");
}

const privateKey = process.env.VELLUM_DEPLOYER_PRIVATE_KEY;
const guardian = process.env.VELLUM_GUARDIAN_ADDRESS;
if (!privateKey) throw new Error("Missing VELLUM_DEPLOYER_PRIVATE_KEY.");
if (!guardian) throw new Error("Missing VELLUM_GUARDIAN_ADDRESS (use the multisig address, not a personal wallet).");

const source = await readFile(new URL("../contracts/VellumVault.sol", import.meta.url), "utf8");
const output = JSON.parse(solc.compile(JSON.stringify({
  language: "Solidity",
  sources: { "VellumVault.sol": { content: source } },
  settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
})));
const errors = output.errors?.filter((item) => item.severity === "error") ?? [];
if (errors.length) throw new Error(errors.map((item) => item.formattedMessage).join("\n"));

const contract = output.contracts["VellumVault.sol"].VellumVault;
const account = privateKeyToAccount(privateKey);
const rpcUrl = process.env.VELLUM_RPC_URL ?? deployment.chain.rpcUrls.default.http[0];
const walletClient = createWalletClient({ account, chain: deployment.chain, transport: http(rpcUrl) });
const publicClient = createPublicClient({ chain: deployment.chain, transport: http(rpcUrl) });

const hash = await walletClient.deployContract({
  abi: contract.abi,
  bytecode: `0x${contract.evm.bytecode.object}`,
  args: [guardian],
});
const receipt = await publicClient.waitForTransactionReceipt({ hash });
if (!receipt.contractAddress) throw new Error(`Deployment ${hash} did not return a contract address.`);

console.log(`VellumVault deployed on ${deployment.chain.name}`);
console.log(`Contract: ${receipt.contractAddress}`);
console.log(`Set ${deployment.vaultEnv}=${receipt.contractAddress}`);
if (deployment.chain.blockExplorers?.default.url) console.log(`Explorer: ${deployment.chain.blockExplorers.default.url}/address/${receipt.contractAddress}`);
