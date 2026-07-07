import { useCx, CX_STATUS } from "@/lib/conciergeStore";
import { useNotices, ntBrief } from "@/lib/noticesStore";
import { useGuests } from "@/lib/guestStore";
import { weekPreview } from "@/lib/schedule";
import { RES, ADRIEN, LEASE, AV, PAYMENTS } from "@/lib/data";
import { money } from "@/lib/util";
import { I } from "@/components/icons";
import { Elevation } from "@/components/Elevation";
import { TextLink } from "@/components/TextLink";
import { Avatar } from "@/components/Avatar";

export function Home({ go, openRes, openRent, openNotices, onOpenRequest, openSchedule, openGuests }) {
  const cx=useCx();
  const nt=useNotices();
  const guests=useGuests();
  const gActive=guests.all().filter(p=>p.status!=="revoked").length;
  const nextG=guests.live().find(p=>p.status==="upcoming");
  const openReq=cx.all().find(r=>r.status==="in_progress"||r.status==="scheduled");
  const openCount=cx.all().filter(r=>r.status!=="resolved"&&r.status!=="cancelled").length;
  const week=weekPreview(3);
  const recent=PAYMENTS.slice(0,1);
  return (
    <div className="pc stag pc-home">
      <div className="hometop">
        <div className="ht-meta">
          <span className="eye">Saturday · 5 July</span>
          <span className="settled"><I.seal/>All settled today</span>
        </div>
        <button className={"icob"+(nt.unreadCount()>0?" has-new":"")} onClick={openNotices} aria-label="Notices"><I.bell/></button>
        <div className="hero-greet"><span className="g1">Good evening,</span><br/><span className="g2">{ADRIEN.first}.</span></div>
      </div>

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
              <div className="gt sf">{LEASE.remaining} months remaining</div>
              <div className="gs"><span className="st-g">On term</span> · Through {LEASE.termEnd}</div>
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
          <button className="grow" onClick={openGuests}>
            <span className="gm">
              <span className="gtop"><span className="gl">Guests</span></span>
              <div className="gt sf">{gActive} active pass{gActive===1?"":"es"}</div>
              <div className="gs">{nextG?<>{nextG.name.split(" ")[0]} arrives {nextG.arrive}</>:"Grant time-boxed access"}</div>
            </span>
            <span className="gc"><I.chev/></span>
          </button>
        </div>

        <div className="sect">
          <div className="sect-h"><span className="l">This week</span><button className="a" onClick={openSchedule}>Full schedule</button></div>
          {week.length>0?week.map((e,i)=>(
            <button className="urow urow-link" key={i} onClick={()=>e.to?onOpenRequest(e.to.id):openSchedule()}>
              <span className="um"><span className="ut sf">{e.title}</span><span className="us">{e.day}{e.window?" · "+e.window:""} · {e.sub}</span></span>
              <span className="uc"><I.chev/></span>
            </button>
          )):<div className="urow"><div className="us">Nothing scheduled</div></div>}
        </div>

        <button className="sect home-only home-paylink" onClick={openRent}>
          <div className="sect-h"><span className="l">Payments</span><span className="a">View all</span></div>
          <div className="urow"><div className="ut sf">{money(RES.rent)}</div><div className="us">Upcoming · Due 1 August · Autopay</div></div>
          {recent.map(p=>(<div className="urow" key={p.id}><div className="ut sf">{money(RES.rent)}</div><div className="us">Last paid · {p.paid}</div></div>))}
        </button>
      </div>
      <div style={{height:8}}/>
    </div>
  );
}
