import { useState } from "react";
import { useBookings, bookingStore, SERVICES, svcOf, BOOK_STATUS } from "@/lib/bookingStore";
import { ROSA } from "@/lib/data";
import { I } from "@/components/icons";
import { useSheet } from "@/components/useSheet";

/* Book a service — a curated menu of what the estate does on a schedule.
   Pick a service, choose a slot, and it lands as a booking (and on the
   household schedule). Rosa confirms, as she does with any request. */

export function Services({ onBack, push }) {
  const b = useBookings();
  const [pick, setPick] = useState(null);
  const [openBk, setOpenBk] = useState(null);
  const live = b.live();
  return (
    <div className="pc stag">
      <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Book a service</span></div>

      <div className="ga-hero">
        <span className="ga-hero-ic"><I.cal/></span>
        <div className="ga-hero-t sf">The estate, at your word</div>
        <p className="ga-hero-d">Choose from the services the estate keeps, pick a time that suits you, and {ROSA.name.split(" ")[0]} confirms. Every booking joins your household schedule.</p>
      </div>

      {live.length > 0 && <div className="sect"><div className="sect-h"><span className="l">Your bookings</span></div>
        {live.map((bk) => {
          const st = BOOK_STATUS[bk.status];
          return (
            <button key={bk.id} className="bkrow" onClick={() => setOpenBk(bk.id)}>
              <span className="bkrow-m"><span className="bkrow-l sf">{bk.label}</span><span className="bkrow-w">{bk.day} · {bk.window}</span></span>
              <span className={"gpill gpill-" + st.tone}>{st.label}</span>
            </button>
          );
        })}
      </div>}

      <div className="sect"><div className="sect-h"><span className="l">Available</span></div>
        {SERVICES.map((s) => {
          const Ico = I[s.icon] || I.dots;
          return (
            <button key={s.id} className="svc" onClick={() => setPick(s.id)}>
              <span className="svc-ic"><Ico/></span>
              <span className="svc-m"><span className="svc-l sf">{s.label}</span><span className="svc-d">{s.d}</span></span>
              <span className="svc-c"><I.chev/></span>
            </button>
          );
        })}
      </div>

      <div style={{height:8}}/>
      {pick && <BookingSheet svcId={pick} push={push} onClose={() => setPick(null)} onBooked={(id) => { setPick(null); setOpenBk(id); }}/>}
      {openBk && <BookingDetail id={openBk} push={push} onClose={() => setOpenBk(null)}/>}
    </div>
  );
}

function BookingSheet({ svcId, push, onClose, onBooked }) {
  const svc = svcOf(svcId);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const [sel, setSel] = useState(0);
  const [note, setNote] = useState("");
  const book = () => {
    const [day, window] = svc.slots[sel];
    const id = bookingStore.book({ service: svc.id, label: svc.label, day, window, note: note.trim() });
    push({ t: "Service requested", d: ROSA.name.split(" ")[0] + " will confirm shortly" });
    onBooked(id);
  };
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{svc.label}</div><div className="sh-sub">Book a service</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <p className="dr-p" style={{marginTop:0}}>{svc.d}.{svc.lead ? " " + svc.lead + "." : ""}</p>
      <div className="flab">Choose a time</div>
      <div className="slots">
        {svc.slots.map(([day, window], i) => (
          <button key={i} className={"slot" + (sel === i ? " on" : "")} onClick={() => setSel(i)}>
            <span className={"ap-radio" + (sel === i ? " on" : "")}/>
            <span className="slot-l sf">{day}</span><span className="slot-w">{window}</span>
          </button>))}
      </div>
      <div className="flab">Note for the estate</div>
      <div className="co-field"><textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything Rosa should know (optional)"/></div>
    </div>
    <div className="sh-foot"><button className="cta" onClick={book}>Request booking</button></div>
  </div></div>);
}

function BookingDetail({ id, push, onClose }) {
  const b = useBookings();
  const bk = b.get(id);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  if (!bk) return null;
  const st = BOOK_STATUS[bk.status];
  const cancelled = bk.status === "cancelled";
  const cancel = () => { bookingStore.cancel(id); push({ t: "Booking cancelled", d: bk.label }); close(); };
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{bk.label}</div><div className="sh-sub">Booking · {ROSA.name.split(" ")[0]}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <div className="reqst"><span className={"cxt-" + st.tone}>{st.label}</span> · {bk.day} · {bk.window}</div>
      <div className="kvl">
        <div className="kv"><span className="k">Service</span><span className="v">{bk.label}</span></div>
        <div className="kv"><span className="k">When</span><span className="v">{bk.day} · {bk.window}</span></div>
        <div className="kv"><span className="k">Estate</span><span className="v">{cancelled ? "Cancelled" : st.tone === "g" ? "Confirmed by Rosa" : "Awaiting confirmation"}</span></div>
      </div>
      {bk.note && <><div className="flab">Your note</div><p className="dr-p">{bk.note}</p></>}
    </div>
    {!cancelled && <div className="sh-foot"><button className="cta ghost" onClick={cancel}>Cancel booking</button></div>}
  </div></div>);
}
