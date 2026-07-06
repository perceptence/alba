import { useState } from "react";
import { I } from "@/components/icons";
import { money } from "@/lib/util";
import { RES, ADRIEN } from "@/lib/data";
import { useSheet } from "@/components/useSheet";

/* Notices — a bottom sheet opened from the Home bell (dismiss via the
   scrim or the close button). */
export function NoticesSheet({ onClose }) {
  const [read,setRead]=useState({});
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const items=[
    {id:"a1",ic:"seal",t:"July rent settled",d:"Autopay processed "+money(RES.rent)+" on 1 July. Thank you.",w:"3 days ago",unread:false},
    {id:"a3",ic:"wrench",t:"Pool technician confirmed",d:"Heater service Thursday 9 July, morning window. Entry approved.",w:"Today",unread:true},
    {id:"a2",ic:"leaf",t:"Grounds refreshed Thursday",d:"Landscaping visits Thursday 10 July, morning. No indoor access needed.",w:"Yesterday",unread:true},
    {id:"a4",ic:"renew",t:"Lease renewal ahead",d:"Your term concludes "+ADRIEN.leaseEnd+". Rosa will share renewal terms closer to the date.",w:"2 days ago",unread:false},
  ];
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">Notices</div><div className="sh-sub">The estate</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      {items.map(a=>{const Ico=I[a.ic];const un=a.unread&&!read[a.id];return(
        <button key={a.id} className="arow" onClick={()=>setRead(x=>({...x,[a.id]:true}))}>
          <span className="ai"><Ico/></span>
          <span style={{flex:1,minWidth:0}}><div className="at sf">{a.t}{un&&<span className="bnew"/>}</div><div className="ad">{a.d}</div><div className="aw">{a.w}</div></span>
        </button>);})}
    </div>
  </div></div>);
}
