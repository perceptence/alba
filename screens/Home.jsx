import { useCx, CX_STATUS } from "@/lib/conciergeStore";
import { useNotices, ntBrief } from "@/lib/noticesStore";
import { RES, ADRIEN, AV, PAYMENTS } from "@/lib/data";
import { money } from "@/lib/util";
import { I } from "@/components/icons";
import { Elevation } from "@/components/Elevation";
import { TextLink } from "@/components/TextLink";
import { Avatar } from "@/components/Avatar";

export function Home({ go, openRes, openRent, openNotices, onOpenRequest }) {
  const cx=useCx();
  const nt=useNotices();
  const openReq=cx.all().find(r=>r.status==="in_progress"||r.status==="scheduled");
  const openCount=cx.all().filter(r=>r.status!=="resolved"&&r.status!=="cancelled").length;
  const upcoming=cx.all().filter(r=>(r.status==="scheduled"||r.status==="in_progress")&&r.scheduledFor);
  const recent=PAYMENTS.slice(0,2);
  return (
    <div className="pc stag pc-home">
      <div className="top">
        <span className="eye">Saturday · 5 July</span>
        <button className="icob" onClick={openNotices} aria-label="Notices"><I.bell/>{nt.unreadCount()>0&&<span className="dot"/>}</button>
      </div>
      <div className="hero-greet"><span className="g1">Good evening,</span><br/><span className="g2">{ADRIEN.first}.</span></div>

      <button className="respanel" onClick={openRes}>
        <Elevation h={160}/>
        <div className="res-name sf">{RES.name}</div>
        <div className="res-meta">{RES.city} · Resident since 2023</div>
        <TextLink>View residence</TextLink>
      </button>

      <button className="deskbrief" onClick={openNotices}>
        <div className="db-eye">From the desk · Just now</div>
        <div className="db-text sf">{ntBrief(nt.all(), 2)}</div>
        <div className="db-foot">
          <span className="db-sign"><Avatar cfg={AV.rosa} size={22}/><span className="db-by">Rosa · Estate manager</span></span>
          <span className="db-more">{nt.unreadCount()} new<I.arrow/></span>
        </div>
      </button>

      <div className="home-grid">
        <div className="sect">
          <div className="sect-h"><span className="l">At a glance</span></div>
          <button className="grow" onClick={openRent}>
            <span className="gm">
              <span className="gtop"><span className="gl">Rent</span></span>
              <div className="gt sf">{money(RES.rent)}</div>
              <div className="gs"><span className="st-g">Settled</span> · Autopay on 1 August</div>
            </span>
            <span className="gc"><I.chev/></span>
          </button>
          <button className="grow" onClick={openRes}>
            <span className="gm">
              <span className="gtop"><span className="gl">Lease</span></span>
              <div className="gt sf">8 months remaining</div>
              <div className="gs"><span className="st-g">On term</span> · Through {ADRIEN.leaseEnd}</div>
            </span>
            <span className="gc"><I.chev/></span>
          </button>
          <button className="grow" onClick={()=>go("concierge")}>
            <span className="gm">
              <span className="gtop"><span className="gl">Concierge</span></span>
              <div className="gt sf">{openCount} request{openCount===1?"":"s"} in care</div>
              <div className="gs">{openReq?<><span className="st-a">{CX_STATUS[openReq.status].label}</span> · {openReq.title}</>:"Nothing pending"}</div>
            </span>
            <span className="gc"><I.chev/></span>
          </button>
        </div>

        <div className="sect home-only">
          <div className="sect-h"><span className="l">Upcoming at the estate</span></div>
          {upcoming.length>0?upcoming.map(r=>(
            <button className="urow urow-link" key={r.id} onClick={()=>onOpenRequest(r.id)}>
              <span className="um"><span className="ut sf">{r.title}</span><span className="us">{r.scheduledFor}</span></span>
              <span className="uc"><I.chev/></span>
            </button>
          )):<div className="urow"><div className="us">Nothing scheduled</div></div>}
        </div>

        <button className="sect home-only home-paylink" onClick={openRent}>
          <div className="sect-h"><span className="l">Payments</span><span className="a">View all</span></div>
          <div className="urow"><div className="ut sf">{money(RES.rent)}</div><div className="us">Next · 1 August · Autopay</div></div>
          {recent.map(p=>(<div className="urow" key={p.id}><div className="ut sf">{p.month}</div><div className="us">Paid {p.paid}</div></div>))}
        </button>
      </div>
      <div style={{height:8}}/>
    </div>
  );
}
