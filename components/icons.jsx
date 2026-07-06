/* Inline line-art icon set. Each icon is a component: <I.home/> etc. */

const sv = (p) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  ...p,
});

export const I = {
  home:(p)=><svg {...sv(p)}><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/></svg>,
  card:(p)=><svg {...sv(p)}><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 10h18"/></svg>,
  concierge:(p)=><svg {...sv(p)}><path d="M12 4c.5 3.4 2.1 5 5.5 5.5-3.4.5-5 2.1-5.5 5.5-.5-3.4-2.1-5-5.5-5.5 3.4-.5 5-2.1 5.5-5.5z"/><path d="M18.5 15.5c.2 1.3.8 1.9 2 2.1-1.2.2-1.8.8-2 2.1-.2-1.3-.8-1.9-2-2.1 1.2-.2 1.8-.8 2-2.1z"/></svg>,
  bell:(p)=><svg {...sv(p)}><path d="M6.5 16v-5a5.5 5.5 0 0 1 11 0v5l1.5 2h-14z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg>,
  chev:(p)=><svg {...sv(p)}><path d="m9 5 7 7-7 7"/></svg>,
  chevL:(p)=><svg {...sv(p)}><path d="m15 5-7 7 7 7"/></svg>,
  chevD:(p)=><svg {...sv(p)}><path d="m6 9 6 6 6-6"/></svg>,
  arrow:(p)=><svg {...sv(p)}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  check:(p)=><svg {...sv(p)}><path d="m5 12 4.5 4.5L19 6"/></svg>,
  close:(p)=><svg {...sv(p)}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  send:(p)=><svg {...sv(p)}><path d="M4 12h15M13 6l6 6-6 6"/></svg>,
  clock:(p)=><svg {...sv(p)}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>,
  wrench:(p)=><svg {...sv(p)}><path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-.6-.6-2.6z"/></svg>,
  leaf:(p)=><svg {...sv(p)}><path d="M5 19C5 9 12 5 20 5c0 8-4 15-14 15"/><path d="M5 19c3-5 7-8 11-10"/></svg>,
  key:(p)=><svg {...sv(p)}><circle cx="8" cy="14" r="3.2"/><path d="m10.5 11.5 8-8M16 6l2.2 2.2M13.6 8.4 15.8 10.6"/></svg>,
  msg:(p)=><svg {...sv(p)}><path d="M4 6h16v10H9l-5 4z"/></svg>,
  box:(p)=><svg {...sv(p)}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>,
  dots:(p)=><svg {...sv(p)}><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>,
  image:(p)=><svg {...sv(p)}><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-4-4 3-2-1.5L3 17"/></svg>,
  plus:(p)=><svg {...sv(p)}><path d="M12 5v14M5 12h14"/></svg>,
  doc:(p)=><svg {...sv(p)}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 16.5h4"/></svg>,
  seal:(p)=><svg {...sv(p)}><path d="M12 3l1.9 2 2.7-.4.4 2.7 2 1.9-1.3 2.4 1.3 2.4-2 1.9-.4 2.7-2.7-.4L12 21l-1.9-2-2.7.4-.4-2.7-2-1.9 1.3-2.4L4.9 9l2-1.9.4-2.7 2.7.4z"/><path d="m9.5 12 1.7 1.7 3.3-3.4"/></svg>,
  renew:(p)=><svg {...sv(p)}><path d="M4 12a8 8 0 0 1 14-5l2 2M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5l-2-2M4 20v-5h5"/></svg>,
  sun:(p)=><svg {...sv(p)}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>,
};
