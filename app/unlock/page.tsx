import DocPage from "../components/DocPage";

export default function Unlock() {
  return <DocPage index="15" eyebrow="UNWRAP" title={<>Burn the note.<em>Release the balance.</em></>} intro="Once claimable, the holder can unwrap. The note is burned, the underlying tokens are released and the lifecycle closes." action={{ label: "Launch app", href: "/app" }} facts={[["STATE", "CLAIMABLE"], ["CALLER", "CURRENT HOLDER"], ["NOTE", "BURNED"], ["RESULT", "BALANCE RELEASED"]]} steps={[["01", "Mature", "The term reaches its unlock date."], ["02", "Claim", "The current holder starts the unwrap transaction."], ["03", "Burn", "The bearer note is destroyed as the claim is exercised."], ["04", "Release", "The vault sends the underlying tokens and closes the lifecycle."]]} />;
}
