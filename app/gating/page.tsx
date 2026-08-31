import DocPage from "../components/DocPage";

export default function Gating() {
  return <DocPage index="13" eyebrow="CONVICTION GATING" title={<>Amount × term<em>becomes a signal.</em></>} intro="Airdrops, whitelists and access can use the note itself: amount, remaining term and entry are visible and independently verifiable." action={{ label: "Try it", href: "/app" }} facts={[["AMOUNT", "NOTE BALANCE"], ["TERM", "REMAINING TIME"], ["ENTRY", "VISIBLE"], ["PROOF", "VERIFIABLE"]]} steps={[["01", "Read", "A gate reads the amount and remaining term directly from the note."], ["02", "Verify", "The note’s contract state proves that the position is active."], ["03", "Qualify", "Access rules turn visible conviction into a transparent threshold."], ["04", "Update", "As the holder or term changes, the signal updates without a separate list."]]} />;
}
