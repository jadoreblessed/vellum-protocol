import DocPage from "../components/DocPage";

export default function Transfer() {
  return <DocPage index="14" eyebrow="TRANSFER" title={<>Move the note.<em>Leave the tokens.</em></>} intro="Transfer is an ordinary ERC-721 movement. Ownership changes hands while the vault balance, entry and maturity remain intact." action={{ label: "Open sample", href: "/app/note" }} facts={[["WALLET A", "CURRENT HOLDER"], ["TRANSFER", "PERMISSIONLESS"], ["WALLET B", "NEW CLAIMANT"], ["VAULT", "NO BALANCE MOVEMENT"]]} steps={[["01", "Read", "A buyer reads the note’s amount, term and provenance before accepting it."], ["02", "Transfer", "The ERC-721 moves from the current wallet to the next holder."], ["03", "Carry", "The vault balance and maturity remain intact after the movement."], ["04", "Claim", "At maturity, the new holder owns the right to unwrap."]]} />;
}
