import { useState, useEffect } from "react";
import { useCx, cxGuess, CX_CATS, cxSub } from "@/lib/conciergeStore";
import { RM } from "@/lib/util";
import { I } from "@/components/icons";
import { ManagerPresence } from "@/components/ManagerPresence";
import { TextLink } from "@/components/TextLink";

const CX_PROMPTS=["The pool heater is acting up…","Could we have fresh linens on Thursday?","When does the gate code change?","A package needs collecting…","Could a guest have access this weekend?"];

export function Concierge({ onCompose, onOpen, onOpenPast }) {
  const cx=useCx();const reqs=cx.all();const[ask,setAsk]=useState("");
  const [ph,setPh]=useState(0);
  useEffect(()=>{if(RM)return;const t=setInterval(()=>setPh(n=>(n+1)%CX_PROMPTS.length),3600);return()=>clearInterval(t);},[]);
  const [showPast,setShowPast]=useState(false);
  const rank={in_progress:0,scheduled:1,acknowledged:2,submitted:3};
  const open=reqs.filter(r=>r.status!=="resolved"&&r.status!=="cancelled")
    .sort((a,b)=>{const au=cx.isUnread(a.id)?0:1,bu=cx.isUnread(b.id)?0:1;if(au!==bu)return au-bu;return (rank[a.status]??9)-(rank[b.status]??9);});
  const past=reqs.filter(r=>r.status==="resolved"||r.status==="cancelled");
  const send=()=>{const t=ask.trim();if(!t)return;onCompose({preset:cxGuess(t),note:t});setAsk("");};
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">At your service</span><div className="ht sf">Concierge</div></div>
      <div className="assist">
        <ManagerPresence/>
        <div className="q sf">How may we help?</div>
        <div className="ask">
          <input value={ask} onChange={e=>setAsk(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}} placeholder={CX_PROMPTS[ph]}/>
          <button className="snd" onClick={send} aria-label="Send"><I.send/></button>
        </div>
      </div>

      <div className="sect" style={{marginTop:40}}>
        <div className="sect-h"><span className="l">In care of the estate</span></div>
        {open.length===0&&<div className="calm"><I.leaf/>Nothing in care — we're all yours.</div>}
        {open.map(r=><ReqRow key={r.id} r={r} onOpen={onOpen} unread={cx.isUnread(r.id)}/>)}
      </div>

      {past.length>0&&<div className="sect" style={{marginTop:24}}>
        <button className={"pastlink"+(showPast?" open":"")} onClick={()=>setShowPast(v=>!v)}>Past · {past.length}<I.chev/></button>
        {showPast&&<div style={{marginTop:12}}>
          {past.slice(0,6).map(r=><ReqRow key={r.id} r={r} onOpen={onOpen} unread={cx.isUnread(r.id)}/>)}
          {past.length>6&&<TextLink onClick={onOpenPast}>View all {past.length} past requests</TextLink>}
        </div>}
      </div>}
      <div style={{height:8}}/>
    </div>
  );
}

export function PastRequests({ onBack, onOpen }) {
  const cx=useCx();const reqs=cx.all();
  const past=reqs.filter(r=>r.status==="resolved"||r.status==="cancelled");
  const years=[...new Set(past.map(r=>r.year))].sort((a,b)=>b-a);
  const [year,setYear]=useState(years[0]);
  const list=past.filter(r=>r.year===year);
  return (<div className="pc stag">
    <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Concierge</span></div>
    <div className="phead" style={{paddingTop:24}}><span className="eye">At your service</span><div className="ht sf">Past requests</div></div>
    <div className="yearsw">{years.map(y=><button key={y} className={"yr"+(y===year?" on":"")} onClick={()=>setYear(y)}>{y}</button>)}</div>
    <div className="pay-sum">{list.length} resolved in {year}</div>
    <div style={{marginTop:8}}>{list.map(r=><ReqRow key={r.id} r={r} onOpen={onOpen} unread={cx.isUnread(r.id)}/>)}</div>
    <div style={{height:8}}/>
  </div>);
}

export function ReqRow({ r, onOpen, unread }) {
  const sub=cxSub(r);
  const lead=unread?{word:"Rosa replied",tint:"a",detail:""}:sub;
  return (
    <button className="rrow" onClick={()=>onOpen(r.id)}>
      <span className="rrow-m">
        <div className="reye">{CX_CATS[r.category].tag}</div>
        <div className="rt sf">{r.title}</div>
        <div className="rsub"><span className={"cxt-"+lead.tint}>{lead.word}</span>{lead.detail?" · "+lead.detail:""}</div>
      </span>
      <span className="rchev"><I.chev/></span>
    </button>);
}
