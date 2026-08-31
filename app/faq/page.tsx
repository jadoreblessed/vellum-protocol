import DocPage from "../components/DocPage";

export default function Faq() {
  return <DocPage index="16" eyebrow="FAQ" title={<>Questions before<em>the first note.</em></>} intro="The short version: the ERC-721 note moves, its claim follows the current holder, and the underlying balance stays in the vault." action={{ label: "Read docs", href: "/docs" }} facts={[["WHAT MOVES", "THE ERC-721 NOTE"], ["WHO UNWRAPS", "CURRENT HOLDER"], ["TERMS", "IMMUTABLE"], ["STATE", "ONCHAIN"]]} steps={[["01", "What moves?", "The ERC-721 note moves; the underlying balance does not leave the vault."], ["02", "Who can unwrap?", "The current holder can unwrap once the note reaches maturity."], ["03", "Can terms change?", "No. A note carries an immutable term from the moment it is issued."], ["04", "What is priced?", "Entry uses a pool TWAP while contract state and transfers remain readable onchain."]]} />;
}
