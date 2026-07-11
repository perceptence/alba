import { useState } from "react";
import { useCharges, chargeStore, CHARGE_STATUS, STATEMENTS, stmtTotal, stmtOf } from "@/lib/chargeStore";
import { RES } from "@/lib/data";
import { money } from "@/lib/util";
import { I } from "@/components/icons";
import { useSheet } from "@/components/useSheet";
import { SettleSheet } from "@/screens/SettleSheet";

/* Charges & statements — money beyond rent. A balance summary, the list of
   incidental charges, monthly statements, and the deposit on record. */

export function Charges({ onBack, push }) {
  const c = useCharges();
  const [openC, setOpenC] = useState(null);
  const [openS, setOpenS] = useState(null);
  const [settling, setSettling] = useState(false);
  const charges = c.all();
  const dueTotal = c.dueTotal();
  return (
    <div className="pc stag">
      <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Charges &amp; statements</span></div>
      <div className="phead"><span className="eye">Beyond rent</span><div className="ht sf">Charges</div></div>

      {dueTotal > 0
        ? <div className="chg-bal chg-bal-due">
            <span className="chg-bal-m"><span className="chg-bal-l">Outstanding</span><span className="chg-bal-v sf num">{money(dueTotal)}</span></span>
            <button className="chg-settle" onClick={() => setSettling(true)}>Settle now</button>
          </div>
        : <div className="chg-bal">
            <span className="chg-bal-ic"><I.seal/></span>
            <span className="chg-bal-m"><span className="chg-bal-t sf">Nothing outstanding</span><span className="chg-bal-d">Every charge is settled</span></span>
          </div>}

      <div className="sect"><div className="sect-h"><span className="l">Recent charges</span></div>
        {charges.map((ch) => {
          const st = CHARGE_STATUS[ch.status];
          return (
            <button key={ch.id} className="chg" onClick={() => setOpenC(ch.id)}>
              <span className="chg-m"><span className="chg-l sf">{ch.label}</span><span className="chg-d">{ch.detail} · {ch.date}</span></span>
              <span className="chg-r"><span className="chg-amt num">{money(ch.amount)}</span><span className={"gpill gpill-" + st.tone}>{st.label}</span></span>
            </button>
          );
        })}
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Statements</span></div>
        {STATEMENTS.map((s) => (
          <button key={s.id} className="chg" onClick={() => setOpenS(s.id)}>
            <span className="chg-m"><span className="chg-l sf">{s.period}</span><span className="chg-d">Rent{s.extras.length ? " + " + s.extras.length + " item" + (s.extras.length > 1 ? "s" : "") : ""} · Paid {s.paid}</span></span>
            <span className="chg-r chg-r-row"><span className="chg-amt num">{money(stmtTotal(s))}</span><span className="chg-chev"><I.chev/></span></span>
          </button>
        ))}
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Security deposit</span></div>
        <div className="kvl">
          <div className="kv"><span className="k">Amount</span><span className="v num">{money(RES.deposit)}</span></div>
          <div className="kv"><span className="k">Held by</span><span className="v">City National Trust, in escrow</span></div>
          <div className="kv"><span className="k">Returned</span><span className="v">Within 21 days of move-out</span></div>
        </div>
      </div>

      <div style={{height:8}}/>
      {settling && <SettleSheet push={push} onClose={() => setSettling(false)}/>}
      {openC && <ChargeDetail id={openC} push={push} onClose={() => setOpenC(null)}/>}
      {openS && <StatementDetail id={openS} onClose={() => setOpenS(null)}/>}
    </div>
  );
}

function ChargeDetail({ id, push, onClose }) {
  const c = useCharges();
  const ch = c.get(id);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  if (!ch) return null;
  const st = CHARGE_STATUS[ch.status];
  const settle = () => { chargeStore.settle(id); push({ t: "Charge settled", d: ch.label }); close(); };
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{ch.label}</div><div className="sh-sub">Charge · {ch.date}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <div className="chg-figure"><span className="chg-figure-v sf num">{money(ch.amount)}</span><span className={"gpill gpill-" + st.tone}>{st.label}</span></div>
      <div className="kvl">
        <div className="kv"><span className="k">For</span><span className="v">{ch.detail}</span></div>
        <div className="kv"><span className="k">Date</span><span className="v">{ch.date}</span></div>
        <div className="kv"><span className="k">{ch.status === "due" ? "Status" : "Settled by"}</span><span className="v">{ch.status === "due" ? "Awaiting settlement" : ch.via}</span></div>
      </div>
    </div>
    {ch.status === "due" && <div className="sh-foot"><button className="cta" onClick={settle}>Settle {money(ch.amount)}</button></div>}
  </div></div>);
}

function StatementDetail({ id, onClose }) {
  const s = stmtOf(id);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  if (!s) return null;
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{s.period}</div><div className="sh-sub">Statement · Paid {s.paid}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <div className="kvl">
        <div className="kv"><span className="k">Rent</span><span className="v num">{money(s.rent)}</span></div>
        {s.extras.map(([label, amt]) => (
          <div className="kv kv-line" key={label}><span className="k">{label}</span><span className="v num">{money(amt)}</span></div>
        ))}
        <div className="kv chg-total"><span className="k">Total</span><span className="v num">{money(stmtTotal(s))}</span></div>
      </div>
      <p className="ga-fine">Settled {s.paid} by autopay · City National ···· 4291.</p>
    </div>
  </div></div>);
}
