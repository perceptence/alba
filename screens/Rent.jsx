import { useState } from "react";
import { useAp } from "@/lib/autopayStore";
import { useCharges } from "@/lib/chargeStore";
import { RES, PAYMENTS } from "@/lib/data";
import { money, ord } from "@/lib/util";
import { I } from "@/components/icons";
import { TextLink } from "@/components/TextLink";
import { SettleSheet } from "@/screens/SettleSheet";

export function Rent({ push, onOpenPayments, onOpenPayment, onAutopay, onChangeMethod, openCharges }) {
  const ap=useAp(); const a=ap.get();
  const ch=useCharges(); const dueTotal=ch.dueTotal(); const dueCount=ch.due().length;
  const [settling,setSettling]=useState(false);
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">Residence account</span><div className="ht sf">Rent</div></div>
      <div className="figure">
        <div className="fk">Next payment</div>
        <div className="fv sf num">{money(RES.rent)}</div>
        <div className="fs">{a.on?`Settles 1 August · Autopay · ${a.method.bank} ···· ${a.method.last4}`:"Due 1 August · Settle manually"}</div>
      </div>

      <div className="tline">
        <div className="tbar"><span className="tfill" style={{width:"81%"}}/><span className="tnow" style={{left:"81%"}}/></div>
        <div className="tends"><span>1 Jul · Paid</span><span>1 Aug</span></div>
      </div>

      <div className={"toggle-line"+(a.on?" ap-row":"")}>
        <span><div className="tt sf">Autopay</div><div className="td">{a.on?`From ${a.method.bank} ···· ${a.method.last4} · Runs on the ${ord(a.day)}`:"Rent won't be collected automatically"}</div></span>
        <button className={"tog"+(a.on?" on":"")} role="switch" aria-checked={a.on} onClick={()=>onAutopay(a.on)}><i/></button>
      </div>
      {a.on&&<TextLink onClick={onChangeMethod}>Change payment method</TextLink>}

      <div className="sect">
        <div className="sect-h"><span className="l">Standing</span></div>
        <div className="lrow"><span><div className="lm sf">Balance due today</div>{dueTotal>0&&<div className="ld">{dueCount} charge{dueCount>1?"s":""} outstanding</div>}</span>
          {dueTotal>0?<button className="due-settle" onClick={()=>setSettling(true)}>Settle {money(dueTotal)}</button>:<span className="lv st-g">None</span>}</div>
        <div className="lrow"><span><div className="lm sf">Deposit held</div><div className="ld">In escrow</div></span><span className="lv num">{money(RES.deposit)}</span></div>
        <TextLink onClick={openCharges}>Charges &amp; statements</TextLink>
      </div>
      {settling&&<SettleSheet push={push} onClose={()=>setSettling(false)}/>}

      <div className="sect">
        <div className="sect-h"><span className="l">Payment history</span></div>
        <button className="payrow" onClick={()=>onOpenPayment(PAYMENTS[0].id)}>
          <span className="pm"><div className="pmo sf">{PAYMENTS[0].month}</div><div className="psub">Paid {PAYMENTS[0].paid} · {PAYMENTS[0].via} · {PAYMENTS[0].method}</div></span>
          <span className="pamt num">{money(PAYMENTS[0].amount)}</span>
        </button>
        <TextLink onClick={onOpenPayments}>View all payments</TextLink>
      </div>
      <div style={{height:8}}/>
    </div>
  );
}

export function Payments({ onBack, onOpenPayment }) {
  const years=[...new Set(PAYMENTS.map(p=>p.year))];
  const [year,setYear]=useState(years[0]);
  const list=PAYMENTS.filter(p=>p.year===year);
  const total=list.reduce((sum,p)=>sum+p.amount,0);
  return (<div className="pc stag">
    <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Rent</span></div>
    <div className="phead" style={{paddingTop:24}}><span className="eye">Residence account</span><div className="ht sf">Payment history</div></div>
    <div className="yearsw">{years.map(y=><button key={y} className={"yr"+(y===year?" on":"")} onClick={()=>setYear(y)}>{y}</button>)}</div>
    <div className="pay-sum">{list.length} payments · {money(total)} settled</div>
    <div style={{marginTop:8}}>
      {list.map(pp=>(
        <button key={pp.id} className="payrow" onClick={()=>onOpenPayment(pp.id)}>
          <span className="pm"><div className="pmo sf">{pp.month}</div><div className="psub">Paid {pp.paid}</div></span>
          <span className="pamt num">{money(pp.amount)}</span>
        </button>))}
    </div>
    <div style={{height:8}}/>
  </div>);
}
