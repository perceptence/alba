import { useState, useMemo } from "react";
import { RES, DOCS, LEASE } from "@/lib/data";
import { Elevation } from "@/components/Elevation";
import { ManagerPresence } from "@/components/ManagerPresence";
import { TextLink } from "@/components/TextLink";
import { I } from "@/components/icons";
import { norm, money } from "@/lib/util";
import { DocReader } from "@/screens/DocReader";
import { useGuests } from "@/lib/guestStore";
import { useRenewal, RENEWAL } from "@/lib/renewalStore";

const docMatches = (d, q) => {
  if (!q) return true;
  const t = norm(q);
  if (norm(d.t).includes(t) || norm(d.summary).includes(t)) return true;
  if ((d.sections || []).some((s) => norm(s.h).includes(t) || (s.p && norm(s.p).includes(t)) ||
    (s.kv && s.kv.some(([k, v]) => norm(k).includes(t) || norm(v).includes(t))))) return true;
  if ((d.rooms || []).some((r) => norm(r.name).includes(t))) return true;
  return false;
};

export function Residence({ onBack, go, onAsk, openGuests, openRenewal }) {
  const [open,setOpen]=useState(null);
  const [docQ,setDocQ]=useState("");
  const docs=useMemo(()=>DOCS.filter((d)=>docMatches(d,docQ)),[docQ]);
  const guests=useGuests();
  const gCount=guests.all().filter((p)=>p.status!=="revoked").length;
  const rst=useRenewal().status();
  const rnw=rst==="accepted"?{s:"Renewal accepted · new term from "+RENEWAL.newStart, pill:"g", pl:"Renewed"}
    :rst==="declined"?{s:"Not renewing · term ends "+LEASE.termEnd, pill:"n", pl:"Ending"}
    :{s:"Renewal offer to review · "+RENEWAL.termLength+" at "+money(RENEWAL.proposedRent)+"/mo", pill:"a", pl:"Review"};
  return (<div className="pc stag">
    <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Residence</span></div>
    <div style={{marginTop:20}}><Elevation h={160}/></div>
    <div className="res-name sf" style={{fontSize:36,marginTop:24}}>{RES.name}</div>
    <div className="res-meta">{RES.kind} · {RES.city}</div>
    <div className="res-meta num" style={{marginTop:8,color:"var(--grey-2)"}}>{RES.beds} bed · {RES.baths} bath · {RES.area} m²</div>

    <div className="sect"><div className="sect-h"><span className="l">About</span></div><p className="about">{RES.about}</p></div>

    <div className="sect"><div className="sect-h"><span className="l">Amenities</span></div>
      <div className="amen">{RES.amenities.map(([a,b])=>(<div key={a} className="am-r"><span className="sf">{a}</span><span className="ld" style={{fontSize:12,fontWeight:500,letterSpacing:".04em",color:"var(--grey-2)"}}>{b}</span></div>))}</div>
    </div>

    <div className="sect"><div className="sect-h"><span className="l">Lease</span></div>
      <div className="tline" style={{marginTop:0}}><div className="tbar"><span className="tfill" style={{width:LEASE.progress+"%"}}/><span className="tnow" style={{left:LEASE.progress+"%"}}/></div>
        <div className="tends"><span>{LEASE.termStart}</span><span>{LEASE.termEnd}</span></div></div>
      <button className="lease-review" onClick={openRenewal}>
        <span className="lease-review-m">
          <div className="lm sf">{LEASE.remaining} months remaining</div>
          <div className="ld">{rnw.s}</div>
        </span>
        <span className="lease-review-r"><span className={"gpill gpill-"+rnw.pill}>{rnw.pl}</span><I.chev/></span>
      </button>
    </div>

    <div className="sect"><div className="sect-h"><span className="l">Access &amp; guests</span></div>
      <button className="grow" onClick={openGuests}>
        <span className="gm">
          <span className="gtop"><span className="gl">Guest passes</span></span>
          <div className="gt sf">{gCount} active</div>
          <div className="gs">Grant time-boxed entry to the gate &amp; door</div>
        </span>
        <span className="gc"><I.chev/></span>
      </button>
    </div>

    <div className="sect"><div className="sect-h"><span className="l">Documents</span></div>
      <div className="dr-search"><I.search/>
        <input value={docQ} onChange={(e)=>setDocQ(e.target.value)} placeholder="Search your documents"/>
        {docQ&&<button className="dr-clear" onClick={()=>setDocQ("")} aria-label="Clear search"><I.close/></button>}
      </div>
      {docs.length===0&&<div className="calm"><I.search/>No documents match "{docQ}"</div>}
      {docs.map((d,i)=>(
        <button key={d.id} className={"doc"+(i===docs.length-1?" last":"")} onClick={()=>setOpen(d.id)}>
          <span style={{flex:1,minWidth:0}}>
            <span className="dl sf">{d.t}</span>
            <span className="doc-sum">{d.summary}</span>
          </span>
          <span className="dc"><I.chev/></span>
        </button>
      ))}
    </div>

    <div className="sect"><div className="sect-h"><span className="l">Your manager</span></div>
      <div className="mgr-block">
        <ManagerPresence large/>
        <TextLink onClick={()=>go("concierge")}>Message Rosa</TextLink>
      </div>
    </div>
    <div style={{height:8}}/>
    {open&&<DocReader doc={DOCS.find((d)=>d.id===open)} onClose={()=>setOpen(null)} onAsk={onAsk}/>}
  </div>);
}
