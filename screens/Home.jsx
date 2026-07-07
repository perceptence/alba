import { useCx, CX_STATUS } from "@/lib/conciergeStore";
import { RES, ADRIEN } from "@/lib/data";
import { money } from "@/lib/util";
import { I } from "@/components/icons";
import { Elevation } from "@/components/Elevation";
import { TextLink } from "@/components/TextLink";

export function Home({ go, openRes, openRent, openNotices }) {
  const cx=useCx();
  const openReq=cx.all().find(r=>r.status==="in_progress"||r.status==="scheduled");
  const openCount=cx.all().filter(r=>r.status!=="resolved"&&r.status!=="cancelled").length;
  return (
    <div className="pc stag">
      <div className="top">
        <span className="eye">Saturday · 5 July</span>
        <button className="icob" onClick={openNotices} aria-label="Notices"><I.bell/><span className="dot"/></button>
      </div>
      <div className="hero-greet"><span className="g1">Good evening,</span><br/><span className="g2">{ADRIEN.first}.</span></div>

      <button className="respanel" onClick={openRes}>
        <Elevation h={160}/>
        <div className="res-name sf">{RES.name}</div>
        <div className="res-meta">{RES.city} · Resident since 2023</div>
        <TextLink>View residence</TextLink>
      </button>

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
            <div className="gt sf">{openCount} request in care</div>
            <div className="gs">{openReq?<><span className="st-a">{CX_STATUS[openReq.status].label}</span> · {openReq.title}</>:"Nothing pending"}</div>
          </span>
          <span className="gc"><I.chev/></span>
        </button>
      </div>
      <div style={{height:8}}/>
    </div>
  );
}
