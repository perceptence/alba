import { useState } from "react";
import { useGuests, guestStore, GUEST_SCOPES, GUEST_KIN, GUEST_WHEN, GUEST_STAY } from "@/lib/guestStore";
import { RES, ROSA } from "@/lib/data";
import { I } from "@/components/icons";
import { useSheet } from "@/components/useSheet";

/* Guest access — grant a visitor a time-boxed pass to the gate, grounds,
   and door. The list lives in Residence; each pass opens as a sheet with a
   shareable code. Rosa is notified of every pass. */

const ST = {
  active: { label: "Active", tone: "g" },
  upcoming: { label: "Upcoming", tone: "a" },
  revoked: { label: "Revoked", tone: "n" },
};
const first = (name) => name.split(" ")[0];
const scopeList = (scopes) => scopes.map((s) => GUEST_SCOPES[s].label).join(" · ");

// Derive display arrival/departure from the friendly when/stay choices.
const deriveDates = (when, stay) => {
  const arrive = when === "This weekend" ? "Saturday" : when;
  const depart =
    stay === "The day" ? arrive + ", by evening"
    : stay === "Overnight" ? "The next morning"
    : stay === "The weekend" ? "Sunday evening"
    : "In a week";
  return { arrive, depart };
};

export function GuestAccess({ onBack, push }) {
  const g = useGuests();
  const [invite, setInvite] = useState(false);
  const [openId, setOpenId] = useState(null);
  const passes = g.all();
  const live = passes.filter((p) => p.status !== "revoked");
  return (
    <div className="pc stag">
      <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Guests &amp; access</span></div>

      <div className="ga-hero">
        <span className="ga-hero-ic"><I.shield/></span>
        <div className="ga-hero-t sf">Let someone in, on your terms</div>
        <p className="ga-hero-d">Grant a visitor a time-boxed pass to the gate, grounds, or front door. Each pass is its own code — {ROSA.name.split(" ")[0]} is notified the moment you create one, and you can revoke it anytime.</p>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Guest passes</span><span className="a num">{live.length} active</span></div>
        {passes.length === 0 && <div className="calm"><I.users/>No guest passes yet</div>}
        {passes.map((p) => {
          const st = ST[p.status];
          return (
            <button key={p.id} className="gpass" onClick={() => setOpenId(p.id)}>
              <span className="gpass-l">
                <span className="gpass-top"><span className="gpass-name sf">{p.name}</span><span className={"gpill gpill-" + st.tone}>{st.label}</span></span>
                <span className="gpass-when">{p.arrive} → {p.depart}</span>
                <span className="gpass-scopes">{scopeList(p.scopes)}</span>
              </span>
              {p.status === "revoked"
                ? <span className="gpass-c"><I.chev/></span>
                : <span className="gpass-code num">{p.gateCode}</span>}
            </button>
          );
        })}
        <button className="ga-invite" onClick={() => setInvite(true)}><I.plus/>Invite a guest</button>
      </div>

      <div style={{height:8}}/>
      {invite && <GuestInvite push={push} onClose={() => setInvite(false)} onCreated={(id) => { setInvite(false); setOpenId(id); }}/>}
      {openId && <GuestPass id={openId} push={push} onClose={() => setOpenId(null)}/>}
    </div>
  );
}

function ScopeChips({ value, onToggle }) {
  return (<div className="gscopes">{Object.entries(GUEST_SCOPES).map(([k, s]) => (
    <button key={k} className={"gscope" + (value.includes(k) ? " on" : "")} onClick={() => onToggle(k)}>
      <span className="gscope-check">{value.includes(k) && <I.check/>}</span>
      <span><span className="gscope-l sf">{s.label}</span><span className="gscope-d">{s.d}</span></span>
    </button>))}</div>);
}

function Field({ label, value, options, open, onToggle, onPick }) {
  return (<div className={"drow" + (open ? " open" : "")}>
    <button className="drow-head" onClick={onToggle}>
      <span className="drow-l sf">{label}</span><span className="drow-v">{value}</span><span className="drow-c"><I.chev/></span>
    </button>
    {open && <div className="drow-opts rise">{options.map((o) => (
      <button key={o} className="drow-opt" onClick={() => onPick(o)}>
        <span className={"ap-radio" + (o === value ? " on" : "")}/><span className="drow-ot sf">{o}</span>
      </button>))}</div>}
  </div>);
}

export function GuestInvite({ push, onClose, onCreated }) {
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const [name, setName] = useState("");
  const [kin, setKin] = useState(GUEST_KIN[0]);
  const [when, setWhen] = useState(Object.keys(GUEST_WHEN)[0]);
  const [stay, setStay] = useState(GUEST_STAY[1]);
  const [scopes, setScopes] = useState(["gate"]);
  const [note, setNote] = useState("");
  const [openF, setOpenF] = useState(null);
  const tog = (k) => setOpenF((o) => (o === k ? null : k));
  const valid = name.trim().length > 1 && scopes.length > 0;
  const submit = () => {
    if (!valid) return;
    const { arrive, depart } = deriveDates(when, stay);
    const id = guestStore.invite({ name: name.trim(), kin, when, stay, arrive, depart, scopes, note: note.trim() });
    push({ t: "Guest pass created", d: ROSA.name.split(" ")[0] + " has been notified" });
    onCreated(id);
  };
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">Invite a guest</div><div className="sh-sub">Pass · {RES.short}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body" style={{paddingTop:8}}>
      <div className="flab" style={{marginTop:0}}>Who's visiting</div>
      <div className="co-field co-field-line"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest's name"/></div>
      <div className="det">
        <Field label="Visiting" value={kin} options={GUEST_KIN} open={openF === "kin"} onToggle={() => tog("kin")} onPick={(v) => { setKin(v); setOpenF(null); }}/>
        <Field label="Arriving" value={when} options={Object.keys(GUEST_WHEN)} open={openF === "when"} onToggle={() => tog("when")} onPick={(v) => { setWhen(v); setOpenF(null); }}/>
        <Field label="Staying" value={stay} options={GUEST_STAY} open={openF === "stay"} onToggle={() => tog("stay")} onPick={(v) => { setStay(v); setOpenF(null); }}/>
      </div>
      <div className="flab">Access</div>
      <ScopeChips value={scopes} onToggle={(k) => setScopes((s) => s.includes(k) ? s.filter((x) => x !== k) : [...s, k])}/>
      <div className="flab">Note for the estate</div>
      <div className="co-field"><textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything Rosa should know (optional)"/></div>
    </div>
    <div className="sh-foot"><button className="cta" disabled={!valid} style={!valid ? {opacity:.4} : undefined} onClick={submit}>Create pass</button></div>
  </div></div>);
}

export function GuestPass({ id, push, onClose }) {
  const g = useGuests();
  const p = g.get(id);
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  if (!p) return null;
  const st = ST[p.status];
  const revoked = p.status === "revoked";
  const share = () => push({ t: "Pass copied", d: "Ready to send to " + first(p.name) });
  const revoke = () => { guestStore.revoke(id); push({ t: "Pass revoked", d: first(p.name) + "'s access has ended" }); close(); };
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{p.name}</div><div className="sh-sub">Guest pass · {p.kin}</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <div className="reqst"><span className={"cxt-" + st.tone}>{st.label}</span> · {p.arrive} → {p.depart}</div>

      {!revoked && <div className="gcode">
        <div className="gcode-l">Gate &amp; door code</div>
        <div className="gcode-v num">{p.gateCode}</div>
        <button className="gcode-copy" onClick={share}><I.copy/>Copy</button>
      </div>}

      <div className="kvl">
        <div className="kv"><span className="k">Arrival</span><span className="v">{p.arrive}</span></div>
        <div className="kv"><span className="k">Until</span><span className="v">{p.depart}</span></div>
        <div className="kv"><span className="k">Opens</span><span className="v">{scopeList(p.scopes)}</span></div>
        <div className="kv"><span className="k">Estate</span><span className="v">{revoked ? "Access ended" : ROSA.name.split(" ")[0] + " notified"}</span></div>
      </div>

      {p.note && <><div className="flab">Note for the estate</div><p className="dr-p">{p.note}</p></>}

      {!revoked && <p className="ga-fine">Share this code with {first(p.name)}. It opens only the areas above, only for these dates, and can be revoked at any time.</p>}
    </div>
    {!revoked && <div className="sh-foot ga-foot">
      <button className="cta" onClick={share}>Share pass</button>
      <button className="cta ghost" onClick={revoke}>Revoke access</button>
    </div>}
  </div></div>);
}
