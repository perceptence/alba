import { useRenewal, renewalStore, RENEWAL, RENEWAL_STEPS } from "@/lib/renewalStore";
import { ROSA } from "@/lib/data";
import { money } from "@/lib/util";
import { I } from "@/components/icons";
import { TextLink } from "@/components/TextLink";

/* Lease renewal — a pre-window flow. Register interest early and Rosa
   prepares terms; the indicative figures firm up when the window opens. */

export function Renewal({ onBack, push }) {
  const r = useRenewal();
  const status = r.status();
  const register = () => { renewalStore.set("interested"); push({ t: "Interest registered", d: ROSA.name.split(" ")[0] + " will prepare your terms" }); };
  const decline = () => { renewalStore.set("declined"); push({ t: "Noted", d: "We'll be in touch about the term's end" }); };
  const reset = () => renewalStore.set("none");
  return (
    <div className="pc stag">
      <div className="backrow"><button className="backb" onClick={onBack} aria-label="Back"><I.chevL/></button><span className="bt">Lease renewal</span></div>

      <div className="ga-hero">
        <span className="ga-hero-ic"><I.renew/></span>
        <div className="ga-hero-t sf">Stay on at the Verde Bungalow</div>
        <p className="ga-hero-d">Your term runs to {RENEWAL.currentEnd}. The renewal window opens {RENEWAL.windowOpens} — register your interest now and {ROSA.name.split(" ")[0]} will have your terms ready.</p>
      </div>

      {status === "interested" && <div className="rnw-banner">
        <span className="rnw-banner-ic"><I.check/></span>
        <span className="rnw-banner-m"><span className="rnw-banner-t sf">Interest registered</span><span className="rnw-banner-d">Rosa will share your final terms when the window opens in {RENEWAL.windowOpens}.</span></span>
      </div>}
      {status === "declined" && <div className="rnw-banner rnw-banner-off">
        <span className="rnw-banner-ic"><I.check/></span>
        <span className="rnw-banner-m"><span className="rnw-banner-t sf">You've chosen not to renew</span><span className="rnw-banner-d">The team will be in touch about a smooth move-out as {RENEWAL.currentEnd} approaches.</span></span>
      </div>}

      <div className="sect"><div className="sect-h"><span className="l">How renewal works</span></div>
        <div className="rsteps">
          {RENEWAL_STEPS.map((s, i) => (
            <div className="rstep" key={i}>
              <span className="rstep-node num">{i + 1}</span>
              <span className="rstep-m"><span className="rstep-top"><span className="rstep-l sf">{s.label}</span><span className="rstep-when">{s.when}</span></span><span className="rstep-d">{s.d}</span></span>
            </div>))}
        </div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Indicative terms</span></div>
        <div className="kvl">
          <div className="kv"><span className="k">Proposed term</span><span className="v">{RENEWAL.termLength}</span></div>
          <div className="kv"><span className="k">New dates</span><span className="v">{RENEWAL.newStart} – {RENEWAL.newEnd}</span></div>
          <div className="kv"><span className="k">Rent</span><span className="v">{money(RENEWAL.proposedRent)} / mo</span></div>
          <div className="kv"><span className="k">Deposit</span><span className="v">{RENEWAL.deposit}</span></div>
        </div>
        <p className="ga-fine">Indicative only — a modest adjustment from {money(RENEWAL.currentRent)}, confirmed in writing when the window opens.</p>
      </div>

      {status === "none" && <div className="rnw-actions">
        <button className="cta" onClick={register}>Register interest to renew</button>
        <button className="rnw-decline" onClick={decline}>I'd prefer not to renew</button>
      </div>}
      {status === "interested" && <div className="rnw-actions"><TextLink onClick={reset}>Withdraw my interest</TextLink></div>}
      {status === "declined" && <div className="rnw-actions"><TextLink onClick={() => renewalStore.set("interested")}>Actually, I'd like to renew</TextLink></div>}

      <div style={{height:8}}/>
    </div>
  );
}
