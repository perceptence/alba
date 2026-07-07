import { useState, useEffect } from "react";

/* Concierge request domain: categories, status model, and a tiny
   subscribe-able in-memory store. */

export const CX_CATS = {
  question:{label:"Ask a question",tag:"Question",icon:"msg",kind:"question"},
  maintenance:{label:"Report an issue",tag:"Maintenance",icon:"wrench",kind:"request"},
  housekeeping:{label:"Housekeeping",tag:"Housekeeping",icon:"leaf",kind:"request"},
  access:{label:"Access & keys",tag:"Access",icon:"key",kind:"request"},
  delivery:{label:"Deliveries & fetch",tag:"Delivery",icon:"box",kind:"request"},
  other:{label:"Anything else",tag:"Request",icon:"dots",kind:"request"},
};

export const CX_STATUS = {submitted:{label:"Submitted",tone:"grey"},acknowledged:{label:"Acknowledged",tone:"grey"},scheduled:{label:"Scheduled",tone:"clay"},in_progress:{label:"In progress",tone:"clay"},resolved:{label:"Resolved",tone:"set"},cancelled:{label:"Cancelled",tone:"grey"}};

export const cxGuess = (t) => {const s=t.toLowerCase();
  if(/\?\s*$/.test(t)||/(question|wondering|can i |could you|what time|when is|when will|how do|is it possible|may i|do you know)/.test(s))return"question";
  if(/(deliver|package|parcel|fetch|pick ?up|dry clean|grocer|courier|drop ?off|collect|mail)/.test(s))return"delivery";
  if(/(clean|linen|towel|housekeep|turndown|laundry|dust|tidy|trash)/.test(s))return"housekeeping";
  if(/(key|guest|access|door|lock|entry|visitor|code|gate)/.test(s))return"access";
  if(/(leak|drip|broken|repair|fix|heat|hvac|\bac\b|air|power|light|applianc|pool|water|faucet|window|wifi|internet)/.test(s))return"maintenance";
  return"other";};

export const CX_TINT = {in_progress:"a",scheduled:"a",resolved:"g",submitted:"n",acknowledged:"n",cancelled:"m"};

export const cxSub = (r) => {const last=r.timeline[r.timeline.length-1];let detail="";
  if(r.status==="scheduled"&&r.scheduledFor)detail=r.scheduledFor; else if(last&&last.n)detail=last.n;
  return {word:CX_STATUS[r.status].label,tint:CX_TINT[r.status]||"n",detail};};

const CX_HIST = [
  {id:"h-1",cat:"maintenance",t:"Kitchen faucet drip",room:"Kitchen",y:2026,d:"14 Mar 2026",n:"Fixed by maintenance",m:"All sorted — the cartridge was replaced. Do let me know if it recurs."},
  {id:"h-2",cat:"housekeeping",t:"Fresh flowers for the foyer",room:"Whole residence",y:2026,d:"2 Feb 2026",n:"Standing weekly",m:"Lovely — we've set a standing weekly arrangement."},
  {id:"h-3",cat:"access",t:"Spare gate remote",room:"Grounds",y:2026,d:"18 Jan 2026",n:"Issued",m:"Your spare remote is waiting at the gatehouse."},
  {id:"h-4",cat:"housekeeping",t:"Guest suite prepared",room:"Bedroom",y:2025,d:"20 Dec 2025",n:"Prepared",m:"The guest suite is ready for your visitors."},
  {id:"h-5",cat:"delivery",t:"Wine delivery received",room:"Whole residence",y:2025,d:"5 Nov 2025",n:"Stored in cellar",m:"Your delivery has been stored in the cellar."},
  {id:"h-6",cat:"maintenance",t:"Patio furniture repair",room:"Grounds",y:2025,d:"12 Sep 2025",n:"Repaired",m:"The teak set has been re-fastened and oiled."},
  {id:"h-7",cat:"maintenance",t:"Weekly pool service",room:"Grounds",y:2025,d:"3 Jun 2025",n:"Scheduled",m:"Weekly pool service is now on the calendar."},
  {id:"h-8",cat:"delivery",t:"Dry cleaning collected",room:"Whole residence",y:2024,d:"22 Nov 2024",n:"Returned",m:"Your dry cleaning has been returned to the dressing room."},
  {id:"h-9",cat:"maintenance",t:"HVAC filter replacement",room:"Whole residence",y:2024,d:"8 Aug 2024",n:"Replaced",m:"All filters replaced — airflow restored."},
  {id:"h-10",cat:"access",t:"Additional parking pass",room:"Grounds",y:2024,d:"15 Apr 2024",n:"Issued",m:"An additional parking pass is at reception."},
];

export const cxStore = (() => {
  let reqs=[
    {id:"rq-1",category:"maintenance",title:"Pool heater cycling off",room:"Grounds",priority:"Soon",access:true,status:"in_progress",year:2026,scheduledFor:"Thursday, July 9 · AM",
     timeline:[{s:"submitted",at:"Jul 6, 8:12 AM"},{s:"acknowledged",at:"Jul 6, 8:40 AM",n:"Rosa acknowledged"},{s:"scheduled",at:"Jul 6, 11:05 AM",n:"Technician · Thu Jul 9, AM"},{s:"in_progress",at:"Today, 9:15 AM",n:"Technician on site"}],
     thread:[{f:"r",t:"The pool heater keeps cycling off after a few minutes.",at:"Jul 6, 8:12 AM"},{f:"m",t:"Thank you for flagging — our technician is booked for Thursday morning. I'll confirm the window.",at:"Jul 6, 11:05 AM"}]},
    {id:"rq-2",category:"housekeeping",title:"Weekly linen refresh",room:"Primary bath",priority:"Routine",access:true,status:"scheduled",year:2026,scheduledFor:"Friday, July 11 · AM",
     timeline:[{s:"submitted",at:"Jul 5, 2:30 PM"},{s:"acknowledged",at:"Jul 5, 3:10 PM",n:"Rosa acknowledged"},{s:"scheduled",at:"Jul 5, 4:00 PM",n:"Housekeeping · Fri Jul 11, AM"}],
     thread:[{f:"r",t:"Could we set up a weekly linen refresh?",at:"Jul 5, 2:30 PM"},{f:"m",t:"Of course — I've scheduled housekeeping for Friday mornings.",at:"Jul 5, 4:00 PM"}]},
    {id:"rq-0",category:"housekeeping",title:"Extra bath linens",room:"Primary bath",priority:"Routine",access:true,status:"resolved",year:2026,scheduledFor:null,
     timeline:[{s:"submitted",at:"Jul 2, 4:20 PM"},{s:"acknowledged",at:"Jul 2, 4:35 PM",n:"Rosa acknowledged"},{s:"resolved",at:"Jul 2, 6:10 PM",n:"Delivered by housekeeping"}],
     thread:[{f:"r",t:"Could we have two extra bath towel sets?",at:"Jul 2, 4:20 PM"},{f:"m",t:"Of course — delivered this afternoon. Enjoy your stay.",at:"Jul 2, 6:10 PM"}]},
    ...CX_HIST.map(h=>({id:h.id,category:h.cat,title:h.t,room:h.room,priority:"Routine",access:true,status:"resolved",year:h.y,scheduledFor:null,
      timeline:[{s:"submitted",at:h.d},{s:"resolved",at:h.d,n:h.n}],thread:[{f:"r",t:h.t,at:h.d},{f:"m",t:h.m,at:h.d}]})),
  ];
  const subs=new Set(),emit=()=>subs.forEach(f=>f());const unread=new Set(),replied=new Set();
  const _msg=(id,m)=>{reqs=reqs.map(r=>r.id===id?{...r,thread:[...r.thread,m]}:r);if(m.f==="m")unread.add(id);emit();};
  const _step=(id,ev)=>{reqs=reqs.map(r=>r.id===id?{...r,status:ev.s,timeline:[...r.timeline,ev]}:r);emit();};
  return {all:()=>reqs,get:(id)=>reqs.find(r=>r.id===id),subscribe:(f)=>{subs.add(f);return()=>subs.delete(f);},
    isUnread:(id)=>unread.has(id),markRead:(id)=>{if(unread.delete(id))emit();},unreadCount:()=>unread.size,
    create:(d)=>{const id="rq-"+Date.now();reqs=[{id,scheduledFor:null,...d,status:"submitted",timeline:[{s:"submitted",at:"Just now"}],thread:d.note?[{f:"r",t:d.note,at:"Just now"}]:[]},...reqs];emit();
      setTimeout(()=>{_step(id,{s:"acknowledged",at:"Just now",n:"Rosa acknowledged"});_msg(id,{f:"m",t:d.category==="question"?"Thank you — let me look into that and I'll reply here shortly.":"Received — I'll review and confirm timing here shortly.",at:"Just now"});},1600);return id;},
    send:(id,t)=>{_msg(id,{f:"r",t,at:"Just now"});if(!replied.has(id)){replied.add(id);setTimeout(()=>_msg(id,{f:"m",t:"Noted, thank you — I'll keep you posted right here.",at:"Just now"}),1500);}},
    cancel:(id)=>{_step(id,{s:"cancelled",at:"Just now",n:"Cancelled by resident"});}};
})();

export function useCx() {const[,f]=useState(0);useEffect(()=>cxStore.subscribe(()=>f(n=>n+1)),[]);return cxStore;}
