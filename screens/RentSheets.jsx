import { useState } from "react";
import { apStore } from "@/lib/autopayStore";
import { PAYMENTS } from "@/lib/data";
import { money, ord } from "@/lib/util";
import { I } from "@/components/icons";

export function PauseSheet({ a, push, onClose }) {
  return (<div className="scrim" onClick={onClose}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">Pause Autopay?</div><div className="sh-sub">Rent · Monthly</div></span>
      <button className="sh-x" onClick={onClose} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <p className="ap-body">Rent won't be collected automatically. You'll need to settle {money(a.amount)} by the {ord(a.day)} of each month — we'll remind you before it's due.</p>
    </div>
    <div className="sh-foot ap-foot">
      <button className="cta" onClick={()=>{apStore.setOn(false);push({t:"Autopay paused",d:"Settle rent manually each month"});onClose();}}>Pause Autopay</button>
      <button className="cta ghost" onClick={onClose}>Keep Autopay on</button>
    </div>
  </div></div>);
}

export function TurnOnSheet({ ap, push, onClose }) {
  const a=ap.get();const methods=ap.methods();
  const [sel,setSel]=useState(a.methodId);
  const confirm=()=>{ap.setMethod(sel);ap.setOn(true);push({t:"Autopay on",d:"Next run · 1 August"});onClose();};
  return (<div className="scrim" onClick={onClose}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">Turn on Autopay</div><div className="sh-sub">Rent · Monthly</div></span>
      <button className="sh-x" onClick={onClose} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{paddingTop:8}}>
      <div className="kvl" style={{marginTop:0}}>
        <div className="kv"><span className="k">Amount</span><span className="v num">{money(a.amount)} / month</span></div>
        <div className="kv"><span className="k">Runs on</span><span className="v">The {ord(a.day)}</span></div>
      </div>
      <div className="flab">Pay from</div>
      {methods.map(m=>(
        <button key={m.id} className="ap-card" onClick={()=>setSel(m.id)}>
          <span className={"ap-radio"+(sel===m.id?" on":"")}/>
          <span className="ap-brand">{m.bank} ···· {m.last4}</span>
          <span className="ap-exp">{m.type}</span>
        </button>))}
    </div>
    <div className="sh-foot">
      <button className="cta" onClick={confirm}>Turn on Autopay</button>
    </div>
  </div></div>);
}

export function MethodSheet({ ap, onClose }) {
  const a=ap.get();const methods=ap.methods();
  const [sel,setSel]=useState(a.methodId);
  return (<div className="scrim" onClick={onClose}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">Payment method</div><div className="sh-sub">For Autopay</div></span>
      <button className="sh-x" onClick={onClose} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{paddingTop:8}}>
      {methods.map(m=>(
        <button key={m.id} className="ap-card" onClick={()=>setSel(m.id)}>
          <span className={"ap-radio"+(sel===m.id?" on":"")}/>
          <span className="ap-brand">{m.bank} ···· {m.last4}</span>
          <span className="ap-exp">{m.type}</span>
        </button>))}
      <p className="ap-note">To add a bank account, contact the estate office.</p>
    </div>
    <div className="sh-foot"><button className="cta" onClick={()=>{ap.setMethod(sel);onClose();}}>Save changes</button></div>
  </div></div>);
}

export function PayDetailSheet({ id, onClose }) {
  const pp=PAYMENTS.find(x=>x.id===id);
  if(!pp)return null;
  return (<div className="scrim" onClick={onClose}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{pp.month}</div><div className="sh-sub">Rent payment</div></span>
      <button className="sh-x" onClick={onClose} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{paddingTop:8}}>
      <div className="kvl">
        <div className="kv"><span className="k">Status</span><span className="v st-g">Paid</span></div>
        <div className="kv"><span className="k">Amount</span><span className="v num">{money(pp.amount)}</span></div>
        <div className="kv"><span className="k">Paid on</span><span className="v">{pp.paid}</span></div>
        <div className="kv"><span className="k">Method</span><span className="v">{pp.method}</span></div>
        <div className="kv"><span className="k">Via</span><span className="v">{pp.via}</span></div>
        <div className="kv"><span className="k">Confirmation</span><span className="v">{pp.conf}</span></div>
      </div>
    </div>
  </div></div>);
}
