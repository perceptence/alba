/* A prototype-only control, rendered outside the phone/device frame, for
   switching between demoable journeys (the resident's day-to-day app vs.
   a brand-new resident's first-run invitation). Never part of the product
   itself — purely a way to reach every flow for review. */
const JOURNEYS = [
  ["resident", "Resident", "Adrien — day to day"],
  ["onboarding", "New invite", "First-run onboarding"],
];

export function DemoPanel({ journey, onChange }) {
  return (
    <div className="demopanel">
      <span className="dp-eye">Preview</span>
      {JOURNEYS.map(([k,label,sub])=>(
        <button key={k} className={"dp-opt"+(journey===k?" on":"")} onClick={()=>onChange(k)}>
          <span className="dp-l">{label}</span>
          <span className="dp-s">{sub}</span>
        </button>
      ))}
    </div>
  );
}
