import DocPage from "../components/DocPage";

export default function Maturity(){return <DocPage index="04" eyebrow="MATURITY" title={<>Locked now.<em>Claimable later.</em></>} intro="The term is part of the instrument. It creates a simple promise: the note can travel, but the balance cannot be released before its unlock date." facts={[["DEPOSIT","06 AUG 2026"],["TERM","90 DAYS"],["REMAINING","90 DAYS"],["UNLOCK","04 NOV 2026"]]} steps={[["01","Lock","The note records a fixed term at issuance. It cannot be edited by an admin."],["02","Carry","The holder may transfer the note while the countdown continues in the vault."],["03","Mature","At day zero the state changes from locked to claimable."],["04","Release","The current holder can unwrap and receive the underlying position."]]}/>}

