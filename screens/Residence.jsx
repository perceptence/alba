import { useState } from "react";
import { RES, DOCS, ADRIEN } from "@/lib/data";
import { Elevation } from "@/components/Elevation";
import { ManagerPresence } from "@/components/ManagerPresence";
import { TextLink } from "@/components/TextLink";
import { I } from "@/components/icons";

export function Residence({ onBack, go }) {
  const [open,setOpen]=useState(null);
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
      <div className="tline" style={{marginTop:0}}><div className="tbar"><span className="tfill" style={{width:"81%"}}/><span className="tnow" style={{left:"81%"}}/></div>
        <div className="tends"><span>{ADRIEN.moveIn}</span><span>{ADRIEN.leaseEnd}</span></div></div>
      <div className="lrow" style={{marginTop:16}}><span><div className="lm sf">8 months remaining</div><div className="ld">Renewal opens December 2026</div></span><span className="lv num">2027</span></div>
    </div>

    <div className="sect"><div className="sect-h"><span className="l">Documents</span></div>
      {DOCS.map((d,i)=>(<span key={d.t}>
        <button className={"doc"+(open===i?" open":"")+(i===DOCS.length-1?" last":"")} onClick={()=>setOpen(open===i?null:i)}><span className="dl sf">{d.t}</span><span className="dc"><I.chev/></span></button>
        {open===i&&<div className="docb rise">{d.d}</div>}
      </span>))}
    </div>

    <div className="sect"><div className="sect-h"><span className="l">Your manager</span></div>
      <div className="mgr-block">
        <ManagerPresence large/>
        <TextLink onClick={()=>go("concierge")}>Message Rosa</TextLink>
      </div>
    </div>
    <div style={{height:8}}/>
  </div>);
}
