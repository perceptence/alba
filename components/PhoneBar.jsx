/* iOS-style status bar, fixed at the top of the phone frame.
   The three glyphs are redrawn in one solid family (approximating SF Symbols)
   and vertically centered, per Apple's status-bar treatment. */
export const PhoneBar = () => (
  <div className="pbar"><span className="tm num">9:41</span>
    <span className="pbar-r">
      <svg width="18" height="12" viewBox="0 0 18 12" fill="#1C1917" aria-hidden="true"><rect x="0" y="7.5" width="3.2" height="4.5" rx="1"/><rect x="4.9" y="5.5" width="3.2" height="6.5" rx="1"/><rect x="9.8" y="3" width="3.2" height="9" rx="1"/><rect x="14.7" y="0.5" width="3.2" height="11.5" rx="1"/></svg>
      <svg width="27" height="12" viewBox="0 0 27 12" fill="none" aria-hidden="true"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="#1C1917" strokeOpacity="0.35"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill="#1C1917"/><path d="M24 4.2v3.6a2 2 0 0 0 0-3.6z" fill="#1C1917" fillOpacity="0.5"/></svg>
    </span></div>
);
