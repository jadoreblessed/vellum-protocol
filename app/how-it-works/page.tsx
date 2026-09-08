import DocPage from "../components/DocPage";

export default function HowItWorks() {
  return <DocPage index="01" eyebrow="FLOW" title={<>From balance<em>to bearer instrument.</em></>} intro="Vellum gives a token position a lifecycle that can be read, moved and claimed. Every transition leaves a visible checkpoint." action={{ label: "Launch app", href: "/app" }} facts={[["INPUT", "ERC-20 BALANCE"], ["OUTPUT", "ERC-721 NOTE"], ["TERM", "CHOSEN UPFRONT"], ["CLAIM", "ACTIVE AT MINT"]]} steps={[["01", "Fund", "Choose an ERC-20 and specify the amount to place in the vault."], ["02", "Compose", "Select a term and preview the note before the transaction is signed."], ["03", "Circulate", "The note is a transferable claim with the position facts attached."], ["04", "Release", "The current holder may unwrap the underlying balance immediately."]]} />;
}
