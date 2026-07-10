import { useState } from "react";
import { I } from "@/components/icons";
import { useNotices, ntBrief, NT_CATS } from "@/lib/noticesStore";

/* Notices — a full page reached from the Home bell (back arrow returns
   Home). Opens on the desk's composed brief, then the record: notices
   stack by thread, group by time or by what needs the resident, filter
   by category, and deep-link into the app via `route` — those flyouts
   layer over this page and return to it, so there's no back-and-forth. */

const DAY_G = (d) => d === 0 ? "Today" : d === 1 ? "Yesterday" : d <= 7 ? "This week" : "Earlier";
const G_TIME = ["Today", "Yesterday", "This week", "Earlier"];
const G_PRIO = ["Needs you", "For the record"];

export function NoticesPage({ onBack, route }) {
  const nt = useNotices();
  const [filt, setFilt] = useState("all");
  const [mode, setMode] = useState("latest");
  const [open, setOpen] = useState({});

  const items = nt.all().filter(a => filt === "all" || a.cat === filt);
  // Collapse threads: the newest notice fronts the stack, older ride along.
  const stacks = []; const seen = {};
  items.forEach(a => {
    if (a.thread && seen[a.thread] !== undefined) { stacks[seen[a.thread]].older.push(a); return; }
    if (a.thread) seen[a.thread] = stacks.length;
    stacks.push({ ...a, older: [] });
  });
  const groups = {};
  stacks.forEach(s => {
    const g = mode === "latest" ? DAY_G(s.day) : (s.weight === "act" ? "Needs you" : "For the record");
    (groups[g] = groups[g] || []).push(s);
  });
  const order = mode === "latest" ? G_TIME : G_PRIO;

  const settle = (s) => { nt.markRead(s.id); s.older.forEach(o => nt.markRead(o.id)); };
  const go = (to) => { if (to && route) route(to); };

  return (
    <div className="pc stag">
      <div className="backrow backrow-nav"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Home</span></div>
      <div className="phead" style={{paddingTop:24}}><span className="eye">The estate</span><div className="ht sf">Notices</div></div>

      <div className="nt-brief">
        <div className="bq sf">{ntBrief(nt.all())}</div>
        <div className="bby">Composed by the desk · just now</div>
      </div>

      <div className="nt-bar">
        <div className="nt-tabs">
          {[["all","All"],...Object.entries(NT_CATS).map(([k,c])=>[k,c.label])].map(([k,l])=>
            <button key={k} className={"nt-tab"+(filt===k?" on":"")} onClick={()=>setFilt(k)}>{l}</button>)}
        </div>
        <div className="nt-ctrls">
          <button className="nt-sort" onClick={()=>setMode(m=>m==="latest"?"priority":"latest")}>
            <I.sort/><span>{mode==="latest"?"Latest first":"Needs you first"}</span></button>
        </div>
      </div>

      {order.filter(g=>groups[g]).map(g=>(<div key={g}>
        <div className="nt-g">{g}</div>
        {groups[g].map(s=>{
          const Ico=I[s.ic];
          const un=nt.isUnread(s.id)||s.older.some(o=>nt.isUnread(o.id));
          return (<div key={s.id} className={"arow"+(un?"":" read")} onClick={()=>settle(s)}>
            <span className="ai"><Ico/></span>
            <span style={{flex:1,minWidth:0}}>
              <div className="at sf">{s.t}{un&&<span className="bnew"/>}</div>
              <div className="ad">{s.d}</div>
              <div className="aw">{s.weight==="act"&&<span className="need">Needs you · </span>}{s.w}</div>
              {s.act&&<button className="a-act" onClick={(e)=>{e.stopPropagation();settle(s);go(s.act.to);}}>{s.act.label}<I.arrow/></button>}
              {s.older.length>0&&<>
                <button className={"nt-more"+(open[s.id]?" open":"")} onClick={(e)=>{e.stopPropagation();setOpen(o=>({...o,[s.id]:!o[s.id]}));}}>
                  {s.older.length} earlier update{s.older.length===1?"":"s"}<I.chevD/></button>
                {open[s.id]&&<div className="nt-sub stag">{s.older.map(o=>(
                  <div key={o.id} className="nt-si"><div className="st sf">{o.t}</div><div className="sd">{o.d}</div><div className="sw">{o.w}</div></div>))}</div>}
              </>}
            </span>
          </div>);})}
      </div>))}
      {stacks.length===0&&<div className="calm"><I.leaf/>Nothing here — all tended to.</div>}
      <div style={{height:8}}/>
    </div>
  );
}
