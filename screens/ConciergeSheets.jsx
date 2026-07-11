import { useState, useEffect, useRef } from "react";
import { useCx, cxStore, CX_CATS, CX_STATUS, CX_TINT } from "@/lib/conciergeStore";
import { RES, ROSA } from "@/lib/data";
import { I } from "@/components/icons";
import { useSheet } from "@/components/useSheet";

function DetailRow({ label, value, display, options, open, onToggle, onPick }) {
  return (<div className={"drow"+(open?" open":"")}>
    <button className="drow-head" onClick={onToggle}>
      <span className="drow-l sf">{label}</span><span className="drow-v">{display}</span><span className="drow-c"><I.chev/></span>
    </button>
    {open&&<div className="drow-opts rise">{options.map(o=>(
      <button key={o.v} className="drow-opt" onClick={()=>onPick(o.v)}>
        <span className={"ap-radio"+(o.v===value?" on":"")}/><span className="drow-ot sf">{o.l}</span>
      </button>))}</div>}
  </div>);
}

export function Composer({ preset, initialNote, onClose, onCreated, push }) {
  const [cat,setCat]=useState(preset||"question");const[note,setNote]=useState(initialNote||"");
  const [room,setRoom]=useState("Kitchen");const[pri,setPri]=useState("Routine");const[access,setAccess]=useState(true);
  const [openF,setOpenF]=useState(null);const[photos,setPhotos]=useState([]);
  const taRef=useRef(null);
  const grow=()=>{const el=taRef.current;if(el){el.style.height="auto";el.style.height=el.scrollHeight+"px";}};
  useEffect(grow,[note]);
  const isQ=CX_CATS[cat].kind==="question";
  const valid=note.trim().length>2;
  const ROOMS=["Kitchen","Primary bath","Living room","Bedroom","Grounds","Whole residence"];
  const tog=(k)=>setOpenF(o=>o===k?null:k);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const submit=()=>{if(!valid)return;const title=note.trim().split("\n")[0].slice(0,48);
    const d=isQ?{category:cat,title,note:note.trim(),photos}:{category:cat,title,room,priority:pri,access,note:note.trim(),photos};
    const id=cxStore.create(d);push({t:isQ?"Question sent":"Request sent",d:"Rosa will reply shortly"});onCreated(id);};
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{isQ?"Ask Rosa":"New request"}</div><div className="sh-sub">To Rosa · {RES.short}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <div className="flab" style={{marginTop:0}}>{isQ?"Your question":"In your words"}</div>
      <div className="co-field"><textarea ref={taRef} rows={1} value={note} onChange={e=>setNote(e.target.value)} placeholder={isQ?"What would you like to ask?":"What do you need?"}/></div>
      <div className="flab">Photos</div>
      <div className="co-photos">
        {photos.map(id=>(<div key={id} className="thumb"><span className="thumb-ph"><I.image/></span>
          <button className="thumb-x" onClick={()=>setPhotos(ps=>ps.filter(x=>x!==id))} aria-label="Remove photo"><I.close/></button></div>))}
        {photos.length<4&&<button className="addphoto" onClick={()=>setPhotos(ps=>[...ps,Date.now()+Math.random()])} aria-label="Add a photo"><I.plus/></button>}
      </div>
      <div className="det">
        <DetailRow label="Filed as" value={cat} display={CX_CATS[cat].tag}
          options={Object.entries(CX_CATS).map(([k,c])=>({v:k,l:c.tag}))}
          open={openF==="cat"} onToggle={()=>tog("cat")} onPick={(v)=>{setCat(v);setOpenF(null);}}/>
        {!isQ&&<DetailRow label="Where" value={room} display={room}
          options={ROOMS.map(r=>({v:r,l:r}))} open={openF==="where"} onToggle={()=>tog("where")} onPick={(v)=>{setRoom(v);setOpenF(null);}}/>}
        {!isQ&&<DetailRow label="Priority" value={pri} display={pri}
          options={["Routine","Soon","Urgent"].map(x=>({v:x,l:x}))} open={openF==="pri"} onToggle={()=>tog("pri")} onPick={(v)=>{setPri(v);setOpenF(null);}}/>}
        {!isQ&&<div className="toggle-line" style={{marginTop:0}}>
          <span><div className="tt sf">Enter if I'm out</div><div className="td">Allow the team in to complete this</div></span>
          <button className={"tog"+(access?" on":"")} role="switch" aria-checked={access} onClick={()=>setAccess(a=>!a)}><i/></button></div>}
      </div>
    </div>
    <div className="sh-foot"><button className="cta" disabled={!valid} style={!valid?{opacity:.4}:undefined} onClick={submit}>{isQ?"Send question":"Send request"}</button></div>
  </div></div>);
}

// The full milestone journey for a request, with each step marked done /
// now / future so the timeline can paint the whole path.
const JOURNEY = {
  request: ["submitted", "acknowledged", "scheduled", "in_progress", "resolved"],
  question: ["submitted", "acknowledged", "resolved"],
};
function reqMilestones(r) {
  if (r.status === "cancelled") {
    return r.timeline.map((ev) => ({ label: CX_STATUS[ev.s].label, detail: (ev.n ? ev.n + " · " : "") + ev.at, state: "done", icon: ev.s === "cancelled" ? "close" : "check" }));
  }
  const order = JOURNEY[CX_CATS[r.category].kind] || JOURNEY.request;
  const cur = order.indexOf(r.status);
  const resolved = r.status === "resolved";
  return order.map((s, i) => {
    const ev = r.timeline.find((e) => e.s === s);
    const state = i < cur ? "done" : i === cur ? (resolved ? "done" : "now") : "future";
    return { label: CX_STATUS[s].label, detail: ev ? (ev.n ? ev.n + " · " : "") + ev.at : "", state, icon: "check" };
  });
}

export function ReqDetail({ id, onClose, push }) {
  const cx=useCx();const r=cx.get(id);const[msg,setMsg]=useState("");
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  useEffect(()=>{cx.markRead(id);},[id]);
  if(!r)return null;
  const open=r.status!=="resolved"&&r.status!=="cancelled";
  const st=CX_STATUS[r.status];
  const send=()=>{const t=msg.trim();if(!t)return;cx.send(id,t);setMsg("");};
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{r.title}</div><div className="sh-sub">{CX_CATS[r.category].tag}{r.room?" · "+r.room:""}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <div className="tml">{reqMilestones(r).map((m,i)=>(
        <div className={"tstep "+m.state} key={i}>
          <span className="tnode">{m.state==="done"?(m.icon==="close"?<I.close/>:<I.check/>):null}</span>
          <span><div className="tlab sf">{m.label}</div>{m.detail&&<div className="tsub">{m.detail}</div>}</span>
        </div>))}</div>
      <div className="kvl">
        {r.room&&<div className="kv"><span className="k">Where</span><span className="v">{r.room}</span></div>}
        {r.priority&&<div className="kv"><span className="k">Priority</span><span className="v">{r.priority}</span></div>}
        {typeof r.access!=="undefined"&&<div className="kv"><span className="k">Entry if out</span><span className="v">{r.access?"Allowed":"Not allowed"}</span></div>}
        <div className="kv"><span className="k">In the care of</span><span className="v">{ROSA.name}</span></div>
      </div>
      {r.photos&&r.photos.length>0&&<><div className="flab">Photos</div>
      <div className="co-photos" style={{marginTop:0}}>{r.photos.map(id=>(<div key={id} className="thumb"><span className="thumb-ph"><I.image/></span></div>))}</div></>}
      <div className="flab" style={{marginTop:28}}>Correspondence</div>
      <div className="thread">{r.thread.map((m,i)=>(
        <div key={i} className={"bw "+(m.f==="r"?"me":"them")}>
          <span><div className="bub">{m.t}</div><div className="bt2">{m.f==="m"?"Rosa · ":""}{m.at}</div></span>
        </div>))}</div>
      {open?<>
        <div className="compose"><input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}} placeholder="Reply to Rosa…"/>
          <button className="snd" onClick={send} aria-label="Send"><I.send/></button></div>
        <div className="hint">Rosa usually replies within the hour</div>
      </>:<div className="hint" style={{marginTop:16}}>This {CX_CATS[r.category].kind==="question"?"question":"request"} is {st.label.toLowerCase()}</div>}
    </div>
    {open&&<div className="sh-foot"><button className="cta ghost" onClick={()=>{cxStore.cancel(id);push({t:CX_CATS[r.category].kind==="question"?"Question withdrawn":"Request withdrawn",d:r.title});}}>{CX_CATS[r.category].kind==="question"?"Withdraw question":"Withdraw request"}</button></div>}
  </div></div>);
}
