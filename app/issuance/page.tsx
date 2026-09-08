import DocPage from "../components/DocPage";

export default function Issuance() {
  return <DocPage index="01" eyebrow="ISSUANCE" title={<>One deposit.<em>One document.</em></>} intro="Vellum measures the balance that arrives, holds it inside a deterministic vault and mints a single bearer note with every important fact attached." facts={[["INPUT", "ERC-20 POSITION"], ["RECORD", "ACTUAL BALANCE"], ["PRICE", "ENTRY TWAP"], ["OUTPUT", "ERC-721 NOTE"]]} steps={[["01", "Deposit", "Choose a token and send the amount to the vault. The recorded balance is the amount that actually arrived."], ["02", "Measure", "The protocol stores quantity, entry price, term and provenance as one readable state."], ["03", "Mint", "One immediately claimable note represents the vault-held position."], ["04", "Verify", "Anyone can inspect the note and compare it with the underlying vault balance."]]} />;
}
