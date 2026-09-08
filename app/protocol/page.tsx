import DocPage from "../components/DocPage";

export default function Protocol() {
  return <DocPage index="03" eyebrow="PROTOCOL" title={<>The vault is<em>the source of truth.</em></>} intro="No admin dashboard changes the note. State is derived from the contract and transfer history." action={{ label: "Read docs", href: "/docs" }} facts={[["CUSTODY", "IMMUTABLE VAULT"], ["STANDARD", "ERC-721 NOTE"], ["TRANSFER", "PERMISSIONLESS"], ["UNWRAP", "HOLDER ONLY"]]} steps={[["01", "Deposit", "A supported balance enters immutable vault custody."], ["02", "Issue", "The contract mints an immediately claimable bearer note with the position facts attached."], ["03", "Transfer", "Ownership moves permissionlessly while the vault balance remains unchanged."], ["04", "Unwrap", "The current holder can burn the note at any time to release the balance."]]} />;
}
