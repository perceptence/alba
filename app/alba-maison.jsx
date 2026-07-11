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
import { useNotices } from "@/lib/noticesStore";

import { Home } from "@/screens/Home";
import { Rent, Payments } from "@/screens/Rent";
import { PayDetailSheet } from "@/screens/RentSheets";
import { Concierge, PastRequests } from "@/screens/Concierge";
import { Composer, ReqDetail } from "@/screens/ConciergeSheets";
import { NoticesPage } from "@/screens/Notices";
import { Residence } from "@/screens/Residence";
import { GuestAccess } from "@/screens/GuestAccess";
import { Schedule } from "@/screens/Schedule";
import { Renewal } from "@/screens/Renewal";
import { Charges } from "@/screens/Charges";
import { Autopay } from "@/screens/Autopay";
import { Profile } from "@/screens/Profile";
import { Onboarding } from "@/screens/Onboarding";
import { Manager } from "@/screens/Manager";
import { ManagerPresence } from "@/components/ManagerPresence";
import { DemoPanel } from "@/components/DemoPanel";

export default function App(){
  // Which journey the preview is showing — a prototype-only concern, driven
  // by the DemoPanel outside the device frame. Not part of the real product.
  const [journey,setJourney]=useState("resident"); // resident | onboarding
  const [tab,setTab]=useState("home");
  const [resView,setResView]=useState(false);
  const [compose,setCompose]=useState(null);
  const [detail,setDetail]=useState(null);
  const [noticesView,setNoticesView]=useState(false);
  const [guestView,setGuestView]=useState(false);
  // (autopay is now managed by a sheet local to the Payments screen)
  const [scheduleView,setScheduleView]=useState(false);
  const [renewalView,setRenewalView]=useState(false);
  const [chargesView,setChargesView]=useState(false);
  const [autopayView,setAutopayView]=useState(false);
  const [payView,setPayView]=useState(false);
  const [pastView,setPastView]=useState(false);
  const [paySheet,setPaySheet]=useState(null);
  const {toasts,push}=useToasts();
  const cx=useCx();
  const nt=useNotices();
  const cxUnread=cx.unreadCount()>0;
  // Launch splash — shows the brand on load, then fades to reveal the app.
  const [splash,setSplash]=useState("in"); // in → out → gone
  useEffect(()=>{
    const t1=setTimeout(()=>setSplash("out"),1900);
    const t2=setTimeout(()=>setSplash("gone"),2550);
    return ()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  const go=(t)=>{setResView(false);setNoticesView(false);setGuestView(false);setScheduleView(false);setRenewalView(false);setChargesView(false);setAutopayView(false);setTab(t);};
  const route=(to)=>{
    if(to.type==="request")setDetail(to.id);
    else if(to.type==="payment")setPaySheet(to.id);
    else if(to.type==="compose")setCompose({preset:to.preset,note:to.note||""});
    else if(to.type==="rent"){setNoticesView(false);setResView(false);setTab("rent");}
    else if(to.type==="renewal"){setNoticesView(false);setResView(false);setRenewalView(true);}
  };
  const NAV=[["home",I.home,"Home"],["rent",I.card,"Payments"],["concierge",I.concierge,"Concierge"],["profile",I.person,"Account"]];
  // The manager pushes its own sub-pages (an open estate); it reports them here
  // so the same .subview nav-hiding applies to both journeys.
  const [mgrSub,setMgrSub]=useState(false);
  const subview=journey==="manager"?mgrSub:(resView||payView||pastView||noticesView||guestView||scheduleView||renewalView||chargesView||autopayView);
  const scrollRef=useRef(null);
  // Each distinct screen gets a key; when it changes, scroll back to the top
  // (opening a sheet doesn't change the key, so the page keeps its place).
  const viewKey=payView?"pay":pastView?"past":noticesView?"notices":guestView?"guest":scheduleView?"schedule":renewalView?"renewal":chargesView?"charges":autopayView?"autopay":resView?"res":tab;
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=0;},[viewKey]);
  const onboarding=journey==="onboarding";
  const manager=journey==="manager";
  return (
    <div className={"am"+(subview?" subview":"")}>
      <div className="stage">
        <div className="device">
          <i className="v-btn left v-btn-action" aria-hidden="true"/>
          <i className="v-btn left v-btn-volup" aria-hidden="true"/>
          <i className="v-btn left v-btn-voldn" aria-hidden="true"/>
          <i className="v-btn right v-btn-side" aria-hidden="true"/>
          <i className="v-btn right v-btn-cam" aria-hidden="true"/>
          <span className="speaker" aria-hidden="true"/>
          <span className="ipad-cam" aria-hidden="true"/>
          <i className="ipad-btn ipad-btn-power" aria-hidden="true"/>
          <i className="ipad-btn ipad-btn-volup" aria-hidden="true"/>
          <i className="ipad-btn ipad-btn-voldn" aria-hidden="true"/>
        <div className="phone">
          <div className="island"/>
          <PhoneBar/>
          {onboarding?(
            <Onboarding onComplete={()=>{setJourney("resident");go("home");}}/>
          ):manager?(
            <Manager push={push} onSubview={setMgrSub}/>
          ):(<>
          <div className="scroll" ref={scrollRef}>
            {payView?<Payments onBack={()=>setPayView(false)} onOpenPayment={(id)=>setPaySheet(id)}/>
            :pastView?<PastRequests onBack={()=>setPastView(false)} onOpen={setDetail}/>
            :noticesView?<NoticesPage onBack={()=>setNoticesView(false)} route={route}/>
            :guestView?<GuestAccess onBack={()=>setGuestView(false)} push={push}/>
            :scheduleView?<Schedule onBack={()=>setScheduleView(false)} onOpenRequest={setDetail}/>
            :renewalView?<Renewal onBack={()=>setRenewalView(false)} push={push}/>
            :chargesView?<Charges onBack={()=>setChargesView(false)} push={push}/>
            :autopayView?<Autopay onBack={()=>setAutopayView(false)} push={push}/>
            :resView?<Residence onBack={()=>setResView(false)} go={go} onAsk={(act)=>route({type:"compose",preset:act.preset,note:act.note})} openGuests={()=>setGuestView(true)} openRenewal={()=>setRenewalView(true)}/>
            :tab==="home"?<Home go={go} openRes={()=>setResView(true)} openRent={()=>setTab("rent")} openNotices={()=>setNoticesView(true)} onOpenRequest={setDetail} openSchedule={()=>setScheduleView(true)} openGuests={()=>setGuestView(true)}/>
            :tab==="rent"?<Rent push={push} onOpenPayments={()=>setPayView(true)} onOpenPayment={(id)=>setPaySheet(id)} openCharges={()=>setChargesView(true)} openAutopay={()=>setAutopayView(true)}/>
            :tab==="concierge"?<Concierge onCompose={setCompose} onOpen={setDetail} onOpenPast={()=>setPastView(true)}/>
            :<Profile onBack={()=>go("home")}/>}
          </div>
          <nav className="nav">
            <div className="rail-brand">
              <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
                <path d="M 9 34 L 9 19 A 11 9 0 0 1 31 19 L 31 34"/>
                <path className="brand-sun" d="M 14 34 A 6 6 0 0 1 26 34 Z"/>
                <line x1="4" y1="34" x2="36" y2="34"/>
              </svg>
              <div className="brand-word">ALBA</div>
              <div className="brand-desc">Maison</div>
            </div>
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
              <ManagerPresence replies={false}/>
              <button className="rail-contact" onClick={()=>go("concierge")}><I.msg/>Message Rosa</button>
            </div>
          </nav>
          {paySheet&&<PayDetailSheet id={paySheet} onClose={()=>setPaySheet(null)}/>}
          {compose&&<Composer preset={compose.preset} initialNote={compose.note} push={push} onClose={()=>setCompose(null)} onCreated={(id)=>{setCompose(null);setDetail(id);}}/>}
          {detail&&<ReqDetail id={detail} push={push} onClose={()=>setDetail(null)}/>}
          </>)}
          {/* toasts render for every journey (resident, onboarding, manager) */}
          <ToastHost toasts={toasts}/>
          {splash!=="gone"&&(
            <div className={"splash"+(splash==="out"?" out":"")} aria-hidden="true">
              <div className="splash-brand">
                <svg className="splash-mark" viewBox="0 0 40 40">
                  <path d="M 9 34 L 9 19 A 11 9 0 0 1 31 19 L 31 34"/>
                  <path className="splash-sun" d="M 14 34 A 6 6 0 0 1 26 34 Z"/>
                  <line x1="4" y1="34" x2="36" y2="34"/>
                </svg>
                <span className="splash-id">
                  <span className="splash-word">ALBA</span>
                  <span className="splash-desc">Maison</span>
                </span>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
      <DemoPanel journey={journey} onChange={(j)=>{setJourney(j);go("home");}}/>
    </div>
  );
}
