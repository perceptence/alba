import { useRef } from "react";

/* Generative SVG avatar. Pass a config from AV (see lib/data). */
export function Avatar({ cfg, size = 40 }) {
  const uid = useRef("av" + Math.random().toString(36).slice(2, 7)).current;
  const c = cfg;
  return (
    <span className="avr" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block" }}>
        <defs><linearGradient id={uid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c.bg[0]}/><stop offset="1" stopColor={c.bg[1]}/></linearGradient></defs>
        <rect width="48" height="48" fill={`url(#${uid})`}/>
        {c.long&&<path d="M12 32 q-1.5 -16 12 -16 q13.5 0 12 16 q-.5 8 -2.5 16 h-19 q-2 -8 -2.5 -16 Z" fill={c.hair}/>}
        <path d="M6 48 a18 15 0 0 1 36 0 Z" fill={c.top}/>
        <path d="M20.8 29 h6.4 v6.8 q-3.2 2.3 -6.4 0 Z" fill={c.skin}/>
        <path d="M15.4 19.8 q0 -9 8.6 -9 q8.6 0 8.6 9 q0 6.4 -3.3 9.4 q-2.4 2.1 -5.3 2.1 q-2.9 0 -5.3 -2.1 q-3.3 -3 -3.3 -9.4 Z" fill={c.skin}/>
        {c.stubble&&<path d="M16.4 23.5 q1.6 6.6 7.6 7.8 q6 -1.2 7.6 -7.8 q-2 5 -7.6 5.6 q-5.6 -.6 -7.6 -5.6 Z" fill={c.hair} opacity=".24"/>}
        {c.long
          ? <g fill={c.hair}><path d="M15.5 21 q-1.5 -11.4 8.5 -11.4 q10 0 8.5 11.4 q-.6 -5.2 -2.7 -6.8 q-1.6 3.3 -5.8 3.3 q-4.2 0 -5.8 -3.3 q-2.1 1.6 -2.7 6.8 Z"/><path d="M15.5 20 q-1.7 6.4 .5 11.6 q-3.2 -1 -3.4 -7.4 q-.1 -3.2 2.9 -4.2 Z"/><path d="M32.5 20 q1.7 6.4 -.5 11.6 q3.2 -1 3.4 -7.4 q.1 -3.2 -2.9 -4.2 Z"/></g>
          : <path d="M14.9 20 q-1.2 -10.6 9.1 -10.6 q10.3 0 9.1 10.6 q-.6 -6.4 -4 -7.4 q-2 2.4 -5.1 2.4 q-3.1 0 -5.1 -2.4 q-3.4 1 -4 7.4 Z" fill={c.hair}/>}
        <path d="M18.7 19.8 q1.9 -.85 3.7 0M25.6 19.8 q1.8 -.85 3.7 0" stroke={c.hair} strokeWidth="1" fill="none" strokeLinecap="round"/>
        <circle cx="20.7" cy="22.2" r=".9" fill="#241B12"/><circle cx="27.3" cy="22.2" r=".9" fill="#241B12"/>
        <path d="M21.9 29 q2.1 1.5 4.2 0" stroke="#A9744C" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      </svg>
    </span>
  );
}
