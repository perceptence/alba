import { RM } from "@/lib/util";

/* Architectural line-art elevation of the residence. */
export function Elevation({ h = 196, animate = true }) {
  const dash = animate && !RM;
  const L = (props, len = 400) => ({
    ...props,
    strokeDasharray: dash ? len : undefined,
    strokeDashoffset: dash ? len : undefined,
    style: dash
      ? { animation: `draw 1.4s var(--e) forwards`, animationDelay: (props._d || 0) + "s" }
      : undefined,
  });
  const ink = "#2A241E";
  return (
    <div className="elev" style={{ "--elev-h": h + "px" }}>
      <svg viewBox="0 30 392 166" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style={{display:"block"}} fill="none" stroke={ink} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {/* ground */}
        <line {...L({x1:0,y1:158,x2:392,y2:158,_d:.1})}/>
        <line x1="0" y1="162" x2="392" y2="162" stroke={ink} strokeWidth=".5" opacity=".4"/>
        {/* main volume */}
        <path {...L({d:"M56 158 V96 H236 V158",_d:.2})}/>
        {/* roof slab, cantilevered */}
        <path {...L({d:"M44 96 H248",_d:.35})}/>
        <path {...L({d:"M44 92 H248",_d:.4})}/>
        {/* lower wing */}
        <path {...L({d:"M236 158 V112 H330 V158",_d:.5})}/>
        <path {...L({d:"M228 112 H338",_d:.55})}/>
        {/* glazing mullions main */}
        <g stroke={ink} strokeWidth=".7" opacity=".85">
          <line {...L({x1:76,y1:100,x2:76,y2:158,_d:.5},80)}/>
          <line {...L({x1:104,y1:100,x2:104,y2:158,_d:.55},80)}/>
          <line {...L({x1:132,y1:100,x2:132,y2:158,_d:.6},80)}/>
          <line {...L({x1:160,y1:100,x2:160,y2:158,_d:.65},80)}/>
          <line {...L({x1:188,y1:100,x2:188,y2:158,_d:.7},80)}/>
          <line {...L({x1:216,y1:100,x2:216,y2:158,_d:.75},80)}/>
          <line x1="56" y1="128" x2="236" y2="128" strokeWidth=".6" opacity=".7"/>
        </g>
        {/* door */}
        <path {...L({d:"M120 158 V116 H144 V158",_d:.7},120)}/>
        {/* wing windows */}
        <g stroke={ink} strokeWidth=".7" opacity=".85">
          <rect {...L({x:250,y:124,width:24,height:28,_d:.8},96)}/>
          <rect {...L({x:284,y:124,width:24,height:28,_d:.85},96)}/>
        </g>
        {/* thin sun */}
        <circle {...L({cx:312,cy:60,r:15,_d:.3},100)}/>
        <g stroke={ink} strokeWidth=".6" opacity=".5">
          <line x1="312" y1="34" x2="312" y2="40"/><line x1="312" y1="80" x2="312" y2="86"/>
          <line x1="286" y1="60" x2="292" y2="60"/><line x1="332" y1="60" x2="338" y2="60"/>
          <line x1="294" y1="42" x2="298" y2="46"/><line x1="326" y1="74" x2="330" y2="78"/>
          <line x1="330" y1="42" x2="326" y2="46"/><line x1="294" y1="78" x2="298" y2="74"/>
        </g>
        {/* olive trees */}
        <g stroke={ink} strokeWidth=".9">
          <path {...L({d:"M40 158 V132",_d:.9},40)}/>
          <path {...L({d:"M40 138 q-9 -3 -13 -12 M40 134 q9 -3 13 -12 M40 130 q-6 -8 -4 -18 M40 130 q6 -8 4 -18",_d:.95},60)}/>
          <path {...L({d:"M352 158 V138",_d:.9},40)}/>
          <path {...L({d:"M352 144 q-7 -2 -10 -9 M352 142 q7 -2 10 -9 M352 138 q-4 -6 -3 -13 M352 138 q4 -6 3 -13",_d:.95},50)}/>
        </g>
        {/* pool line + ripples */}
        <path {...L({d:"M0 172 H232",_d:1},240)}/>
        <g stroke={ink} strokeWidth=".5" opacity=".45">
          <path d="M96 178 q6 -3 12 0 t12 0"/><path d="M140 182 q6 -3 12 0 t12 0"/>
        </g>
        {/* dimension ticks */}
        <g stroke={ink} strokeWidth=".5" opacity=".4">
          <line x1="44" y1="182" x2="44" y2="190"/><line x1="248" y1="182" x2="248" y2="190"/>
          <line x1="44" y1="186" x2="248" y2="186"/>
        </g>
      </svg>
    </div>
  );
}
