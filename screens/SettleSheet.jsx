import { useState } from "react";
import { useCharges, chargeStore } from "@/lib/chargeStore";
import { useAp } from "@/lib/autopayStore";
import { money } from "@/lib/util";
import { I } from "@/components/icons";
import { useSheet } from "@/components/useSheet";

/* Settle outstanding charges — a summary flyout with a payment-method
   choice, confirmed before anything is charged. Shared by Rent and Charges. */

export function SettleSheet({ push, onClose }) {
  const c = useCharges();
  const ap = useAp();
  const due = c.due();
  const total = c.dueTotal();
  const methods = ap.methods();
  const [sel, setSel] = useState(ap.get().methodId);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const confirm = () => {
    const m = methods.find((x) => x.id === sel);
    chargeStore.settleAll();
    push({ t: "Charges settled", d: money(total) + " · " + m.bank + " ···· " + m.last4 });
    close();
  };
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">Settle charges</div><div className="sh-sub">{due.length} charge{due.length > 1 ? "s" : ""} · one payment</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{paddingTop:8}}>
      <div className="flab" style={{marginTop:0}}>Charges</div>
      <div className="kvl" style={{marginTop:0}}>
        {due.map((ch) => (
          <div className="kv kv-line" key={ch.id}><span className="k">{ch.label}<span className="chg-d">{ch.detail} · {ch.date}</span></span><span className="v num">{money(ch.amount)}</span></div>
        ))}
        <div className="kv chg-total"><span className="k">Total</span><span className="v num">{money(total)}</span></div>
      </div>
      <div className="flab">Pay from</div>
      {methods.map((m) => (
        <button key={m.id} className="ap-card" onClick={() => setSel(m.id)}>
          <span className={"ap-radio" + (sel === m.id ? " on" : "")}/>
          <span className="ap-brand">{m.bank} ···· {m.last4}</span>
          <span className="ap-exp">{m.type}</span>
        </button>))}
    </div>
    <div className="sh-foot"><button className="cta" onClick={confirm}>Pay {money(total)}</button></div>
  </div></div>);
}
