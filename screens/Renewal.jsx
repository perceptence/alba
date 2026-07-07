import { useRenewal, renewalStore, RENEWAL, RENEWAL_STEPS } from "@/lib/renewalStore";
import { money } from "@/lib/util";
import { I } from "@/components/icons";
import { TextLink } from "@/components/TextLink";

/* Lease renewal — an offer is on the table. Review the terms and accept or
   decline; the state carries back to the Residence lease card. */

export function Renewal({ onBack, push }) {
  const r = useRenewal();
  const status = r.status();
  const accept = () => { renewalStore.set("accepted"); push({ t: "Renewal accepted", d: "New term begins " + RENEWAL.newStart }); };
  const decline = () => { renewalStore.set("declined"); push({ t: "Noted", d: "We'll be in touch about the term's end" }); };
  return (
    <div className="pc stag">
      <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Residence</span></div>
      <div className="phead" style={{paddingTop:24}}><span className="eye">Lease</span><div className="ht sf">Renewal offer</div></div>
      <p className="scr-intro">Your term ends {RENEWAL.currentEnd}. Rosa has prepared an offer to renew for another {RENEWAL.termLength} — the terms are below.</p>

      {status === "accepted" && <div className="rnw-banner">
        <span className="rnw-banner-ic"><I.check/></span>
        <span className="rnw-banner-m"><span className="rnw-banner-t sf">Renewal accepted</span><span className="rnw-banner-d">Your new term begins {RENEWAL.newStart}. Rosa will send the papers to sign.</span></span>
      </div>}
      {status === "declined" && <div className="rnw-banner rnw-banner-off">
        <span className="rnw-banner-ic"><I.check/></span>
        <span className="rnw-banner-m"><span className="rnw-banner-t sf">You've chosen not to renew</span><span className="rnw-banner-d">The team will be in touch about a smooth move-out as {RENEWAL.currentEnd} approaches.</span></span>
      </div>}

      <div className="sect"><div className="sect-h"><span className="l">The offer</span></div>
        <div className="kvl">
          <div className="kv"><span className="k">New term</span><span className="v">{RENEWAL.termLength}</span></div>
          <div className="kv"><span className="k">Dates</span><span className="v">{RENEWAL.newStart} – {RENEWAL.newEnd}</span></div>
          <div className="kv"><span className="k">Rent</span><span className="v num">{money(RENEWAL.proposedRent)} / mo</span></div>
          <div className="kv"><span className="k">Deposit</span><span className="v">{RENEWAL.deposit}</span></div>
        </div>
        <p className="ga-fine">Rent rises from {money(RENEWAL.currentRent)} — a modest adjustment for the new term. Please respond by {RENEWAL.respondBy}.</p>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">How it works</span></div>
        <div className="tml">
          {RENEWAL_STEPS.map((s, i) => (
            <div className={"tstep" + (s.state === "done" ? " done" : s.state === "now" ? " now" : "")} key={i}>
              <span className="tnode">{s.state === "done" ? <I.check/> : s.state === "now" ? <span className="tdot"/> : null}</span>
              <span><div className="tlab sf">{s.label}</div><div className="tsub">{s.when} · {s.d}</div></span>
            </div>))}
        </div>
      </div>

      {status === "review" && <div className="rnw-actions">
        <button className="cta" onClick={accept}>Accept renewal</button>
        <button className="rnw-decline" onClick={decline}>I'd prefer not to renew</button>
      </div>}
      {status === "accepted" && <div className="rnw-actions"><TextLink onClick={() => renewalStore.set("review")}>Undo — I need to reconsider</TextLink></div>}
      {status === "declined" && <div className="rnw-actions"><TextLink onClick={() => renewalStore.set("review")}>Actually, I'd like to renew</TextLink></div>}

      <div style={{height:8}}/>
    </div>
  );
}
