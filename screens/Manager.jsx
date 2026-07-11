import { useState, useRef, useEffect } from "react";
import { useDesk, deskStore, TABS, ESTATES, RESIDENTS, byEst, byRes, estateResidents, deskAgenda, visitStore, useVisits, rentStatus, rentSummary, RENT_MONTHS, AREAS, reachOf, noticeStore, useNotices } from "@/lib/managerData";
import { CX_CATS, CX_STATUS, CX_TINT } from "@/lib/conciergeStore";
import { money } from "@/lib/util";
import { AV } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { Elevation } from "@/components/Elevation";
import { ManagerPresence } from "@/components/ManagerPresence";
import { useSheet } from "@/components/useSheet";
import { I } from "@/components/icons";

/* Rosa's side — the estate desk. An operator app across a portfolio of estates:
   requests to triage, the estates (and the people in them) as one book, a
   schedule and her own desk. Denser than the resident experience, built
   from the same design system, and — like the resident app — a bottom bar on
   phone, a left rail on desktop. */

const CX_ICON = { maintenance:"wrench", housekeeping:"towel", access:"key", delivery:"box", question:"msg", other:"dots" };
const OP_NAV = [
  ["requests", I.concierge, "Requests"],
  ["estates", I.home, "Estates"],
  ["schedule", I.cal, "Schedule"],
  ["account", I.person, "Desk"],
];
// What the estate page's back button returns to, by originating section.
const BACK_LABEL = { requests:"Requests", estates:"Estates", schedule:"Schedule", account:"Desk" };
// Every resident has a generative avatar (see AV in lib/data). Falls back to
// Adrien's config for any id we don't have art for.
const av = (id) => AV[id] || AV.adrien;

export function Manager({ push, onSubview }) {
  const [section, setSection] = useState("requests");
  // An open estate is a pushed page over whatever section it came from —
  // back returns there. On phone/tablet it hides the nav (a subview).
  const [estateId, setEstateId] = useState(null);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [section, estateId]);
  useEffect(() => { onSubview?.(!!estateId); return () => onSubview?.(false); }, [estateId, onSubview]);
  const go = (k) => { setEstateId(null); setSection(k); };
  return (
    <>
      <div className="scroll" ref={scrollRef}>
        {estateId ? <EstatePage id={estateId} backLabel={BACK_LABEL[section]} onBack={() => setEstateId(null)} push={push}/>
          : section === "requests" ? <RequestsSection push={push}/>
          : section === "estates" ? <PortfolioSection push={push} openEstate={setEstateId}/>
          : section === "schedule" ? <ScheduleSection push={push} openEstate={setEstateId}/>
          : <AccountSection push={push} openEstate={setEstateId}/>}
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
          <button key={k} className={section === k ? "on" : ""} onClick={() => go(k)}>
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
function StatusChip({ r, hideUrgent = false }) {
  const st = CX_STATUS[r.status];
  const flagged = !hideUrgent && r.priority === "Urgent" && r.status !== "resolved";
  return <>{flagged && <><span className="cxt-a">Urgent</span> · </>}{CX_CATS[r.category].tag} · <span className={"cxt-" + (CX_TINT[r.status] || "n")}>{st.label}</span></>;
}
// Sorting a list reuses the resident notices sort control — a single button
// showing the current mode, tapped to cycle. It sits on the count row (see
// the .mgr-bar wrapper) so it's anchored, not floating. (Filtering uses tabs;
// sorting uses this. Pills are gone from the product.)
function SortBar({ opts, sort, setSort }) {
  const idx = Math.max(0, opts.findIndex(([k]) => k === sort));
  const next = () => setSort(opts[(idx + 1) % opts.length][0]);
  return <button className="nt-sort" onClick={next}><I.sort/><span>{opts[idx][1]}</span></button>;
}

/* ——— Requests — the triage queue ——— */
// A triage line, not a message: the request type leads (category icon), the
// estate is the identifier, urgency is the priority bar, and the resident is
// demoted to the meta line.
function DeskRow({ r, onOpen }) {
  const Ico = I[CX_ICON[r.category]] || I.dots;
  const st = CX_STATUS[r.status];
  const urgent = r.priority === "Urgent" && r.status !== "resolved";
  return (
    <button className="dqrow" onClick={() => onOpen(r.id)}>
      <span className={"ric" + (urgent ? " ric-urgent" : "")}><Ico/></span>
      <span className="dqm">
        <div className="dqwho">{r.estate}</div>
        <div className="dqt sf">{r.title}</div>
        <div className="dqsub">{r.who} · <span className={"cxt-" + (CX_TINT[r.status] || "n")}>{st.label}</span></div>
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
        <span><span className="eye">Saturday · 5 July</span>
          <div className="hero-greet"><span className="g1">Good morning,</span><br/><span className="g2">Rosa.</span></div>
        </span>
        <Avatar cfg={AV.rosa} size={46}/>
      </div>
      <div className="mgr-hero">
        <div className="mgr-fig">
          <span className="mgr-fig-n sf num">{c.needs}</span>
          <span className="mgr-fig-l">request{c.needs !== 1 ? "s" : ""}<br/>need you</span>
        </div>
        <div className="mgr-stats">
          <div className="mgr-stat"><span className="mgr-stat-n sf num">{c.open}</span><span className="mgr-stat-l">open</span></div>
          <div className="mgr-stat"><span className="mgr-stat-n sf num">{c.done}</span><span className="mgr-stat-l">resolved</span></div>
        </div>
      </div>
      <div className="nt-tabs mgr-nt-tabs">
        {TABS.map((t) => {
          const n = reqs.filter(t.match).length;
          return <button key={t.key} className={"nt-tab" + (t.key === tab ? " on" : "")} onClick={() => setTab(t.key)}>{t.label}<span className="nt-tabn">{n}</span></button>;
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

/* ——— Estates — the portfolio as one book: the houses and the people in them.
   Two lenses over the same care — Estates opens the full estate page,
   Residents flies the person in. ——— */
function EstateRow({ e, onOpen }) {
  const desk = useDesk();
  const open = desk.openCountEstate(e.id);
  const urgent = desk.urgentCountEstate(e.id);
  const res = estateResidents(e.id);
  return (
    <button className="estrow" onClick={() => onOpen(e.id)}>
      <span className="estrow-m">
        <div className="estrow-n sf">{e.name}</div>
        <div className="estrow-s">{e.kind} · {e.beds} bed · {res.length} resident{res.length !== 1 ? "s" : ""}</div>
      </span>
      <span className="est-avs">
        {res.slice(0, 3).map((p) => <span className="est-av" key={p.id}><Avatar cfg={av(p.id)} size={24}/></span>)}
        {res.length > 3 && <span className="est-av est-av-n">+{res.length - 3}</span>}
      </span>
      <span className="estrow-r">
        {urgent > 0 ? <span className="cxt-a">Urgent</span>
          : open > 0 ? <span className="estrow-open">{open} open</span>
          : <span className="rres-clear">Clear</span>}
        <I.chev/>
      </span>
    </button>
  );
}

function ResidentRow({ p, onOpen, showEstate = true }) {
  const desk = useDesk();
  const open = desk.openCountResident(p.id);
  const e = byEst(p.estate);
  return (
    <button className="rres" onClick={() => onOpen(p.id)}>
      <Avatar cfg={av(p.id)} size={42}/>
      <span className="rres-m">
        <div className="rres-name sf">{p.name}{p.role === "Co-resident" && <span className="rres-role"> · Co-resident</span>}</div>
        <div className="rres-est">{showEstate ? `${e.short} · ${e.area}` : p.role}</div>
      </span>
      <span className="rres-r">{open > 0 ? <span className="cxt-a">{open} open</span> : <span className="rres-clear">All clear</span>}<I.chev/></span>
    </button>
  );
}

function PortfolioSection({ push, openEstate }) {
  const desk = useDesk();
  const [view, setView] = useState("estates");    // the lens: estates | residents
  const [estSort, setEstSort] = useState("area"); // each lens keeps its own sort
  const [resSort, setResSort] = useState("estate");
  const [resId, setResId] = useState(null);
  // Search folds behind an icon on the count bar; the icon becomes the close.
  // The open field is one hairline input line. Esc closes too.
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");
  const closeSearch = () => { setQ(""); setSearching(false); };
  // accent-insensitive: "reid" finds Reïd, "theo" finds Théo
  const fold = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const ql = fold(q.trim());
  let groups; // [label, list, kind] — kind picks the row (est | res)
  if (ql && view === "estates") {
    // Search stays in the lens but reaches across the relationship: an estate
    // row surfaces whether the query hits the estate OR anyone who lives there.
    groups = [[null, ESTATES.filter((e) =>
      fold(`${e.name} ${e.area} ${e.kind}`).includes(ql) ||
      estateResidents(e.id).some((p) => fold(p.name).includes(ql))
    ).sort((a, b) => a.name.localeCompare(b.name)), "est"]];
  } else if (ql) {
    // Residents lens: a person surfaces on their own name OR their estate's.
    groups = [[null, RESIDENTS.filter((p) => {
      const e = byEst(p.estate);
      return fold(p.name).includes(ql) || fold(`${e.name} ${e.short} ${e.area} ${e.kind}`).includes(ql);
    }).sort((a, b) => a.name.localeCompare(b.name)), "res"]];
  } else if (view === "estates") {
    if (estSort === "area") {
      const byArea = {};
      ESTATES.forEach((e) => { (byArea[e.area] = byArea[e.area] || []).push(e); });
      groups = Object.keys(byArea).sort().map((area) => [area, byArea[area], "est"]);
    } else if (estSort === "az") {
      groups = [[null, [...ESTATES].sort((a, b) => a.name.localeCompare(b.name)), "est"]];
    } else {
      // Needs attention — urgency first (an open request can be anything; what
      // matters is which estates have something pressing), then by open count.
      groups = [[null, [...ESTATES].sort((a, b) =>
        (desk.urgentCountEstate(b.id) - desk.urgentCountEstate(a.id)) ||
        (desk.openCountEstate(b.id) - desk.openCountEstate(a.id)) ||
        a.name.localeCompare(b.name)), "est"]];
    }
  } else if (resSort === "estate") {
    groups = ESTATES.map((e) => [e.short, estateResidents(e.id), "res"]).filter(([, list]) => list.length);
  } else if (resSort === "az") {
    groups = [[null, [...RESIDENTS].sort((a, b) => a.name.localeCompare(b.name)), "res"]];
  } else {
    groups = [[null, [...RESIDENTS].sort((a, b) =>
      (desk.urgentCountResident(b.id) - desk.urgentCountResident(a.id)) ||
      (desk.openCountResident(b.id) - desk.openCountResident(a.id)) ||
      a.name.localeCompare(b.name)), "res"]];
  }
  const found = ql ? groups[0][1].length : 0;
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">In your care</span><div className="ht sf">Estates</div></div>
      <div className="nt-tabs mgr-nt-tabs">
        <button className={"nt-tab" + (view === "estates" ? " on" : "")} onClick={() => setView("estates")}>Estates<span className="nt-tabn">{ESTATES.length}</span></button>
        <button className={"nt-tab" + (view === "residents" ? " on" : "")} onClick={() => setView("residents")}>Residents<span className="nt-tabn">{RESIDENTS.length}</span></button>
      </div>
      <div className="mgr-bar">
        <div className="mgr-sum2">{ql ? `${found} match${found === 1 ? "" : "es"}`
          : view === "estates" ? `${ESTATES.length} in your care` : `${RESIDENTS.length} across your estates`}</div>
        <span className="mgr-bar-r">
          {view === "estates"
            ? <SortBar opts={[["area", "By area"], ["az", "A–Z"], ["urgent", "Needs attention"]]} sort={estSort} setSort={setEstSort}/>
            : <SortBar opts={[["estate", "By estate"], ["az", "A–Z"], ["open", "Needs attention"]]} sort={resSort} setSort={setResSort}/>}
          {/* the same icon is the toggle: search when closed, a cross when open */}
          <button className="mgr-search-t" aria-label={searching ? "Close search" : "Search"}
            onClick={() => searching ? closeSearch() : setSearching(true)}>
            {searching ? <I.close/> : <I.search/>}
          </button>
        </span>
      </div>
      {searching && (
        <div className="assist mgr-search">
          <div className="ask">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={view === "estates" ? "Search the estates" : "Search the residents"} aria-label="Search"
              onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }}/>
            <button className="snd" aria-label="Search" onClick={(e) => e.currentTarget.previousElementSibling.blur()}><I.search/></button>
          </div>
        </div>
      )}
      <div className={"mgr-list" + (ql ? " mgr-list-q" : "")}>
        {ql && found === 0 && <div className="calm"><I.leaf/>Nothing by that name.</div>}
        {groups.map(([label, list, kind]) => (
          <div key={label || "all"}>
            {label && <div className="mgr-grp">{label}</div>}
            {kind === "est"
              ? list.map((e) => <EstateRow key={e.id} e={e} onOpen={openEstate}/>)
              : list.map((p) => <ResidentRow key={p.id} p={p} onOpen={setResId} showEstate={ql ? true : resSort !== "estate"}/>)}
          </div>
        ))}
      </div>
      <div style={{ height: 8 }}/>
      {resId && <ResidentDetail id={resId} onClose={() => setResId(null)} push={push} openEstate={(eid) => { setResId(null); openEstate(eid); }}/>}
    </div>
  );
}

/* ——— Schedule — a week agenda across the estates. Same line item as the
   resident Notices (.arow): stroke-circle icon, title, sub, time below.
   Request-driven entries open their request thread; routine visits (pool,
   trash, guests…) are reference only. Each carries a done-toggle, and today's
   first still-open visit wears a "Next up" flag. ——— */
function DeskEntry({ e, onOpen, onOpenVisit, done, isNext, onToggleDone }) {
  const Ico = I[e.icon] || I.dots;
  const [open, setOpen] = useState(false);
  const req = e.reqId ? deskStore.get(e.reqId) : null;
  const updates = req ? req.thread.slice(1) : []; // activity since the opening message
  return (
    <div className={"arow arow-static svisit" + (done ? " svisit-done" : "")}>
      <span className={"ai" + (e.reqId ? " ai-act" : "")}><Ico/></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        {isNext && <div className="svisit-next">Next up</div>}
        <div className="at sf">{e.title}</div>
        <div className="ad ad-loc">{e.sub}</div>
        {e.desc && <div className="ad">{e.desc}</div>}
        {e.window && <div className={"aw" + (e.reqId ? " aw-act" : "")}>{e.window}</div>}
        {/* request-linked → its thread (correspondence); once done it's a plain
           'View request' in ink. Other visits → a details flyout, no thread. */}
        {e.reqId
          ? <button className="a-act" onClick={() => onOpen(e.reqId)}>{done ? "View request" : "Follow along"}<I.arrow/></button>
          : <button className="a-act" onClick={() => onOpenVisit(e)}>View details<I.arrow/></button>}
        {!done && updates.length > 0 && <>
          <button className={"nt-more" + (open ? " open" : "")} onClick={() => setOpen((v) => !v)}>
            {updates.length} earlier update{updates.length === 1 ? "" : "s"}<I.chevD/></button>
          {open && <div className="nt-sub stag">{updates.map((m, i) => (
            <div className="nt-si" key={i}>
              <div className="st sf">{m.t}</div>
              <div className="sd">{m.f === "m" ? "Rosa" : req.who} · {m.at}</div>
            </div>))}</div>}
        </>}
      </span>
      <button className="svisit-check" onClick={onToggleDone} aria-pressed={done} aria-label={done ? "Mark not done" : "Mark done"}>{done && <I.check/>}</button>
    </div>
  );
}

/* A service visit or guest arrival, in detail — the estate, timing, vendor and
   description. No correspondence (there's no resident thread); Rosa can open the
   estate or tick it done from here. */
function VisitDetail({ e, onClose, push, openEstate }) {
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const visits = useVisits();
  const done = visits.isDone(e.id);
  const est = e.estId ? byEst(e.estId) : null;
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{ flex: 1 }}><div className="sh-title sf">{e.title}</div><div className="sh-sub">{e.sub}{e.window ? " · " + e.window : ""}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{ paddingTop: 8 }}>
      {done && <div className="dd-tags"><span className="dd-status cxt-g">Done</span></div>}
      <p className="nd-body">{e.desc}</p>
      <div className="sect"><div className="sect-h"><span className="l">Visit</span></div>
        <div className="prow"><span className="pk">When</span><span className="pv">{e.dow}{e.window ? " · " + e.window : ""}</span></div>
        {e.vendor && <div className="prow"><span className="pk">Vendor</span><span className="pv sf">{e.vendor}</span></div>}
        {est && <div className="prow"><span className="pk">Estate</span><span className="pv">{est.short} · {est.area}</span></div>}
      </div>
      {est && openEstate && <button className="a-act" onClick={() => { close(); openEstate(est.id); }}>Open the estate<I.arrow/></button>}
    </div>
    <div className="sh-foot dd-foot">
      <button className={"cta" + (done ? " ghost" : "")} onClick={() => { visitStore.toggle(e.id); push({ t: done ? "Marked open" : "Marked done", d: e.title }); close(); }}>
        {done ? "Mark as open" : <><I.check/>Mark done</>}</button>
    </div>
  </div></div>);
}

function ScheduleSection({ push, openEstate }) {
  useDesk(); // re-render when a request changes; week agenda across the estates
  const visits = useVisits();
  const { days, tail } = deskAgenda();
  const [openId, setOpenId] = useState(null);      // request thread
  const [openVisit, setOpenVisit] = useState(null); // visit detail (non-request)
  // done visits sink to the bottom of their day; order otherwise is preserved.
  const ordered = (entries) => [...entries].sort((a, b) => visits.isDone(a.id) - visits.isDone(b.id));
  // Next up — today's first visit that isn't ticked off yet.
  const today = days.find((d) => d.isToday);
  const nextId = today && ordered(today.entries).find((e) => !visits.isDone(e.id))?.id;
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">The week ahead</span><div className="ht sf">Schedule</div></div>
      <div className="sweek">
        {days.map((d) => {
          const total = d.entries.length;
          const doneN = d.entries.filter((e) => visits.isDone(e.id)).length;
          const allDone = total > 0 && doneN === total;
          // today reads as work to do; other days are just a count.
          const count = d.isToday
            ? (doneN === 0 ? `${total} pending` : allDone ? "All done" : `${doneN} of ${total} done`)
            : total;
          return (
          <div className="sday" key={d.dow}>
            <div className="sday-h">
              <span className="sday-l">{d.label}</span>
              {d.label !== d.dow && <span className="sday-dow">{d.dow}</span>}
              <span className={"sday-n" + (d.isToday && allDone ? " sday-n-done" : "")}>{count}</span>
            </div>
            {total === 0
              ? <div className="sday-empty">A clear day — nothing scheduled</div>
              : ordered(d.entries).map((e) => <DeskEntry key={e.id} e={e} onOpen={setOpenId} onOpenVisit={setOpenVisit}
                  done={visits.isDone(e.id)} isNext={e.id === nextId} onToggleDone={() => visitStore.toggle(e.id)}/>)}
          </div>
        );})}
        {tail && <div className="sday-tail"><I.seal/>That's the week — nothing else on the books.</div>}
      </div>
      <div style={{ height: 8 }}/>
      {openId && <DeskDetail id={openId} onClose={() => setOpenId(null)} push={push}/>}
      {openVisit && <VisitDetail e={openVisit} onClose={() => setOpenVisit(null)} push={push} openEstate={openEstate}/>}
    </div>
  );
}

/* ——— The Desk — Rosa's command surface: the money, the notices, her profile ——— */
function RentRow({ e, month, onOpen }) {
  const rs = rentStatus(e.id, month);
  const tone = rs.state === "paid" ? "g" : rs.state === "overdue" ? "a" : "n";
  const label = rs.state === "paid" ? "Paid" : rs.state === "overdue" ? "Overdue" : "Due Jul 5";
  return (
    <button className="estrow" onClick={() => onOpen(e.id)}>
      <span className="estrow-m">
        <div className="estrow-n sf">{e.short}</div>
        <div className="estrow-s">{money(e.lease.rent)}/mo</div>
      </span>
      <span className="estrow-r"><span className={"gpill gpill-" + tone}>{label}</span><I.chev/></span>
    </button>
  );
}

function NoticeRow({ n, onOpen }) {
  const needsResend = n.state === "needs-resend";
  return (
    <div className="arow arow-static">
      <span className="ai"><I.bell/></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <div className="at sf">{n.title}</div>
        <div className="ad ad-loc">{n.scope} · {n.reach} resident{n.reach !== 1 ? "s" : ""}</div>
        <div className="ad">{n.body}</div>
        <div className="aw">{needsResend && <span className="need">Needs resend · </span>}{n.state === "scheduled" ? "Scheduled · " : ""}{n.at}</div>
        <button className="a-act" onClick={() => onOpen(n.id)}>View notice<I.arrow/></button>
      </span>
    </div>
  );
}

function NoticeDetail({ id, onClose, push }) {
  const nt = useNotices();
  const n = nt.get(id);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  if (!n) return null;
  const scheduled = n.state === "scheduled";
  const needsResend = n.state === "needs-resend";
  const stateLabel = scheduled ? "Scheduled" : needsResend ? "Needs resend" : "Sent";
  const stateTone = scheduled ? "n" : needsResend ? "a" : "g";
  const act = (fn, t) => { fn(id); push({ t, d: `To ${n.reach} resident${n.reach !== 1 ? "s" : ""} · ${n.scope}` }); close(); };
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{ flex: 1 }}><div className="sh-title sf">{n.title}</div><div className="sh-sub">{n.scope} · {n.reach} resident{n.reach !== 1 ? "s" : ""}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{ paddingTop: 8 }}>
      <div className="dd-tags"><span className={"dd-status cxt-" + stateTone}>{stateLabel}</span><span className="nd-when">{n.at}</span></div>
      <p className="nd-body">{n.body}</p>
    </div>
    <div className="sh-foot dd-foot">
      {scheduled && <button className="cta" onClick={() => act(noticeStore.sendNow, "Notice sent")}><I.send/>Send now</button>}
      {needsResend && <button className="cta" onClick={() => act(noticeStore.resend, "Notice resent")}><I.send/>Resend</button>}
      {!scheduled && !needsResend && <button className="cta ghost" onClick={() => act(noticeStore.resend, "Notice resent")}>Resend</button>}
    </div>
  </div></div>);
}

function NoticeComposer({ onClose, push }) {
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const [scope, setScope] = useState("All estates");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const reach = reachOf(scope);
  const valid = title.trim() && body.trim();
  const send = () => {
    if (!valid) return;
    noticeStore.send({ title: title.trim(), body: body.trim(), scope, reach });
    push({ t: "Notice sent", d: `To ${reach} resident${reach !== 1 ? "s" : ""} · ${scope}` });
    close();
  };
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{ flex: 1 }}><div className="sh-title sf">Compose a notice</div><div className="sh-sub">Posts to residents' Notices</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{ paddingTop: 8 }}>
      <div className="flab" style={{ marginTop: 0 }}>Send to</div>
      <div className="scope">
        {["All estates", ...AREAS].map((s) => (
          <button key={s} className={"scope-c" + (scope === s ? " on" : "")} onClick={() => setScope(s)}>{s}</button>
        ))}
      </div>
      <div className="acct-reach">{reach} resident{reach !== 1 ? "s" : ""} will receive this</div>
      <div className="flab">Title</div>
      <div className="co-field-line"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Gate code rotation this weekend"/></div>
      <div className="flab">Message</div>
      <div className="co-field"><textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What should residents know?"/></div>
    </div>
    <div className="sh-foot">
      <button className="cta" disabled={!valid} style={!valid ? { opacity: .4 } : undefined} onClick={send}><I.send/>Send notice</button>
    </div>
  </div></div>);
}

function AccountSection({ push, openEstate }) {
  const nt = useNotices();
  const [month, setMonth] = useState("July");
  const [ntab, setNtab] = useState("sent");
  const [compose, setCompose] = useState(false);
  const [openNotice, setOpenNotice] = useState(null);
  const rent = rentSummary(month);
  const outstanding = ESTATES.filter((e) => rentStatus(e.id, month).state !== "paid");
  const paid = ESTATES.filter((e) => rentStatus(e.id, month).state === "paid");
  const notices = nt.all();
  const sentCount = notices.filter((n) => n.state !== "scheduled").length;
  const schedCount = notices.filter((n) => n.state === "scheduled").length;
  const shown = notices.filter((n) => ntab === "scheduled" ? n.state === "scheduled" : n.state !== "scheduled");
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">The estate desk</span><div className="ht sf">Desk</div></div>
      <div className="prof-head">
        <span className="prof-av"><Avatar cfg={AV.rosa} size={56}/></span>
        <div className="prof-idty">
          <div className="prof-name sf">Rosa Ibáñez</div>
          <div className="prof-place">Estate manager · Bel-Air &amp; the Westside</div>
        </div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Rent</span></div>
        <div className="nt-tabs mgr-nt-tabs">
          {RENT_MONTHS.map((m) => <button key={m} className={"nt-tab" + (m === month ? " on" : "")} onClick={() => setMonth(m)}>{m}</button>)}
        </div>
        <div className="acct-hd">
          <span className="acct-hd-v sf num">{money(rent.collected)}</span>
          {rent.outstanding > 0
            ? <span className="acct-hd-out">{money(rent.outstanding)} outstanding</span>
            : <span className="acct-hd-set">All settled</span>}
        </div>
        <div className="acct-bar"><span className="acct-bar-f" style={{ width: (rent.collected / rent.expected * 100).toFixed(0) + "%" }}/></div>
        <div className="acct-hd-l">collected of {money(rent.expected)}</div>

        {outstanding.length > 0 && <>
          <div className="mgr-grp acct-grp">Outstanding · {money(rent.outstanding)}</div>
          {outstanding.map((e) => <RentRow key={e.id} e={e} month={month} onOpen={openEstate}/>)}
        </>}
        <div className="mgr-grp acct-grp">Collected · {money(rent.collected)}</div>
        {paid.map((e) => <RentRow key={e.id} e={e} month={month} onOpen={openEstate}/>)}
      </div>

      <div className="sect acct-notices"><div className="sect-h sect-h-act"><span className="l">Notices</span><button className="sect-act" onClick={() => setCompose(true)}><I.plus/>Compose</button></div>
        <div className="nt-tabs mgr-nt-tabs">
          <button className={"nt-tab" + (ntab === "sent" ? " on" : "")} onClick={() => setNtab("sent")}>Sent<span className="nt-tabn">{sentCount}</span></button>
          <button className={"nt-tab" + (ntab === "scheduled" ? " on" : "")} onClick={() => setNtab("scheduled")}>Scheduled<span className="nt-tabn">{schedCount}</span></button>
        </div>
        <div className="mgr-nt-list">
          {shown.length === 0
            ? <div className="calm"><I.leaf/>Nothing here yet.</div>
            : shown.map((n) => <NoticeRow key={n.id} n={n} onOpen={setOpenNotice}/>)}
        </div>
      </div>

      <button className="signout" onClick={() => push({ t: "Signed out", d: "See you soon, Rosa" })}>Sign out</button>
      <div style={{ height: 8 }}/>
      {compose && <NoticeComposer onClose={() => setCompose(false)} push={push}/>}
      {openNotice && <NoticeDetail id={openNotice} onClose={() => setOpenNotice(null)} push={push}/>}
    </div>
  );
}

/* ——— detail sheets ——— */
// Tappable — opens the full request detail. Used inside estate & resident sheets.
function ReqMini({ r, onOpen }) {
  const Ico = I[CX_ICON[r.category]] || I.dots;
  return (
    <button className="reqmini" onClick={() => onOpen(r.id)}>
      <span className="reqmini-ic"><Ico/></span>
      <span className="reqmini-m"><div className="reqmini-t sf">{r.title}</div><div className="reqmini-s"><StatusChip r={r}/></div></span>
      <span className="reqmini-w">{r.time}</span>
      <span className="reqmini-c"><I.chev/></span>
    </button>
  );
}

// A compact person row (avatar · name · role) that opens a resident. Reused for
// an estate's roster and for co-residents inside a resident's sheet.
function PersonRow({ p, onOpen }) {
  return (
    <button className="est-res" onClick={() => onOpen(p.id)}>
      <Avatar cfg={av(p.id)} size={38}/>
      <span className="est-res-m"><div className="est-res-n sf">{p.name}</div><div className="est-res-s">{p.role} · since {p.since}</div></span>
      <I.chev/>
    </button>
  );
}

/* The estate, as a full page — pushed over whatever section opened it. The
   architectural elevation draws itself in; the people fly in as panels. */
function EstatePage({ id, backLabel, onBack, push }) {
  const desk = useDesk();
  const e = byEst(id);
  const [resId, setResId] = useState(null);
  const [reqId, setReqId] = useState(null);
  if (!e) return null;
  const res = estateResidents(id);
  const reqs = desk.forEstate(id);
  const open = reqs.filter((r) => r.status !== "resolved");
  return (<>
    <div className="pc stag">
      <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">{backLabel}</span></div>
      <div className="est-fig"><Elevation h={150} variant={e.id}/></div>
      <div className="phead est-phead">
        <span className="eye">{e.area} · {e.kind}</span>
        <div className="ht sf">{e.name}</div>
      </div>
      <div className="est-addr"><I.home/><span>{e.address}</span></div>
      <div className="est-specs">{e.beds} bed · {e.baths} bath · {e.size} m²</div>
      <p className="est-about">{e.about}</p>

      <div className="sect"><div className="sect-h"><span className="l">Residents</span><span className="a">{res.length}</span></div>
        {res.map((p) => <PersonRow key={p.id} p={p} onOpen={setResId}/>)}
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Lease</span></div>
        <div className="prow"><span className="pk">Term</span><span className="pv">{e.lease.term}</span></div>
        <div className="prow"><span className="pk">Rent</span><span className="pv num">{money(e.lease.rent)}/mo</span></div>
        <div className="prow"><span className="pk">This month</span><span className="pv">{(() => { const rs = rentStatus(e.id); const tone = rs.state === "paid" ? "g" : rs.state === "overdue" ? "a" : "n"; return <span className={"gpill gpill-" + tone}>{rs.on}</span>; })()}</span></div>
        <div className="prow"><span className="pk">Deposit</span><span className="pv num">{money(e.lease.deposit)}</span></div>
        <div className="est-lease-note">{e.lease.note}</div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Open requests</span><span className="a">{open.length}</span></div>
        {open.length ? open.map((r) => <ReqMini key={r.id} r={r} onOpen={setReqId}/>) : <div className="calm"><I.leaf/>Nothing open here.</div>}
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
    {resId && <ResidentDetail id={resId} onClose={() => setResId(null)} push={push}/>}
    {reqId && <DeskDetail id={reqId} onClose={() => setReqId(null)} push={push}/>}
  </>);
}

function ResidentDetail({ id, onClose, push, openEstate }) {
  const desk = useDesk();
  const [rid, setRid] = useState(id);   // co-residents swap the viewed person in place
  const [reqId, setReqId] = useState(null);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const p = byRes(rid);
  if (!p) return null;
  const e = byEst(p.estate);
  const reqs = desk.forResident(rid);
  const open = reqs.filter((r) => r.status !== "resolved");
  const household = estateResidents(p.estate).filter((x) => x.id !== p.id);
  return (<>
    <div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><Avatar cfg={av(p.id)} size={44}/>
      <span style={{ flex: 1 }}><div className="sh-title sf">{p.name}</div><div className="sh-sub">{p.role} · since {p.since}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{ paddingTop: 8 }}>
      <div className="res-contact">
        <a className="res-contact-b" href={"tel:" + p.phone.replace(/\s/g, "")}><I.phone/>Call</a>
        <a className="res-contact-b" href={"mailto:" + p.email}><I.mail/>Email</a>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Residence</span></div>
        <div className="res-est"><div className="res-est-n sf">{e.name}</div><div className="res-est-a">{e.address}</div>
          <div className="res-est-s">{e.kind} · {e.beds} bed · {e.baths} bath · {e.size} m²</div>
          {openEstate && <button className="a-act" onClick={() => { close(); openEstate(e.id); }}>Open the estate<I.arrow/></button>}</div>
        <div className="prow"><span className="pk">Lease</span><span className="pv" style={{ fontSize: 13 }}>{e.lease.term}</span></div>
        <div className="prow"><span className="pk">Rent</span><span className="pv num">{money(e.lease.rent)}/mo</span></div>
      </div>

      {household.length > 0 && (
        <div className="sect"><div className="sect-h"><span className="l">Household</span><span className="a">{household.length}</span></div>
          {household.map((x) => <PersonRow key={x.id} p={x} onOpen={setRid}/>)}
        </div>
      )}

      <div className="sect"><div className="sect-h"><span className="l">Requests</span><span className="a">{open.length} open</span></div>
        {reqs.length ? reqs.map((r) => <ReqMini key={r.id} r={r} onOpen={setReqId}/>) : <div className="calm"><I.leaf/>No requests on file.</div>}
      </div>
      <div style={{ height: 8 }}/>
    </div>
    </div></div>
    {reqId && <DeskDetail id={reqId} onClose={() => setReqId(null)} push={push}/>}
  </>);
}

// The milestone journey for a request, so the detail paints the whole track
// (mirrors the resident side). Derived from status; the current step carries
// the ETA, the first the arrival time.
const DESK_JOURNEY = {
  request: ["submitted", "acknowledged", "scheduled", "in_progress", "resolved"],
  question: ["submitted", "acknowledged", "resolved"],
};
function deskMilestones(r) {
  const order = DESK_JOURNEY[CX_CATS[r.category].kind] || DESK_JOURNEY.request;
  const cur = order.indexOf(r.status);
  const resolved = r.status === "resolved";
  return order.map((s, i) => {
    const state = i < cur ? "done" : i === cur ? (resolved ? "done" : "now") : "future";
    let detail = "";
    if (s === "submitted") detail = r.time;
    if (i === cur && !resolved && r.eta) detail = r.eta;
    return { label: CX_STATUS[s].label, state, detail };
  });
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
  const ms = deskMilestones(r);
  const cur = ms.find((m) => m.state === "now") || ms[ms.length - 1];

  const ack = () => { deskStore.acknowledge(id); push({ t: "Acknowledged", d: `${r.who} has been notified` }); };
  const resolve = () => { deskStore.resolve(id); push({ t: "Marked resolved", d: r.title }); close(); };
  const send = () => { const t = reply.trim(); if (!t) return; setReply(""); deskStore.reply(id, t); push({ t: "Reply sent", d: `To ${r.who}` }); };

  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head">
      <span style={{ flex: 1 }}><div className="sh-title sf">{r.estate}</div><div className="sh-sub">{r.area} · {CX_CATS[r.category].tag}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button>
    </div>
    <div className="sh-body" style={{ paddingTop: 8 }}>
      <div className="dd-tags">
        {r.priority === "Urgent" && !done && <span className="dd-urgent">Urgent</span>}
        <span className={"dd-status cxt-" + (CX_TINT[r.status] || "n")}>{st.label}</span>
      </div>
      <div className="dd-title sf">{r.title}</div>

      <div className={"dd-track-wrap tc-" + (CX_TINT[r.status] || "n")}>
        <div className="dd-track">
          {ms.flatMap((m, i) => [
            i > 0 && <span key={"s" + i} className={"dd-seg" + ((m.state === "done" || m.state === "now") ? " on" : "")}/>,
            <span key={"n" + i} className={"dd-node " + m.state}/>,
          ])}
        </div>
        <div className="dd-track-cap"><span className="dd-track-now">{cur.label}</span>{cur.detail ? " · " + cur.detail : ""}</div>
      </div>

      <div className="flab">Correspondence</div>
      <div className="thread">{r.thread.map((m, i) => (
        <div key={i} className={"bw " + (m.f === "m" ? "me" : "them")}>
          <span><div className="bub">{m.t}</div><div className="bt2">{m.f === "r" ? r.who.split(" ")[0] + " · " : ""}{m.at}</div></span>
        </div>))}</div>

      {!done && <>
        <div className="flab">Reply to {r.who.split(" ")[0]}</div>
        <div className="assist dd-reply"><div className="ask">
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="A quick note back…"/>
          <button className="snd" disabled={!reply.trim()} onClick={send} aria-label="Send"><I.send/></button>
        </div></div>
      </>}
    </div>
    <div className="sh-foot dd-foot">
      {isNew && <button className="cta ghost" onClick={ack}>Acknowledge</button>}
      {!done && <button className="cta" onClick={resolve}>Resolve</button>}
      {done && <div className="dd-done"><I.check/>Resolved</div>}
    </div>
  </div></div>);
}
