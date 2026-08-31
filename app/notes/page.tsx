import DocPage from "../components/DocPage";

export default function Notes() {
  return <DocPage index="02" eyebrow="NOTEBOOK" title={<>A claim you can<em>carry in one view.</em></>} intro="Notes make a position portable without hiding the numbers. Quantity, entry, mark, PnL and maturity remain part of the object." action={{ label: "Open the app", href: "/app" }} facts={[["POSITION", "250,000 ORBIT"], ["STATE", "LOCKED"], ["TRANSFER", "OPEN"], ["UNLOCK", "04 NOV 2026"]]} steps={[["01", "Read", "One note keeps the amount, entry, mark, PnL and maturity in a single view."], ["02", "Carry", "The note is the portable representation of the locked position."], ["03", "Transfer", "Its holder may pass the claim on without moving vault-held tokens."], ["04", "Redeem", "At maturity, the current holder can unwrap the original balance."]]} />;
}
