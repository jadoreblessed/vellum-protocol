import DocPage from "../components/DocPage";

export default function Docs() {
  return <DocPage index="04" eyebrow="DOCUMENTATION" title={<>Read the<em>instrument.</em></>} intro="Vellum is designed to make every position legible: the balance, the right to claim it, its route and its maturity." action={{ label: "Launch app", href: "/app" }} facts={[["STANDARD", "ERC-721 NOTE"], ["CUSTODY", "VAULT HELD"], ["TRANSFER", "PERMISSIONLESS"], ["STATE", "ONCHAIN"]]} steps={[["01", "Concept", "Positions and notes are different: the note carries the claim, not the balance."], ["02", "Note standard", "Amount, entry, term, supply share and provenance remain attached."], ["03", "Contract surface", "Wrap, transfer and unwrap describe the full lifecycle of the instrument."], ["04", "Safety", "Read the supported token behaviours and the assumptions behind pricing."]]} />;
}
