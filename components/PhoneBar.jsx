/* iOS-style status bar shown at the top of the phone frame. */
export const PhoneBar = () => (
  <div className="pbar"><span className="tm num">9:41</span>
    <span className="pbar-r">
      <svg width="18" height="11" viewBox="0 0 18 11" fill="#1C1917"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2.5" width="3" height="8.5" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#1C1917" strokeWidth="1.3" strokeLinecap="round"><path d="M1.3 3.8a10 10 0 0 1 13.4 0"/><path d="M3.7 6.2a6.5 6.5 0 0 1 8.6 0"/><path d="M6.1 8.6a3 3 0 0 1 3.8 0"/><circle cx="8" cy="10.6" r=".6" fill="#1C1917" stroke="none"/></svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="1" y="1" width="20" height="10" rx="3" stroke="#1C1917" strokeWidth="1" opacity=".4"/><rect x="3" y="3" width="14" height="6" rx="1.5" fill="#1C1917"/><path d="M23 4.3v3.4a2 2 0 0 0 0-3.4z" fill="#1C1917" opacity=".4"/></svg>
    </span></div>
);
