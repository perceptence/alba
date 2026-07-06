"use client";

/* =========================================================================
   ALBA — MAISON
   Quiet luxury. Alabaster ground · Warm ink · One clay accent, used sparingly.
   Fraunces light for display · Editorial hairlines, not cards · Architectural
   line-art · Unhurried motion. Grid 4px. No gauges, no gradients, no neon.

   This is the app shell: it owns navigation state and composes the screens,
   sheets, and chrome that live in ./components, ./lib, and ./screens.
   ========================================================================= */

import { useState } from "react";
import "./alba.css";

import { I } from "@/components/icons";
import { PhoneBar } from "@/components/PhoneBar";
import { useToasts, ToastHost } from "@/components/Toasts";
import { useCx } from "@/lib/conciergeStore";
import { useAp } from "@/lib/autopayStore";

import { Home } from "@/screens/Home";
import { Rent, Payments } from "@/screens/Rent";
import { PauseSheet, TurnOnSheet, MethodSheet, PayDetailSheet } from "@/screens/RentSheets";
import { Concierge, PastRequests } from "@/screens/Concierge";
import { Composer, ReqDetail } from "@/screens/ConciergeSheets";
import { NoticesSheet } from "@/screens/Notices";
import { Residence } from "@/screens/Residence";
import { Profile } from "@/screens/Profile";

export default function App(){
  const [tab,setTab]=useState("home");
  const [resView,setResView]=useState(false);
  const [compose,setCompose]=useState(null);
  const [detail,setDetail]=useState(null);
  const [noticesOpen,setNoticesOpen]=useState(false);
  const [apSheet,setApSheet]=useState(null);
  const [payView,setPayView]=useState(false);
  const [pastView,setPastView]=useState(false);
  const [paySheet,setPaySheet]=useState(null);
  const {toasts,push}=useToasts();
  const cx=useCx();
  const ap=useAp();
  const cxUnread=cx.unreadCount()>0;
  const go=(t)=>{setResView(false);setTab(t);};
  const NAV=[["home",I.home,"Home"],["rent",I.card,"Rent"],["concierge",I.concierge,"Concierge"],["profile",I.person,"Account"]];
  return (
    <div className="am">
      <div className="stage">
        <div className="phone">
          <div className="island"/>
          <div className="scroll">
            <PhoneBar/>
            {payView?<Payments onBack={()=>setPayView(false)} onOpenPayment={(id)=>setPaySheet(id)}/>
            :pastView?<PastRequests onBack={()=>setPastView(false)} onOpen={setDetail}/>
            :resView?<Residence onBack={()=>setResView(false)} go={go}/>
            :tab==="home"?<Home go={go} openRes={()=>setResView(true)} openRent={()=>setTab("rent")} openNotices={()=>setNoticesOpen(true)}/>
            :tab==="rent"?<Rent push={push} onOpenPayments={()=>setPayView(true)} onOpenPayment={(id)=>setPaySheet(id)} onAutopay={(on)=>setApSheet(on?"pause":"on")} onChangeMethod={()=>setApSheet("method")}/>
            :tab==="concierge"?<Concierge onCompose={setCompose} onOpen={setDetail} onOpenPast={()=>setPastView(true)}/>
            :<Profile onBack={()=>go("home")}/>}
          </div>
          {!resView&&!payView&&!pastView&&<nav className="nav">
            {NAV.map(([k,Ico,label])=>(
              <button key={k} className={tab===k?"on":""} onClick={()=>go(k)}>
                <span className="und"/><Ico/><span className="nl">{label}</span>
                {k==="concierge"&&cxUnread&&<span className="ndot"/>}
              </button>))}
          </nav>}
          {noticesOpen&&<NoticesSheet onClose={()=>setNoticesOpen(false)}/>}
          {paySheet&&<PayDetailSheet id={paySheet} onClose={()=>setPaySheet(null)}/>}
          {compose&&<Composer preset={compose.preset} initialNote={compose.note} push={push} onClose={()=>setCompose(null)} onCreated={(id)=>{setCompose(null);setDetail(id);}}/>}
          {detail&&<ReqDetail id={detail} push={push} onClose={()=>setDetail(null)}/>}
          {apSheet==="pause"&&<PauseSheet a={ap.get()} push={push} onClose={()=>setApSheet(null)}/>}
          {apSheet==="on"&&<TurnOnSheet ap={ap} push={push} onClose={()=>setApSheet(null)}/>}
          {apSheet==="method"&&<MethodSheet ap={ap} onClose={()=>setApSheet(null)}/>}
          <ToastHost toasts={toasts}/>
        </div>
      </div>
    </div>
  );
}
