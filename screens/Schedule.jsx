import { useCx } from "@/lib/conciergeStore";
import { useBookings } from "@/lib/bookingStore";
import { useGuests } from "@/lib/guestStore";
import { weekAgenda, LATER } from "@/lib/schedule";
import { I } from "@/components/icons";

/* Household schedule — a week agenda gathered from the estate's service days,
   scheduled requests, bookings, and guest arrivals, plus lease milestones. */

function Entry({ e, onOpenRequest }) {
  const Ico = I[e.icon] || I.dots;
  const inner = (<>
    <span className={"sentry-ic sentry-ic-" + e.type}><Ico/></span>
    <span className="sentry-m"><span className="sentry-t sf">{e.title}</span><span className="sentry-s">{e.sub}</span></span>
    {e.window && <span className="sentry-w">{e.window}</span>}
    {e.to && <span className="sentry-c"><I.chev/></span>}
  </>);
  return e.to
    ? <button className="sentry" onClick={() => onOpenRequest(e.to.id)}>{inner}</button>
    : <div className="sentry">{inner}</div>;
}

export function Schedule({ onBack, onOpenRequest }) {
  useCx(); useBookings(); useGuests(); // re-render when any source changes
  const days = weekAgenda();
  return (
    <div className="pc stag">
      <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Schedule</span></div>
      <div className="phead" style={{paddingTop:24}}><span className="eye">This week</span><div className="ht sf">At the residence</div></div>

      <div style={{marginTop:24}}>
        {days.map((d) => (
          <div className="sday" key={d.dow}>
            <div className="sday-h"><span className="sday-l">{d.label}</span>{d.label !== d.dow && <span className="sday-dow">{d.dow}</span>}</div>
            {d.entries.length === 0
              ? <div className="sday-empty">A clear day — nothing scheduled</div>
              : d.entries.map((e, i) => <Entry key={i} e={e} onOpenRequest={onOpenRequest}/>)}
          </div>
        ))}
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Later</span></div>
        {LATER.map((l) => {
          const Ico = I[l.icon] || I.dots;
          return (
            <div className="sentry" key={l.title}>
              <span className="sentry-ic sentry-ic-estate"><Ico/></span>
              <span className="sentry-m"><span className="sentry-t sf">{l.title}</span><span className="sentry-s">{l.sub}</span></span>
              <span className="sentry-w">{l.when}</span>
            </div>
          );
        })}
      </div>
      <div style={{height:8}}/>
    </div>
  );
}
