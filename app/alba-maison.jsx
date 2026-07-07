"use client";

/* =========================================================================
   ALBA — MAISON
   Quiet luxury. Alabaster ground · Warm ink · One clay accent, used sparingly.
   Fraunces light for display · Editorial hairlines, not cards · Architectural
   line-art · Unhurried motion. Grid 4px. No gauges, no gradients, no neon.

   This is the app shell: it owns navigation state and composes the screens,
   sheets, and chrome that live in ./components, ./lib, and ./screens.
   ========================================================================= */

import { useState, useRef, useEffect } from "react";
import "./alba.css";

import { I } from "@/components/icons";
import { PhoneBar } from "@/components/PhoneBar";
import { useToasts, ToastHost } from "@/components/Toasts";
import { useCx } from "@/lib/conciergeStore";
import { useAp } from "@/lib/autopayStore";
import { useNotices } from "@/lib/noticesStore";

import { Home } from "@/screens/Home";
import { Rent, Payments } from "@/screens/Rent";
import { PauseSheet, TurnOnSheet, MethodSheet, PayDetailSheet } from "@/screens/RentSheets";
import { Concierge, PastRequests } from "@/screens/Concierge";
import { Composer, ReqDetail } from "@/screens/ConciergeSheets";
import { NoticesPage } from "@/screens/Notices";
import { Residence } from "@/screens/Residence";
import { GuestAccess } from "@/screens/GuestAccess";
import { Schedule } from "@/screens/Schedule";
import { Renewal } from "@/screens/Renewal";
import { Charges } from "@/screens/Charges";
import { Profile } from "@/screens/Profile";
import { Avatar } from "@/components/Avatar";
import { TextLink } from "@/components/TextLink";
import { AV } from "@/lib/data";

export default function App(){
  const [tab,setTab]=useState("home");
  const [resView,setResView]=useState(false);
  const [compose,setCompose]=useState(null);
  const [detail,setDetail]=useState(null);
  const [noticesView,setNoticesView]=useState(false);
  const [guestView,setGuestView]=useState(false);
  const [scheduleView,setScheduleView]=useState(false);
  const [renewalView,setRenewalView]=useState(false);
  const [chargesView,setChargesView]=useState(false);
  const [apSheet,setApSheet]=useState(null);
  const [payView,setPayView]=useState(false);
  const [pastView,setPastView]=useState(false);
  const [paySheet,setPaySheet]=useState(null);
  const {toasts,push}=useToasts();
  const cx=useCx();
  const ap=useAp();
  const nt=useNotices();
  const cxUnread=cx.unreadCount()>0;
  const go=(t)=>{setResView(false);setNoticesView(false);setGuestView(false);setScheduleView(false);setRenewalView(false);setChargesView(false);setTab(t);};
  const route=(to)=>{
    if(to.type==="request")setDetail(to.id);
    else if(to.type==="payment")setPaySheet(to.id);
    else if(to.type==="compose")setCompose({preset:to.preset,note:to.note||""});
    else if(to.type==="rent"){setNoticesView(false);setResView(false);setTab("rent");}
    else if(to.type==="renewal"){setNoticesView(false);setResView(false);setRenewalView(true);}
  };
  const NAV=[["home",I.home,"Home"],["rent",I.card,"Rent"],["concierge",I.concierge,"Concierge"],["profile",I.person,"Account"]];
  const subview=resView||payView||pastView||noticesView||guestView||scheduleView||renewalView||chargesView;
  const scrollRef=useRef(null);
  // Each distinct screen gets a key; when it changes, scroll back to the top
  // (opening a sheet doesn't change the key, so the page keeps its place).
  const viewKey=payView?"pay":pastView?"past":noticesView?"notices":guestView?"guest":scheduleView?"schedule":renewalView?"renewal":chargesView?"charges":resView?"res":tab;
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=0;},[viewKey]);
  return (
    <div className={"am"+(subview?" subview":"")}>
      <div className="stage">
        <div className="phone">
          <div className="island"/>
          <PhoneBar/>
          <div className="scroll" ref={scrollRef}>
            {payView?<Payments onBack={()=>setPayView(false)} onOpenPayment={(id)=>setPaySheet(id)}/>
            :pastView?<PastRequests onBack={()=>setPastView(false)} onOpen={setDetail}/>
            :noticesView?<NoticesPage onBack={()=>setNoticesView(false)} route={route}/>
            :guestView?<GuestAccess onBack={()=>setGuestView(false)} push={push}/>
            :scheduleView?<Schedule onBack={()=>setScheduleView(false)} onOpenRequest={setDetail}/>
            :renewalView?<Renewal onBack={()=>setRenewalView(false)} push={push}/>
            :chargesView?<Charges onBack={()=>setChargesView(false)} push={push}/>
            :resView?<Residence onBack={()=>setResView(false)} go={go} onAsk={(act)=>route({type:"compose",preset:act.preset,note:act.note})} openGuests={()=>setGuestView(true)} openRenewal={()=>setRenewalView(true)}/>
            :tab==="home"?<Home go={go} openRes={()=>setResView(true)} openRent={()=>setTab("rent")} openNotices={()=>setNoticesView(true)} onOpenRequest={setDetail} openSchedule={()=>setScheduleView(true)} openGuests={()=>setGuestView(true)}/>
            :tab==="rent"?<Rent push={push} onOpenPayments={()=>setPayView(true)} onOpenPayment={(id)=>setPaySheet(id)} onAutopay={(on)=>setApSheet(on?"pause":"on")} onChangeMethod={()=>setApSheet("method")} openCharges={()=>setChargesView(true)}/>
            :tab==="concierge"?<Concierge onCompose={setCompose} onOpen={setDetail} onOpenPast={()=>setPastView(true)}/>
            :<Profile onBack={()=>go("home")}/>}
          </div>
          <nav className="nav">
            <div className="rail-brand">ALBA</div>
            {NAV.map(([k,Ico,label])=>(
              <button key={k} className={(tab===k&&!noticesView)?"on":""} onClick={()=>go(k)}>
                <span className="und"/><Ico/><span className="nl">{label}</span>
                {k==="concierge"&&cxUnread&&<span className="ndot"/>}
              </button>))}
            <button className={"nav-notices"+(noticesView?" on":"")} onClick={()=>setNoticesView(true)}>
              <span className="und"/>
              <span className="nn-main"><I.bell/><span className="nl">Notices</span></span>
              {nt.unreadCount()>0&&<span className="nn-sub">{nt.unreadCount()} new updates</span>}
            </button>
            <div className="rail-foot">
              <div className="rail-mgr">
                <Avatar cfg={AV.rosa} size={38}/>
                <span className="rail-mgr-id"><span className="rail-mgr-name sf">Rosa Ibáñez</span><span className="rail-mgr-role">Your estate manager</span></span>
              </div>
              <TextLink onClick={()=>go("concierge")}>Contact</TextLink>
            </div>
          </nav>
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
