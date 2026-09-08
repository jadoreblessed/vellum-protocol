import DocPage from "../components/DocPage";

export default function Faq() {
  return <DocPage index="16" eyebrow="FAQ" title={<>Questions before<em>the first note.</em></>} intro="The short version: the ERC-721 note moves, its claim follows the current holder, and the underlying balance stays in the vault until claimed." action={{ label: "Read docs", href: "/docs" }} facts={[["WHAT MOVES", "THE ERC-721 NOTE"], ["WHO UNWRAPS", "CURRENT HOLDER"], ["CLAIM", "IMMEDIATE"], ["STATE", "ONCHAIN"]]} steps={[["01", "What moves?", "The ERC-721 note moves; the underlying balance remains in the vault."], ["02", "Who can unwrap?", "The current holder can unwrap immediately after the note is issued."], ["03", "Can terms change?", "No. A note carries its selected term from the moment it is issued."], ["04", "What is the term?", "It is immutable onchain metadata and does not delay the holder's claim."]]} />;
}
