import { useState } from "react";
import { I } from "@/components/icons";
import { money } from "@/lib/util";
import { RES, ADRIEN } from "@/lib/data";

export function Alerts() {
  const [read,setRead]=useState({});
  const items=[
    {id:"a1",ic:"seal",t:"July rent settled",d:"Autopay processed "+money(RES.rent)+" on 1 July. Thank you.",w:"3 days ago",unread:false},
    {id:"a3",ic:"wrench",t:"Pool technician confirmed",d:"Heater service Thursday 9 July, morning window. Entry approved.",w:"Today",unread:true},
    {id:"a2",ic:"leaf",t:"Grounds refreshed Thursday",d:"Landscaping visits Thursday 10 July, morning. No indoor access needed.",w:"Yesterday",unread:true},
    {id:"a4",ic:"renew",t:"Lease renewal ahead",d:"Your term concludes "+ADRIEN.leaseEnd+". Rosa will share renewal terms closer to the date.",w:"2 days ago",unread:false},
  ];
  return (<div className="pc stag">
    <div className="phead"><span className="eye">The estate</span><div className="ht sf">Notices</div></div>
    <div className="sect" style={{marginTop:24}}>
    {items.map(a=>{const Ico=I[a.ic];const un=a.unread&&!read[a.id];return(
      <button key={a.id} className="arow" onClick={()=>setRead(x=>({...x,[a.id]:true}))}>
        <span className="ai"><Ico/></span>
        <span style={{flex:1,minWidth:0}}><div className="at sf">{a.t}{un&&<span className="bnew"/>}</div><div className="ad">{a.d}</div><div className="aw">{a.w}</div></span>
      </button>);})}
    </div>
    <div style={{height:8}}/>
  </div>);
}
