import { useState } from "react";
import { useDesk, deskStore, TABS, PRI, ROSA_DESK } from "@/lib/managerData";
import { CX_CATS, CX_STATUS, CX_TINT } from "@/lib/conciergeStore";
import { AV } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { useSheet } from "@/components/useSheet";
import { I } from "@/components/icons";

/* Rosa's side — the estate desk. Where the resident app is calm and one
   household deep, this is an operator surface: several estates at once, denser
   rows, priority triage. Same design system (paper, hairlines, one clay
   accent, Fraunces titles) tuned for scanning-and-acting rather than dwelling. */

const CX_ICON = { maintenance:"wrench", housekeeping:"towel", access:"key", delivery:"box", question:"msg", other:"dots" };

function DeskRow({ r, onOpen }) {
  const Ico = I[CX_ICON[r.category]] || I.dots;
  const st = CX_STATUS[r.status];
  const flagged = r.priority === "Urgent" && r.status !== "resolved";
  return (
    <button className="dqrow" onClick={() => onOpen(r.id)}>
      <span className={"dqpri dqpri-" + PRI[r.priority]} aria-hidden="true"/>
      <span className="dqav">{r.init}</span>
      <span className="dqm">
        <div className="dqwho">{r.who}<span className="dqest"> · {r.estate}</span></div>
        <div className="dqt sf">{r.title}</div>
        <div className="dqsub"><Ico/>{flagged && <><span className="cxt-a">Urgent</span> · </>}{CX_CATS[r.category].tag} · <span className={"cxt-" + (CX_TINT[r.status] || "n")}>{st.label}</span></div>
      </span>
      <span className="dqr"><span className="dqtime">{r.time}</span><I.chev/></span>
    </button>
  );
}

export function Manager({ push }) {
  const desk = useDesk();
  const reqs = desk.all();
  const c = desk.counts();
  const [tab, setTab] = useState("needs");
  const [openId, setOpenId] = useState(null);
  const active = TABS.find((t) => t.key === tab);
  const list = reqs.filter(active.match);

  return (
    <div className="mgr-scroll">
      <div className="pc stag">
        <div className="mgr-head">
          <span><span className="eye">The estate desk</span><div className="ht sf">Good morning, Rosa.</div></span>
          <Avatar cfg={AV.rosa} size={46}/>
        </div>

        <div className="mgr-fig">
          <span className="mgr-fig-n sf num">{c.needs}</span>
          <span className="mgr-fig-l">request{c.needs !== 1 ? "s" : ""}<br/>need you</span>
        </div>
        <div className="mgr-fig-s">{c.open} open across your estates · {c.done} resolved recently</div>

        <div className="yearsw mgr-tabs">
          {TABS.map((t) => {
            const n = reqs.filter(t.match).length;
            return <button key={t.key} className={"yr" + (t.key === tab ? " on" : "")} onClick={() => setTab(t.key)}>{t.label}<span className="mgr-tabn">{n}</span></button>;
          })}
        </div>

        <div className="mgr-list">
          {list.length === 0
            ? <div className="calm"><I.leaf/>Nothing here — all caught up.</div>
            : list.map((r) => <DeskRow key={r.id} r={r} onOpen={setOpenId}/>)}
        </div>
        <div style={{ height: 8 }}/>
      </div>
      {openId && <DeskDetail id={openId} onClose={() => setOpenId(null)} push={push}/>}
    </div>
  );
}

function DeskDetail({ id, onClose, push }) {
  const desk = useDesk();
  const r = desk.get(id);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const [reply, setReply] = useState("");
  if (!r) return null;
  const st = CX_STATUS[r.status];
  const isNew = r.status === "submitted";
  const done = r.status === "resolved";
  const Ico = I[CX_ICON[r.category]] || I.dots;

  const ack = () => { deskStore.acknowledge(id); push({ t: "Acknowledged", d: `${r.who} has been notified` }); };
  const resolve = () => { deskStore.resolve(id); push({ t: "Marked resolved", d: r.title }); close(); };
  const send = () => { const t = reply.trim(); if (!t) return; setReply(""); if (isNew) deskStore.acknowledge(id); push({ t: "Reply sent", d: `To ${r.who}` }); };

  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head">
      <span className="dd-av">{r.init}</span>
      <span style={{ flex: 1 }}><div className="sh-title sf">{r.who}</div><div className="sh-sub">{r.estate} · {r.area}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button>
    </div>
    <div className="sh-body" style={{ paddingTop: 8 }}>
      <div className="dd-tags">
        <span className="dd-cat"><Ico/>{CX_CATS[r.category].tag}</span>
        {r.priority === "Urgent" && !done && <span className="dd-urgent">Urgent</span>}
        <span className={"dd-status cxt-" + (CX_TINT[r.status] || "n")}>{st.label}</span>
      </div>
      <div className="dd-title sf">{r.title}</div>
      <p className="dd-note">&ldquo;{r.note}&rdquo;</p>
      {r.eta && <div className="dd-eta"><I.clock/>{r.eta}</div>}

      <div className="flab">Reply to {r.who.split(" ")[0]}</div>
      <div className="co-field"><textarea rows={1} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="A quick note back…"/></div>
      <button className="cta ghost dd-send" disabled={!reply.trim()} style={!reply.trim() ? { opacity: .4 } : undefined} onClick={send}><I.send/>Send reply</button>
    </div>
    <div className="sh-foot dd-foot">
      {isNew && <button className="cta ghost" onClick={ack}>Acknowledge</button>}
      {!done && <button className="cta" onClick={resolve}><I.check/>Resolve</button>}
      {done && <div className="dd-done"><I.check/>Resolved</div>}
    </div>
  </div></div>);
}
