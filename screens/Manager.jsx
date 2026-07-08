import { useState, useRef, useEffect } from "react";
import { useDesk, deskStore, TABS, PRI, ESTATES, RESIDENTS, byEst, byRes, estateResidents } from "@/lib/managerData";
import { CX_CATS, CX_STATUS, CX_TINT } from "@/lib/conciergeStore";
import { money } from "@/lib/util";
import { AV } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { ManagerPresence } from "@/components/ManagerPresence";
import { useSheet } from "@/components/useSheet";
import { I } from "@/components/icons";

/* Rosa's side — the estate desk. An operator app across a portfolio of estates:
   requests to triage, a book of residents, the estates themselves as reference,
   a schedule and her own account. Denser than the resident experience, built
   from the same design system, and — like the resident app — a bottom bar on
   phone, a left rail on desktop. */

const CX_ICON = { maintenance:"wrench", housekeeping:"towel", access:"key", delivery:"box", question:"msg", other:"dots" };
const OP_NAV = [
  ["requests", I.concierge, "Requests"],
  ["estates", I.home, "Estates"],
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
          : section === "estates" ? <EstatesSection/>
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

/* small shared bits */
function StatusChip({ r }) {
  const st = CX_STATUS[r.status];
  const flagged = r.priority === "Urgent" && r.status !== "resolved";
  return <>{flagged && <><span className="cxt-a">Urgent</span> · </>}{CX_CATS[r.category].tag} · <span className={"cxt-" + (CX_TINT[r.status] || "n")}>{st.label}</span></>;
}
function SortBar({ opts, sort, setSort }) {
  return (
    <div className="yearsw mgr-tabs mgr-sort">
      {opts.map(([k, label]) => <button key={k} className={"yr" + (k === sort ? " on" : "")} onClick={() => setSort(k)}>{label}</button>)}
    </div>
  );
}

/* ——— Requests — the triage queue ——— */
function DeskRow({ r, onOpen }) {
  const Ico = I[CX_ICON[r.category]] || I.dots;
  return (
    <button className="dqrow" onClick={() => onOpen(r.id)}>
      <span className={"dqpri dqpri-" + PRI[r.priority]} aria-hidden="true"/>
      <span className="dqav">{r.init}</span>
      <span className="dqm">
        <div className="dqwho">{r.who}<span className="dqest"> · {r.estateShort}</span></div>
        <div className="dqt sf">{r.title}</div>
        <div className="dqsub"><Ico/><StatusChip r={r}/></div>
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

/* ——— Estates — the portfolio, Rosa's reference point ——— */
function EstateRow({ e, onOpen }) {
  const desk = useDesk();
  const open = desk.openCountEstate(e.id);
  const res = estateResidents(e.id);
  return (
    <button className="estrow" onClick={() => onOpen(e.id)}>
      <span className="estrow-m">
        <div className="estrow-n sf">{e.name}</div>
        <div className="estrow-s">{e.kind} · {e.beds} bed · {res.length} resident{res.length !== 1 ? "s" : ""}</div>
      </span>
      <span className="estrow-r">
        {open > 0 ? <span className="cxt-a">{open} open</span> : <span className="rres-clear">Clear</span>}
        <I.chev/>
      </span>
    </button>
  );
}

function EstatesSection() {
  const desk = useDesk();
  const [sort, setSort] = useState("area");
  const [openId, setOpenId] = useState(null);
  let groups;
  if (sort === "area") {
    const byArea = {};
    ESTATES.forEach((e) => { (byArea[e.area] = byArea[e.area] || []).push(e); });
    groups = Object.keys(byArea).sort().map((area) => [area, byArea[area]]);
  } else if (sort === "az") {
    groups = [[null, [...ESTATES].sort((a, b) => a.name.localeCompare(b.name))]];
  } else {
    groups = [[null, [...ESTATES].sort((a, b) => desk.openCountEstate(b.id) - desk.openCountEstate(a.id) || a.name.localeCompare(b.name))]];
  }
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">The estate desk</span><div className="ht sf">Estates</div></div>
      <div className="mgr-sum2">{ESTATES.length} estates in your care</div>
      <SortBar opts={[["area", "By area"], ["az", "A–Z"], ["open", "Most open"]]} sort={sort} setSort={setSort}/>
      <div className="mgr-list">
        {groups.map(([label, list]) => (
          <div key={label || "all"}>
            {label && <div className="mgr-grp">{label}</div>}
            {list.map((e) => <EstateRow key={e.id} e={e} onOpen={setOpenId}/>)}
          </div>
        ))}
      </div>
      <div style={{ height: 8 }}/>
      {openId && <EstateDetail id={openId} onClose={() => setOpenId(null)}/>}
    </div>
  );
}

/* ——— Residents — grouped by estate, sortable ——— */
function ResidentRow({ p, onOpen, showEstate = true }) {
  const desk = useDesk();
  const open = desk.openCountResident(p.id);
  const e = byEst(p.estate);
  return (
    <button className="rres" onClick={() => onOpen(p.id)}>
      <span className="dqav">{p.init}</span>
      <span className="rres-m">
        <div className="rres-name sf">{p.name}{p.role === "Co-resident" && <span className="rres-role"> · Co-resident</span>}</div>
        <div className="rres-est">{showEstate ? `${e.short} · ${e.area}` : p.role}</div>
      </span>
      <span className="rres-r">{open > 0 ? <span className="cxt-a">{open} open</span> : <span className="rres-clear">All clear</span>}<I.chev/></span>
    </button>
  );
}

function ResidentsSection() {
  const desk = useDesk();
  const [sort, setSort] = useState("estate");
  const [openId, setOpenId] = useState(null);
  let groups;
  if (sort === "estate") {
    groups = ESTATES.map((e) => [e.short, estateResidents(e.id)]).filter(([, list]) => list.length);
  } else if (sort === "az") {
    groups = [[null, [...RESIDENTS].sort((a, b) => a.name.localeCompare(b.name))]];
  } else {
    groups = [[null, [...RESIDENTS].sort((a, b) => desk.openCountResident(b.id) - desk.openCountResident(a.id) || a.name.localeCompare(b.name))]];
  }
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">The estate desk</span><div className="ht sf">Residents</div></div>
      <div className="mgr-sum2">{RESIDENTS.length} residents across your estates</div>
      <SortBar opts={[["estate", "By estate"], ["az", "A–Z"], ["open", "Needs attention"]]} sort={sort} setSort={setSort}/>
      <div className="mgr-list">
        {groups.map(([label, list]) => (
          <div key={label || "all"}>
            {label && <div className="mgr-grp">{label}</div>}
            {list.map((p) => <ResidentRow key={p.id} p={p} onOpen={setOpenId} showEstate={sort !== "estate"}/>)}
          </div>
        ))}
      </div>
      <div style={{ height: 8 }}/>
      {openId && <ResidentDetail id={openId} onClose={() => setOpenId(null)}/>}
    </div>
  );
}

/* ——— Schedule — upcoming visits (redesign is Pass 2) ——— */
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
                  <div className="sentry-s">{r.who} · {r.estateShort}</div>
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

/* ——— Account — Rosa's own (rework is Pass 2) ——— */
function AccountSection() {
  const desk = useDesk();
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
        <div className="prow"><span className="pk">Estates</span><span className="pv">{ESTATES.length}</span></div>
        <div className="prow"><span className="pk">Open requests</span><span className="pv">{c.open}</span></div>
        <div className="prow"><span className="pk">Resolved recently</span><span className="pv">{c.done}</span></div>
      </div>
      <button className="signout">Sign out</button>
      <div style={{ height: 8 }}/>
    </div>
  );
}

/* ——— detail sheets ——— */
function ReqMini({ r }) {
  const Ico = I[CX_ICON[r.category]] || I.dots;
  return (
    <div className="reqmini">
      <span className="reqmini-ic"><Ico/></span>
      <span className="reqmini-m"><div className="reqmini-t sf">{r.title}</div><div className="reqmini-s"><StatusChip r={r}/></div></span>
      <span className="reqmini-w">{r.time}</span>
    </div>
  );
}

function EstateDetail({ id, onClose }) {
  const desk = useDesk();
  const e = byEst(id);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  if (!e) return null;
  const res = estateResidents(id);
  const reqs = desk.forEstate(id);
  const open = reqs.filter((r) => r.status !== "resolved");
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{ flex: 1 }}><div className="sh-title sf">{e.name}</div><div className="sh-sub">{e.area}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{ paddingTop: 8 }}>
      <div className="est-addr"><I.home/><span>{e.address}</span></div>
      <div className="est-specs">{e.kind} · {e.beds} bed · {e.baths} bath · {e.size} m²</div>
      <p className="est-about">{e.about}</p>

      <div className="sect"><div className="sect-h"><span className="l">Residents</span><span className="a">{res.length}</span></div>
        {res.map((p) => (
          <div className="est-res" key={p.id}>
            <span className="dqav">{p.init}</span>
            <span className="est-res-m"><div className="est-res-n sf">{p.name}</div><div className="est-res-s">{p.role} · since {p.since}</div></span>
            <a className="est-res-tel" href={"tel:" + p.phone.replace(/\s/g, "")}>{p.phone}</a>
          </div>
        ))}
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Lease</span></div>
        <div className="prow"><span className="pk">Term</span><span className="pv">{e.lease.term}</span></div>
        <div className="prow"><span className="pk">Rent</span><span className="pv num">{money(e.lease.rent)}/mo</span></div>
        <div className="prow"><span className="pk">Deposit</span><span className="pv num">{money(e.lease.deposit)}</span></div>
        <div className="est-lease-note">{e.lease.note}</div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Open requests</span><span className="a">{open.length}</span></div>
        {open.length ? open.map((r) => <ReqMini key={r.id} r={r}/>) : <div className="calm"><I.leaf/>Nothing open here.</div>}
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Amenities</span></div>
        <div className="amen">{e.amenities.map((a) => <div className="am-r" key={a}><span className="sf">{a}</span></div>)}</div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Documents</span></div>
        {e.docs.map((d) => (
          <div className="doc" key={d.t}>
            <span style={{ flex: 1, minWidth: 0 }}><span className="dl sf">{d.t}</span><span className="doc-sum">{d.tag}</span></span>
            <span className="dc"><I.chev/></span></div>
        ))}
      </div>
      <div style={{ height: 8 }}/>
    </div>
  </div></div>);
}

function ResidentDetail({ id, onClose }) {
  const desk = useDesk();
  const p = byRes(id);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  if (!p) return null;
  const e = byEst(p.estate);
  const reqs = desk.forResident(id);
  const open = reqs.filter((r) => r.status !== "resolved");
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span className="dd-av">{p.init}</span>
      <span style={{ flex: 1 }}><div className="sh-title sf">{p.name}</div><div className="sh-sub">{p.role} · since {p.since}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{ paddingTop: 8 }}>
      <div className="res-contact">
        <a className="res-contact-b" href={"tel:" + p.phone.replace(/\s/g, "")}><I.msg/>Call</a>
        <a className="res-contact-b" href={"mailto:" + p.email}><I.mail/>Email</a>
      </div>
      <div className="res-tel">{p.phone} · {p.email}</div>

      <div className="sect"><div className="sect-h"><span className="l">Residence</span></div>
        <div className="res-est"><div className="res-est-n sf">{e.name}</div><div className="res-est-a">{e.address}</div>
          <div className="res-est-s">{e.kind} · {e.beds} bed · {e.baths} bath · {e.size} m²</div></div>
        <div className="prow"><span className="pk">Lease</span><span className="pv" style={{ fontSize: 13 }}>{e.lease.term}</span></div>
        <div className="prow"><span className="pk">Rent</span><span className="pv num">{money(e.lease.rent)}/mo</span></div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Requests</span><span className="a">{open.length} open</span></div>
        {reqs.length ? reqs.map((r) => <ReqMini key={r.id} r={r}/>) : <div className="calm"><I.leaf/>No requests on file.</div>}
      </div>
      <div style={{ height: 8 }}/>
    </div>
  </div></div>);
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
