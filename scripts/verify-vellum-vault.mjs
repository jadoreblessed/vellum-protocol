import { readFile } from "node:fs/promises";
import solc from "solc";

const source = await readFile(new URL("../contracts/VellumVault.sol", import.meta.url), "utf8");
const output = JSON.parse(solc.compile(JSON.stringify({
  language: "Solidity",
  sources: { "VellumVault.sol": { content: source } },
  settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
})));
const errors = output.errors?.filter((item) => item.severity === "error") ?? [];
if (errors.length) throw new Error(errors.map((item) => item.formattedMessage).join("\n"));

const contract = output.contracts["VellumVault.sol"].VellumVault;
if (!contract.evm.bytecode.object) throw new Error("VellumVault bytecode was not emitted.");

const functions = new Set(contract.abi.filter((item) => item.type === "function").map((item) => item.name));
for (const required of ["wrap", "claim", "setWrapsPaused", "proposeGuardian", "acceptGuardian", "transferFrom", "safeTransferFrom"]) {
  if (!functions.has(required)) throw new Error(`Missing required function: ${required}`);
}
for (const forbidden of ["selfdestruct", "delegatecall", "upgradeTo", "withdraw"]) {
  if (source.includes(forbidden)) throw new Error(`Forbidden production-vault primitive found: ${forbidden}`);
}
if (!source.includes("received == amount")) throw new Error("Exact-balance accounting guard is missing.");
if (!source.includes("function claim") || !source.includes("_safeTransfer(token, owner, amount)")) throw new Error("Claim payout path is missing.");

console.log("VellumVault compile and interface checks passed.");
