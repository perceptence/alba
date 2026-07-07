import { useState } from "react";
import { apStore } from "@/lib/autopayStore";
import { PAYMENTS } from "@/lib/data";
import { money, ord } from "@/lib/util";
import { I } from "@/components/icons";
import { useSheet } from "@/components/useSheet";

function ApField({ label, display, sel, options, open, onToggle, onPick }) {
  return (<div className={"drow"+(open?" open":"")}>
    <button className="drow-head" onClick={onToggle}>
      <span className="drow-l sf">{label}</span><span className="drow-v">{display}</span><span className="drow-c"><I.chev/></span>
    </button>
    {open&&<div className="drow-opts rise">{options.map(o=>(
      <button key={o.v} className="drow-opt" onClick={()=>onPick(o.v)}>
        <span className={"ap-radio"+(o.v===sel?" on":"")}/><span className="drow-ot sf">{o.l}</span>
      </button>))}</div>}
  </div>);
}

const AP_DAYS=[1,2,3];

/* One place to manage Autopay — turn it on or off, choose the day of the
   month, pick the account, and save. Opens as a bottom sheet / right panel,
   so the Autopay section on Payments stays a summary + link like the rest. */
export function AutopaySheet({ push, onClose }) {
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const a=apStore.get();const methods=apStore.methods();
  const [on,setOn]=useState(a.on);
  const [methodId,setMethodId]=useState(a.methodId);
  const [day,setDay]=useState(a.day);
  const [openF,setOpenF]=useState(null);
  const tog=(k)=>setOpenF(o=>o===k?null:k);
  const method=methods.find(m=>m.id===methodId);
  const save=()=>{apStore.save({on,methodId,day});push({t:"Autopay updated",d:on?`Runs on the ${ord(day)} of each month`:"Turned off — pay manually"});close();};
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">Autopay</div><div className="sh-sub">Rent · {money(a.amount)} / month</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{paddingTop:8}}>
      <div className="toggle-line" style={{marginTop:0}}>
        <span><div className="tt sf">Collect automatically</div><div className="td">{on?"Drawn from your account each month":"Off · pay manually"}</div></span>
        <button className={"tog"+(on?" on":"")} role="switch" aria-checked={on} onClick={()=>setOn(v=>!v)}><i/></button>
      </div>
      {on&&<div className="det" style={{marginTop:0}}>
        <ApField label="Runs on the" display={ord(day)} sel={day} options={AP_DAYS.map(d=>({v:d,l:ord(d)+" of the month"}))} open={openF==="day"} onToggle={()=>tog("day")} onPick={(v)=>{setDay(v);setOpenF(null);}}/>
        <ApField label="Payment method" display={method.bank+" ···· "+method.last4} sel={methodId} options={methods.map(m=>({v:m.id,l:m.bank+" ···· "+m.last4}))} open={openF==="method"} onToggle={()=>tog("method")} onPick={(v)=>{setMethodId(v);setOpenF(null);}}/>
      </div>}
    </div>
    <div className="sh-foot"><button className="cta" onClick={save}>Save changes</button></div>
  </div></div>);
}

export function PayDetailSheet({ id, onClose }) {
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const pp=PAYMENTS.find(x=>x.id===id);
  if(!pp)return null;
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{pp.month}</div><div className="sh-sub">Rent payment</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{paddingTop:8}}>
      <div className="kvl" style={{marginTop:0}}>
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
