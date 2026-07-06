import { useState } from "react";
import { ADRIEN, RES, AV } from "@/lib/data";
import { money } from "@/lib/util";
import { useAp } from "@/lib/autopayStore";
import { Avatar } from "@/components/Avatar";
import { I } from "@/components/icons";

export function Profile({ onBack }) {
  const [notif,setNotif]=useState(true);
  const m=useAp().get().method; // single source of truth — matches Rent/autopay
  const yrs=Math.floor(ADRIEN.elapsed/12), mos=ADRIEN.elapsed%12;
  return (
    <div className="pc stag">
      <div className="phead"><span className="eye">The resident</span><div className="ht sf">Account</div></div>

      <div className="prof-head">
        <span className="prof-av"><Avatar cfg={AV.adrien} size={64}/></span>
        <span className="prof-idty">
          <div className="prof-name sf">{ADRIEN.name}</div>
          <div className="prof-place">{RES.short} · {RES.city}</div>
          <div className="prof-seal"><I.seal/>In good standing</div>
        </span>
      </div>

      <div className="prof-tenure">
        <div className="pt-eye">In residence</div>
        <div className="pt-fig sf">{yrs} years, {mos} months</div>
        <div className="pt-cap">Since {ADRIEN.moveIn}</div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Details</span></div>
        <div className="prow"><span className="pk">Email</span><span className="pv sf">adrien.leon@mail.com</span></div>
        <div className="prow"><span className="pk">Phone</span><span className="pv sf num">+1 (310) 555-0182</span></div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Billing</span></div>
        <div className="prow"><span className="pk">Payment method</span><span className="pv sf">{m.bank} ···· {m.last4}</span></div>
        <div className="prow"><span className="pk">Deposit held</span><span className="pv sf num">{money(RES.deposit)}</span></div>
      </div>

      <div className="sect"><div className="sect-h"><span className="l">Preferences</span></div>
        <div className="toggle-line" style={{marginTop:0}}>
          <span><div className="tt sf">Notifications</div><div className="td">Estate notices and request updates</div></span>
          <button className={"tog"+(notif?" on":"")} role="switch" aria-checked={notif} onClick={()=>setNotif(n=>!n)}><i/></button>
        </div>
      </div>

      <button className="signout" onClick={onBack}>Sign out</button>
      <div style={{height:8}}/>
    </div>
  );
}
