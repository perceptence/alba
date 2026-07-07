import { useState } from "react";
import { I } from "@/components/icons";
import { norm } from "@/lib/util";
import { useSheet } from "@/components/useSheet";

/* Full reader for a Documents row — sections of key/value facts and
   prose, plus a room-by-room photo grid for the move-in inventory. A
   search field filters sections/rooms in place and highlights the hit,
   rather than paginating a real PDF (these are structured, not scanned). */

const hi = (text, q) => {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
};

const sectionMatches = (s, q) => {
  if (!q) return true;
  const t = norm(q);
  if (norm(s.h).includes(t)) return true;
  if (s.p && norm(s.p).includes(t)) return true;
  if (s.kv && s.kv.some(([k, v]) => norm(k).includes(t) || norm(v).includes(t))) return true;
  return false;
};

export function DocReader({ doc, onClose, onAsk }) {
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const [q, setQ] = useState("");
  const sections = (doc.sections || []).filter((s) => sectionMatches(s, q));
  const rooms = (doc.rooms || []).filter((r) => !q || norm(r.name).includes(norm(q)));
  const empty = sections.length === 0 && rooms.length === 0 && q;

  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{doc.t}</div><div className="sh-sub">{doc.tag}</div>
      {doc.file&&<a className="dr-orig" href={doc.file} target="_blank" rel="noopener noreferrer">View original document (PDF)<I.ext/></a>}</span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <div className="dr-search"><I.search/>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this document"/>
        {q && <button className="dr-clear" onClick={() => setQ("")} aria-label="Clear search"><I.close/></button>}
      </div>

      {empty && <div className="calm"><I.search/>No matches for "{q}"</div>}

      {sections.map((s, i) => (
        <div key={i} className={"dr-sec" + (s.callout ? " dr-callout" : "")}>
          <div className="flab">{hi(s.h, q)}</div>
          {s.kv && <div className="kvl" style={{marginTop:0}}>{s.kv.map(([k, v]) => (
            <div className="kv" key={k}><span className="k">{k}</span><span className="v">{hi(v, q)}</span></div>))}</div>}
          {s.p && <p className="dr-p">{hi(s.p, q)}</p>}
          {s.act && <button className="a-act" onClick={() => { onAsk && onAsk(s.act); close(); }}>{s.act.label}<I.arrow/></button>}
        </div>
      ))}

      {rooms.length > 0 && <div className="dr-sec">
        <div className="flab">Photos by room</div>
        {rooms.map((r) => (
          <div className="dr-room" key={r.name}>
            <div className="dr-room-h"><span className="sf">{hi(r.name, q)}</span><span className="dr-room-n">{r.photos} photos</span></div>
            <div className="co-photos" style={{marginTop:8}}>
              {Array.from({ length: Math.min(r.photos, 6) }).map((_, i) => (
                <div className="thumb" key={i}><span className="thumb-ph"><I.image/></span></div>))}
              {r.photos > 6 && <div className="thumb dr-more"><span>+{r.photos - 6}</span></div>}
            </div>
          </div>
        ))}
      </div>}
      <div style={{height:8}}/>
    </div>
  </div></div>);
}
