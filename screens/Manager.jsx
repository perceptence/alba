import { useState, useRef, useEffect } from "react";
import { useDesk, deskStore, TABS, PRI } from "@/lib/managerData";
import { CX_CATS, CX_STATUS, CX_TINT } from "@/lib/conciergeStore";
import { AV } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { ManagerPresence } from "@/components/ManagerPresence";
import { useSheet } from "@/components/useSheet";
import { I } from "@/components/icons";

/* Rosa's side — the estate desk. An operator app across several estates:
   denser than the resident experience, tuned for scanning and acting, but
   built from the same design system. It mirrors the resident shell — a
   bottom bar on phone, a left rail on desktop — with its own operator nav. */

const CX_ICON = { maintenance:"wrench", housekeeping:"towel", access:"key", delivery:"box", question:"msg", other:"dots" };
const OP_NAV = [
  ["requests", I.concierge, "Requests"],
  ["residents", I.users, "Residents"],
  ["schedule", I.cal, "Schedule"],
  ["account", I.person, "Account"],
];

export function Manager({ push }) {
  const [section, setSection] = useState("requests");
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [section]);
  return (
    <>
      <div className="scroll" ref={scrollRef}>
        {section === "requests" ? <RequestsSection push={push}/>
          : section === "residents" ? <ResidentsSection/>
          : section === "schedule" ? <ScheduleSection/>
          : <AccountSection/>}
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
        {OP_NAV.map(([k, Ico, label]) => (
          <button key={k} className={section === k ? "on" : ""} onClick={() => setSection(k)}>
            <span className="und"/><Ico/><span className="nl">{label}</span>
          </button>))}
        <div className="rail-foot rail-foot-op">
          <span className="rail-op-eye">Signed in</span>
          <ManagerPresence replies={false}/>
        </div>
      </nav>
    </>
  );
}

/* ——— Requests — the triage queue ——— */
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

function RequestsSection({ push }) {
  const desk = useDesk();
  const reqs = desk.all();
  const c = desk.counts();
  const [tab, setTab] = useState("needs");
  const [openId, setOpenId] = useState(null);
  const active = TABS.find((t) => t.key === tab);
  const list = reqs.filter(active.match);
  return (
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
      {openId && <DeskDetail id={openId} onClose={() => setOpenId(null)} push={push}/>}
    </div>
  );
}

/* ——— Residents — the book of residents across estates ——— */
function ResidentsSection() {
  const desk = useDesk();
  const reqs = desk.all();
  const byWho = {};
  reqs.forEach((r) => {
    if (!byWho[r.who]) byWho[r.who] = { who: r.who, init: r.init, estate: r.estate, area: r.area, open: 0 };
    if (r.status !== "resolved") byWho[r.who].open++;
  });
  const residents = Object.values(byWho).sort((a, b) => b.open - a.open || a.who.localeCompare(b.who));
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">The estate desk</span><div className="ht sf">Residents</div></div>
      <div className="mgr-sum2">{residents.length} residents across your estates</div>
      <div className="mgr-list">
        {residents.map((p) => (
          <div className="rres" key={p.who}>
            <span className="dqav">{p.init}</span>
            <span className="rres-m">
              <div className="rres-name sf">{p.who}</div>
              <div className="rres-est">{p.estate} · {p.area}</div>
            </span>
            <span className="rres-r">{p.open > 0 ? <span className="cxt-a">{p.open} open</span> : <span className="cxt-g">All clear</span>}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 8 }}/>
    </div>
  );
}

/* ——— Schedule — upcoming visits & arrivals across estates ——— */
function ScheduleSection() {
  const desk = useDesk();
  const upcoming = desk.all().filter((r) => r.eta && r.status !== "resolved");
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">The estate desk</span><div className="ht sf">Schedule</div></div>
      <div className="mgr-sum2">Upcoming visits &amp; arrivals across your estates</div>
      <div className="mgr-list" style={{ marginTop: 16 }}>
        {upcoming.length === 0
          ? <div className="calm"><I.leaf/>Nothing scheduled yet.</div>
          : upcoming.map((r) => {
            const Ico = I[CX_ICON[r.category]] || I.dots;
            return (
              <div className="sentry" key={r.id}>
                <span className="sentry-ic sentry-ic-request"><Ico/></span>
                <span className="sentry-m">
                  <div className="sentry-t sf">{r.title}</div>
                  <div className="sentry-s">{r.who} · {r.estate}</div>
                </span>
                <span className="sentry-w">{r.eta}</span>
              </div>
            );
          })}
      </div>
      <div style={{ height: 8 }}/>
    </div>
  );
}

/* ——— Account — Rosa's own, the signed-in operator ——— */
function AccountSection() {
  const desk = useDesk();
  const reqs = desk.all();
  const estates = new Set(reqs.map((r) => r.estate)).size;
  const c = desk.counts();
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">Signed in</span><div className="ht sf">Rosa Ibáñez</div></div>
      <div className="prof-head">
        <span className="prof-av"><Avatar cfg={AV.rosa} size={56}/></span>
        <div className="prof-idty">
          <div className="prof-name sf">Estate manager</div>
          <div className="prof-place">ALBA · Bel-Air &amp; the Westside</div>
        </div>
      </div>
      <div className="sect"><div className="sect-h"><span className="l">Your desk</span></div>
        <div className="prow"><span className="pk">Estates</span><span className="pv">{estates}</span></div>
        <div className="prow"><span className="pk">Open requests</span><span className="pv">{c.open}</span></div>
        <div className="prow"><span className="pk">Resolved recently</span><span className="pv">{c.done}</span></div>
      </div>
      <button className="signout">Sign out</button>
      <div style={{ height: 8 }}/>
    </div>
  );
}

/* ——— Request detail (operator) ——— */
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
