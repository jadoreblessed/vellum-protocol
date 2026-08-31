import DocPage from "../components/DocPage";

export default function Collateral() {
  return <DocPage index="11" eyebrow="COLLATERAL" title={<>Fixed amount.<em>Known maturity.</em></>} intro="A locked note turns a long-tail balance into something a lending pool can price: one amount, one term, one claim." action={{ label: "Open the app", href: "/app" }} facts={[["AMOUNT", "250,000 ORBIT"], ["TERM", "90 DAYS"], ["COLLATERAL", "ERC-721 NOTE"], ["CLAIM", "HOLDER ONLY"]]} steps={[["01", "Lock", "The balance is placed in the vault with one visible amount and end date."], ["02", "Issue", "Vellum binds those facts into a bearer note."], ["03", "Use", "A lending venue can price the note without moving the underlying balance."], ["04", "Release", "At maturity, the current holder may unwrap the claim."]]} />;
}
