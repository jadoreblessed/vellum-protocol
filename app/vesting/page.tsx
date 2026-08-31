import DocPage from "../components/DocPage";

export default function Vesting() {
  return <DocPage index="12" eyebrow="TEAM VESTING" title={<>Make allocations<em>public and timed.</em></>} intro="Team and KOL allocations become transparent bearer notes with visible terms. The note is the disclosure." action={{ label: "Read docs", href: "/docs" }} facts={[["ALLOCATION", "VAULT HELD"], ["TERM", "IMMUTABLE"], ["DISCLOSURE", "ON THE NOTE"], ["CLAIM", "AT MATURITY"]]} steps={[["T0", "Deposit", "The allocation enters the vault."], ["T1", "Lock", "The vesting term becomes immutable."], ["T2", "Transfer", "The claim can move with the note."], ["T3", "Release", "The holder unwraps at maturity."]]} />;
}
