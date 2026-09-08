import DocPage from "../components/DocPage";

export default function Collateral() {
  return <DocPage index="11" eyebrow="COLLATERAL" title={<>Fixed amount.<em>Visible horizon.</em></>} intro="A bearer note turns a vault-held balance into something a lending pool can inspect: one amount, one selected term, one active claim." action={{ label: "Open the app", href: "/app" }} facts={[["AMOUNT", "250,000 ORBIT"], ["TERM", "90 DAYS"], ["COLLATERAL", "ERC-721 NOTE"], ["CLAIM", "ACTIVE NOW"]]} steps={[["01", "Deposit", "The balance is placed in the vault with one visible amount and selected term."], ["02", "Issue", "Vellum binds those facts into an immediately active bearer note."], ["03", "Use", "A lending venue can inspect the note without moving the underlying balance."], ["04", "Release", "The current holder may unwrap the claim at any time."]]} />;
}
