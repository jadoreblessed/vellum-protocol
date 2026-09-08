import DocPage from "../components/DocPage";

export default function Vesting() {
  return <DocPage index="12" eyebrow="TEAM ALLOCATIONS" title={<>Make allocations<em>public and portable.</em></>} intro="Team and KOL allocations become transparent bearer notes with visible selected terms. The term is disclosure metadata; the holder may claim immediately." action={{ label: "Read docs", href: "/docs" }} facts={[["ALLOCATION", "VAULT HELD"], ["TERM", "IMMUTABLE"], ["DISCLOSURE", "ON THE NOTE"], ["CLAIM", "ACTIVE NOW"]]} steps={[["T0", "Deposit", "The allocation enters the vault."], ["T1", "Record", "The selected term becomes immutable metadata."], ["T2", "Transfer", "The claim can move with the note."], ["T3", "Release", "The current holder unwraps whenever they choose."]]} />;
}
