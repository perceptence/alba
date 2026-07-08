"use client";

import { useRef, useState } from "react";
import { RES, ADRIEN, ROSA, AV } from "@/lib/data";
import { Elevation } from "@/components/Elevation";
import { Avatar } from "@/components/Avatar";
import { ManagerPresence } from "@/components/ManagerPresence";
import { I } from "@/components/icons";

/* ALBA — first-run onboarding. A resident arrives via a personal invitation
   (see the emailed invite mock) and is walked through four quiet steps:
   the invitation itself, passwordless access, the residence + their estate
   manager together, and a brief orientation — then straight into Home. No
   tutorial carousel, no numbered progress bar; just a thin dot of momentum
   and a single Continue at each step. */

const STEPS = ["invite", "access", "residence", "orient"];
const EMAIL_MASK = "adrien•••••@•••••.com";
const OTP_LEN = 6;

function StepDots({ i }) {
  return (
    <div className="ob-dots">
      {STEPS.map((s, k) => <span key={s} className={"ob-dot" + (k===i?" on":k<i?" done":"")} />)}
    </div>
  );
}

function StepShell({ i, onBack, children }) {
  return (
    <div className="ob-step stag">
      <div className="ob-top">
        {i>0 && <button className="ob-back" onClick={onBack} aria-label="Back"><I.chevL/></button>}
        <StepDots i={i}/>
      </div>
      {children}
    </div>
  );
}

// Six-box one-time-code entry — auto-advances focus per digit, and steps
// back on delete. Reads as a considered, purpose-built control rather than
// a single generic text field.
function OtpInput({ value, onChange }) {
  const refs = useRef([]);
  const setDigit = (i, raw) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(OTP_LEN, " ").split("");
    chars[i] = d || " ";
    onChange(chars.join("").trimEnd());
    if (d && i < OTP_LEN-1) refs.current[i+1]?.focus();
  };
  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i-1]?.focus();
  };
  return (
    <div className="ob-otp">
      {Array.from({ length: OTP_LEN }).map((_, i) => (
        <input key={i} ref={(el) => (refs.current[i] = el)} autoFocus={i===0}
          inputMode="numeric" maxLength={1} value={value[i] && value[i]!==" " ? value[i] : ""}
          onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onKeyDown(i, e)}/>
      ))}
    </div>
  );
}

export function Onboarding({ onComplete }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const next = () => setI((v) => Math.min(v+1, STEPS.length-1));
  const back = () => setI((v) => Math.max(v-1, 0));

  // access sub-state: passwordless email code
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const sendCode = () => setSent(true);
  const verify = () => {
    if (code.trim().length < OTP_LEN) return;
    setVerifying(true);
    setTimeout(() => { setVerifying(false); next(); }, 700);
  };

  if (step === "invite") return (
    <StepShell i={i} onBack={back}>
      <div className="ob-mark">
        <svg viewBox="0 0 40 40"><path d="M 9 34 L 9 19 A 11 9 0 0 1 31 19 L 31 34"/><path className="ob-sun" d="M 14 34 A 6 6 0 0 1 26 34 Z"/><line x1="4" y1="34" x2="36" y2="34"/></svg>
      </div>
      <span className="eye" style={{display:"block",textAlign:"center"}}>Rosa has invited you</span>
      <div className="ob-h sf" style={{textAlign:"center"}}>Welcome to<br/>{RES.name}.</div>
      <p className="ob-p" style={{textAlign:"center"}}>I've prepared your residence account — it only takes a moment to set up. I'm looking forward to looking after you here.</p>
      <div className="ob-signoff">
        <Avatar cfg={AV.rosa} size={32}/>
        <span className="ob-signoff-t">{ROSA.name}, {ROSA.role}</span>
      </div>
      <button className="cta" onClick={next}>Continue</button>
    </StepShell>
  );

  if (step === "access") return (
    <StepShell i={i} onBack={back}>
      <div className="ob-mailhero"><I.mail/></div>
      <span className="eye" style={{display:"block",textAlign:"center"}}>Confirm it's you</span>
      <div className="ob-h sf" style={{textAlign:"center"}}>{sent ? "Enter your code." : "A code, sent to you."}</div>
      <p className="ob-p" style={{textAlign:"center"}}>{sent
        ? <>We've sent a six-digit code to your inbox. Enter it below to continue.</>
        : <>No password to remember — we'll send a one-time code to the email on file for {ADRIEN.first}.</>}</p>

      <div className="ob-emailpill"><I.mail/><span>{EMAIL_MASK}</span></div>

      {!sent ? (
        <button className="cta" onClick={sendCode}>Send code</button>
      ) : (
        <>
          <OtpInput value={code} onChange={setCode}/>
          <button className="cta" disabled={code.trim().length<OTP_LEN || verifying} style={(code.trim().length<OTP_LEN||verifying)?{opacity:.4}:undefined} onClick={verify}>
            {verifying ? "Verifying…" : "Verify & continue"}
          </button>
          <button className="ob-resend" onClick={sendCode}>Didn't get it? Resend code</button>
        </>
      )}
    </StepShell>
  );

  if (step === "residence") return (
    <StepShell i={i} onBack={back}>
      <Elevation h={130}/>
      <span className="eye" style={{display:"block",textAlign:"center",marginTop:20}}>{RES.city}</span>
      <div className="ob-h sf" style={{textAlign:"center"}}>{RES.name}.</div>
      <div className="ob-facts">{RES.kind} · {RES.beds} bed · {RES.baths} bath · {RES.area} m²</div>
      <p className="ob-p" style={{textAlign:"center"}}>Everything here — payments, requests, the people who look after it — lives in one place now.</p>

      <div className="ob-divider"/>
      <p className="ob-quote sf">&ldquo;I'll be looking after {RES.short} for you — reach me anytime, day or night. Nothing is too small.&rdquo;</p>
      <div className="ob-rosa">
        <ManagerPresence large/>
      </div>
      <button className="cta" onClick={next}>Continue</button>
    </StepShell>
  );

  // orient
  const rows = [
    [I.card, "Payments", "Rent, autopay, and charges in one place."],
    [I.concierge, "Concierge", "Ask Rosa for anything — she typically replies within the hour."],
    [I.bell, "Notices", "Updates from the estate, when there's something to know."],
  ];
  return (
    <StepShell i={i} onBack={back}>
      <span className="eye">Getting around</span>
      <div className="ob-h sf">A quick orientation.</div>
      <div className="ob-orient">
        {rows.map(([Icon,t,d])=>(
          <div className="ob-orow" key={t}>
            <span className="ob-oico"><Icon/></span>
            <span><div className="ob-ot sf">{t}</div><div className="ob-od">{d}</div></span>
          </div>
        ))}
      </div>
      <button className="cta" onClick={onComplete}>Enter your residence</button>
    </StepShell>
  );
}
