import { useState } from "react";
import { useAp, apStore } from "@/lib/autopayStore";
import { money, ord } from "@/lib/util";
import { I } from "@/components/icons";

/* Autopay — a full settings page (opened from the Payments screen). Turn it
   on or off, choose the day and account, and — when turning it on — give
   explicit authorization for the recurring charges before saving. */

const AP_DAYS = [1, 2, 3];

function Field({ label, display, sel, options, open, onToggle, onPick }) {
  return (<div className={"drow" + (open ? " open" : "")}>
    <button className="drow-head" onClick={onToggle}>
      <span className="drow-l sf">{label}</span><span className="drow-v">{display}</span><span className="drow-c"><I.chev/></span>
    </button>
    {open && <div className="drow-opts rise">{options.map((o) => (
      <button key={o.v} className="drow-opt" onClick={() => onPick(o.v)}>
        <span className={"ap-radio" + (o.v === sel ? " on" : "")}/><span className="drow-ot sf">{o.l}</span>
      </button>))}</div>}
  </div>);
}

export function Autopay({ onBack, push }) {
  const ap = useAp();
  const a = ap.get();
  const methods = ap.methods();
  const [on, setOn] = useState(a.on);
  const [methodId, setMethodId] = useState(a.methodId);
  const [day, setDay] = useState(a.day);
  // Consent is pre-satisfied only if autopay is already authorized; turning
  // it on afresh requires an explicit opt-in below.
  const [consent, setConsent] = useState(a.on);
  const [openF, setOpenF] = useState(null);
  const tog = (k) => setOpenF((o) => (o === k ? null : k));
  const method = methods.find((m) => m.id === methodId);
  const canSave = !on || consent;
  const save = () => {
    if (!canSave) return;
    apStore.save({ on, methodId, day });
    push({ t: "Autopay updated", d: on ? `Runs on the ${ord(day)} of each month` : "Turned off" });
    onBack();
  };
  return (
    <div className="pc stag">
      <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Payments</span></div>
      <div className="phead"><span className="eye">Residence account</span><div className="ht sf">Autopay</div></div>
      <p className="scr-intro">Have your rent collected automatically each month — you choose the day and the account, and you can turn it off anytime.</p>

      <div className="sect"><div className="sect-h"><span className="l">Collection</span></div>
        <div className="toggle-line" style={{marginTop:0}}>
          <span><div className="tt sf">Collect automatically</div><div className="td">{on ? "Drawn from your account each month" : "Off · pay manually"}</div></span>
          <button className={"tog" + (on ? " on" : "")} role="switch" aria-checked={on} onClick={() => setOn((v) => !v)}><i/></button>
        </div>
        {on && <div className="det" style={{marginTop:0}}>
          <Field label="Runs on the" display={ord(day)} sel={day} options={AP_DAYS.map((d) => ({ v: d, l: ord(d) + " of the month" }))} open={openF === "day"} onToggle={() => tog("day")} onPick={(v) => { setDay(v); setOpenF(null); }}/>
          <Field label="Payment method" display={method.bank + " ···· " + method.last4} sel={methodId} options={methods.map((m) => ({ v: m.id, l: m.bank + " ···· " + m.last4 }))} open={openF === "method"} onToggle={() => tog("method")} onPick={(v) => { setMethodId(v); setOpenF(null); }}/>
        </div>}
      </div>

      {on && <div className="sect"><div className="sect-h"><span className="l">Authorization</span></div>
        <p className="ap-terms">By turning on Autopay, you authorize the estate to electronically debit {money(a.amount)} from {method.bank} ···· {method.last4} on the {ord(day)} of each month toward your rent, along with any incidental charges as they're billed. This authorization stays in effect until you turn Autopay off. You may cancel here at any time — please allow at least three business days before the next scheduled date. If a payment can't be completed we'll let you know, and a receipt follows every one.</p>
        <button className={"ap-consent" + (consent ? " on" : "")} onClick={() => setConsent((c) => !c)}>
          <span className="ap-consent-check">{consent && <I.check/>}</span>
          <span className="ap-consent-l">I authorize these recurring charges to my account.</span>
        </button>
      </div>}

      <div className="rnw-actions">
        <button className="cta" disabled={!canSave} style={!canSave ? {opacity:.4} : undefined} onClick={save}>Save changes</button>
        {on && !consent && <span className="ap-consent-hint">Confirm the authorization above to save.</span>}
      </div>
      <div style={{height:8}}/>
    </div>
  );
}
