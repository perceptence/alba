import { RM } from "@/lib/util";

/* Architectural line-art elevations. One drawing per estate — all in the same
   hand: ink line on paper, a thin sun, the ground carried through, and the
   whole thing draws itself in on arrival. `variant` picks the house; the
   default (verde) is also the residence in the resident app. */

const ink = "#2A241E";

/* ——— shared vocabulary ———
   Module-scope components (stable types): helpers defined inside the render
   function would remount on every parent re-render, restarting the draw
   animation and leaving them hidden mid-dash. */
const Ground = ({ L }) => (<>
  <line {...L({ x1: 0, y1: 158, x2: 392, y2: 158, _d: .1 })}/>
  <line x1="0" y1="162" x2="392" y2="162" stroke={ink} strokeWidth=".5" opacity=".4"/>
</>);
const Sun = ({ L, x = 312, y = 60 }) => (<>
  <circle {...L({ cx: x, cy: y, r: 15, _d: .3 }, 100)}/>
  <g stroke={ink} strokeWidth=".6" opacity=".5">
    <line x1={x} y1={y - 26} x2={x} y2={y - 20}/><line x1={x} y1={y + 20} x2={x} y2={y + 26}/>
    <line x1={x - 26} y1={y} x2={x - 20} y2={y}/><line x1={x + 20} y1={y} x2={x + 26} y2={y}/>
    <line x1={x - 18} y1={y - 18} x2={x - 14} y2={y - 14}/><line x1={x + 14} y1={y + 14} x2={x + 18} y2={y + 18}/>
    <line x1={x + 18} y1={y - 18} x2={x + 14} y2={y - 14}/><line x1={x - 18} y1={y + 14} x2={x - 14} y2={y + 18}/>
  </g>
</>);
const Olive = ({ L, x, s = 1, y = 158, d = .9 }) => (
  <g stroke={ink} strokeWidth=".9">
    <path {...L({ d: `M${x} ${y} V${y - 26 * s}`, _d: d }, 40)}/>
    <path {...L({ d: `M${x} ${y - 20 * s} q${-9 * s} ${-3 * s} ${-13 * s} ${-12 * s} M${x} ${y - 24 * s} q${9 * s} ${-3 * s} ${13 * s} ${-12 * s} M${x} ${y - 28 * s} q${-6 * s} ${-8 * s} ${-4 * s} ${-18 * s} M${x} ${y - 28 * s} q${6 * s} ${-8 * s} ${4 * s} ${-18 * s}`, _d: d + .05 }, 60)}/>
  </g>
);
const Cypress = ({ L, x, ht = 44, y = 158, d = .9 }) => (
  <g stroke={ink} strokeWidth=".9">
    <path {...L({ d: `M${x} ${y} v-8`, _d: d }, 20)}/>
    <path {...L({ d: `M${x} ${y - 8} c-6 -8 -6 ${-(ht - 10)} 0 ${-ht} c6 ${ht - 10} 6 ${ht - 8} 0 ${ht}`, _d: d + .05 }, 140)}/>
  </g>
);
const Dim = ({ a, b }) => (
  <g stroke={ink} strokeWidth=".5" opacity=".4">
    <line x1={a} y1="182" x2={a} y2="190"/><line x1={b} y1="182" x2={b} y2="190"/>
    <line x1={a} y1="186" x2={b} y2="186"/>
  </g>
);

export function Elevation({ h = 196, animate = true, variant = "verde" }) {
  const dash = animate && !RM;
  const L = ({ _d = 0, ...props }, len = 400) => ({
    ...props,
    strokeDasharray: dash ? len : undefined,
    strokeDashoffset: dash ? len : undefined,
    style: dash
      ? { animation: `draw 1.4s var(--e) forwards`, animationDelay: _d + "s" }
      : undefined,
  });

  /* ——— the houses ——— */
  const arts = {

    /* The Verde Bungalow — single-storey modernist, glazing, pool */
    verde: () => (<>
      <Ground L={L}/>
      <path {...L({ d: "M56 158 V96 H236 V158", _d: .2 })}/>
      <path {...L({ d: "M44 96 H248", _d: .35 })}/>
      <path {...L({ d: "M44 92 H248", _d: .4 })}/>
      <path {...L({ d: "M236 158 V112 H330 V158", _d: .5 })}/>
      <path {...L({ d: "M228 112 H338", _d: .55 })}/>
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <line {...L({ x1: 76, y1: 100, x2: 76, y2: 158, _d: .5 }, 80)}/>
        <line {...L({ x1: 104, y1: 100, x2: 104, y2: 158, _d: .55 }, 80)}/>
        <line {...L({ x1: 132, y1: 100, x2: 132, y2: 158, _d: .6 }, 80)}/>
        <line {...L({ x1: 160, y1: 100, x2: 160, y2: 158, _d: .65 }, 80)}/>
        <line {...L({ x1: 188, y1: 100, x2: 188, y2: 158, _d: .7 }, 80)}/>
        <line {...L({ x1: 216, y1: 100, x2: 216, y2: 158, _d: .75 }, 80)}/>
        <line x1="56" y1="128" x2="236" y2="128" strokeWidth=".6" opacity=".7"/>
      </g>
      <path {...L({ d: "M120 158 V116 H144 V158", _d: .7 }, 120)}/>
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <rect {...L({ x: 250, y: 124, width: 24, height: 28, _d: .8 }, 96)}/>
        <rect {...L({ x: 284, y: 124, width: 24, height: 28, _d: .85 }, 96)}/>
      </g>
      <Sun L={L}/>
      <Olive L={L} x={40} d={.9}/>
      <g stroke={ink} strokeWidth=".9">
        <path {...L({ d: "M352 158 V138", _d: .9 }, 40)}/>
        <path {...L({ d: "M352 144 q-7 -2 -10 -9 M352 142 q7 -2 10 -9 M352 138 q-4 -6 -3 -13 M352 138 q4 -6 3 -13", _d: .95 }, 50)}/>
      </g>
      <path {...L({ d: "M0 172 H232", _d: 1 }, 240)}/>
      <g stroke={ink} strokeWidth=".5" opacity=".45">
        <path d="M96 178 q6 -3 12 0 t12 0"/><path d="M140 182 q6 -3 12 0 t12 0"/>
      </g>
      <Dim a={44} b={248}/>
    </>),

    /* Stone Canyon Villa — Mediterranean: tiled gable, loggia arches, garden wall */
    stone: () => (<>
      <Ground L={L}/>
      <path {...L({ d: "M64 158 V86 H252 V158", _d: .2 })}/>
      <path {...L({ d: "M52 86 L158 58 L264 86", _d: .35 })}/>
      <path {...L({ d: "M60 86 L158 62 L256 86", _d: .4 })}/>
      {/* colonnaded loggia */}
      <g strokeWidth=".9">
        <path {...L({ d: "M84 158 V134 Q84 120 100 120 Q116 120 116 134 V158", _d: .55 }, 120)}/>
        <path {...L({ d: "M132 158 V134 Q132 120 148 120 Q164 120 164 134 V158", _d: .62 }, 120)}/>
        <path {...L({ d: "M180 158 V134 Q180 120 196 120 Q212 120 212 134 V158", _d: .69 }, 120)}/>
      </g>
      {/* shuttered upper windows */}
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <rect {...L({ x: 88, y: 96, width: 18, height: 20, _d: .74 }, 80)}/>
        <rect {...L({ x: 130, y: 96, width: 18, height: 20, _d: .78 }, 80)}/>
        <rect {...L({ x: 172, y: 96, width: 18, height: 20, _d: .82 }, 80)}/>
        <rect {...L({ x: 214, y: 96, width: 18, height: 20, _d: .86 }, 80)}/>
      </g>
      {/* garden wall + gate */}
      <path {...L({ d: "M252 130 H340 V158", _d: .6 }, 140)}/>
      <path {...L({ d: "M296 158 V138 H316 V158", _d: .7 }, 80)}/>
      <Sun L={L} x={318} y={56}/>
      <Cypress L={L} x={40} ht={46}/>
      <Cypress L={L} x={358} ht={36} d={.95}/>
      <Dim a={64} b={252}/>
    </>),

    /* The Palisade House — cliffside contemporary: long glass volume, deck over the drop, sea below */
    palisade: () => (<>
      {/* clifftop, edge, and the water below */}
      <path {...L({ d: "M392 158 H164 L142 180 H120", _d: .1 })}/>
      <line x1="180" y1="162" x2="392" y2="162" stroke={ink} strokeWidth=".5" opacity=".4"/>
      <path {...L({ d: "M0 180 H108", _d: .9 }, 120)}/>
      <g stroke={ink} strokeWidth=".5" opacity=".45">
        <path d="M16 186 q6 -3 12 0 t12 0"/><path d="M56 190 q6 -3 12 0 t12 0"/>
      </g>
      {/* the long volume */}
      <path {...L({ d: "M180 158 V104 H344 V158", _d: .2 })}/>
      <path {...L({ d: "M170 104 H352", _d: .35 })}/>
      <path {...L({ d: "M170 100 H352", _d: .4 })}/>
      {/* full-height glazing */}
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <line {...L({ x1: 204, y1: 108, x2: 204, y2: 158, _d: .5 }, 80)}/>
        <line {...L({ x1: 232, y1: 108, x2: 232, y2: 158, _d: .55 }, 80)}/>
        <line {...L({ x1: 260, y1: 108, x2: 260, y2: 158, _d: .6 }, 80)}/>
        <line {...L({ x1: 288, y1: 108, x2: 288, y2: 158, _d: .65 }, 80)}/>
        <line {...L({ x1: 316, y1: 108, x2: 316, y2: 158, _d: .7 }, 80)}/>
        <line x1="180" y1="132" x2="344" y2="132" strokeWidth=".6" opacity=".7"/>
      </g>
      {/* cantilevered deck with rail */}
      <path {...L({ d: "M180 130 H128", _d: .6 }, 80)}/>
      <path {...L({ d: "M128 122 H180", _d: .68 }, 80)}/>
      <g stroke={ink} strokeWidth=".6" opacity=".7">
        <line {...L({ x1: 134, y1: 122, x2: 134, y2: 130, _d: .74 }, 20)}/>
        <line {...L({ x1: 150, y1: 122, x2: 150, y2: 130, _d: .78 }, 20)}/>
        <line {...L({ x1: 166, y1: 122, x2: 166, y2: 130, _d: .82 }, 20)}/>
      </g>
      <path {...L({ d: "M180 148 L152 130", _d: .8 }, 60)}/>
      <Sun L={L} x={64} y={54}/>
      <Olive L={L} x={372} s={.8} d={.95}/>
    </>),

    /* The Cypress House — brick traditional: steep gable, chimney, sash windows, portico */
    cypress: () => (<>
      <Ground L={L}/>
      <path {...L({ d: "M84 158 V102 H236 V158", _d: .2 })}/>
      <path {...L({ d: "M72 102 L160 56 L248 102", _d: .35 })}/>
      <path {...L({ d: "M80 102 L160 60 L240 102", _d: .4 })}/>
      {/* chimney */}
      <path {...L({ d: "M196 74 V54 H210 V81", _d: .5 }, 80)}/>
      <line x1="194" y1="54" x2="212" y2="54" stroke={ink} strokeWidth=".7" opacity=".85"/>
      {/* door + portico */}
      <path {...L({ d: "M148 158 V118 H172 V158", _d: .6 }, 120)}/>
      <path {...L({ d: "M140 114 H180", _d: .68 }, 60)}/>
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <line {...L({ x1: 142, y1: 114, x2: 142, y2: 158, _d: .72 }, 60)}/>
        <line {...L({ x1: 178, y1: 114, x2: 178, y2: 158, _d: .72 }, 60)}/>
      </g>
      {/* sash windows */}
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <rect {...L({ x: 100, y: 116, width: 24, height: 26, _d: .76 }, 100)}/>
        <line x1="112" y1="116" x2="112" y2="142" strokeWidth=".5" opacity=".7"/><line x1="100" y1="129" x2="124" y2="129" strokeWidth=".5" opacity=".7"/>
        <rect {...L({ x: 196, y: 116, width: 24, height: 26, _d: .8 }, 100)}/>
        <line x1="208" y1="116" x2="208" y2="142" strokeWidth=".5" opacity=".7"/><line x1="196" y1="129" x2="220" y2="129" strokeWidth=".5" opacity=".7"/>
      </g>
      {/* side wing */}
      <path {...L({ d: "M236 158 V122 H320 V158", _d: .5 })}/>
      <path {...L({ d: "M230 122 L278 100 L326 122", _d: .55 })}/>
      {/* brick coursing hints */}
      <g stroke={ink} strokeWidth=".5" opacity=".35">
        <line x1="88" y1="112" x2="96" y2="112"/><line x1="88" y1="122" x2="96" y2="122"/><line x1="88" y1="132" x2="96" y2="132"/>
      </g>
      <Sun L={L} x={312} y={52}/>
      <Cypress L={L} x={52} ht={48}/>
      <Cypress L={L} x={348} ht={40} d={.95}/>
      <Dim a={84} b={236}/>
    </>),

    /* Canyon Rise — hillside modern: stepped volumes down a slope, stilts */
    canyon: () => (<>
      {/* the hillside */}
      <path {...L({ d: "M0 134 L392 174", _d: .1 })}/>
      <path d="M0 138 L392 178" stroke={ink} strokeWidth=".5" opacity=".4"/>
      {/* upper volume, bedded into the hill */}
      <path {...L({ d: "M60 140 V84 H200 V152", _d: .2 })}/>
      <path {...L({ d: "M52 84 H208", _d: .35 })}/>
      <path {...L({ d: "M52 80 H208", _d: .4 })}/>
      {/* lower volume, stepping downhill */}
      <path {...L({ d: "M200 112 H312 V152 H200", _d: .45 })}/>
      <path {...L({ d: "M194 112 H320", _d: .5 })}/>
      {/* stilts to the falling ground */}
      <g strokeWidth=".9">
        <line {...L({ x1: 284, y1: 152, x2: 284, y2: 163, _d: .8 }, 20)}/>
        <line {...L({ x1: 306, y1: 152, x2: 306, y2: 166, _d: .84 }, 20)}/>
      </g>
      {/* glazing — clerestory above, full glass below */}
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <line x1="60" y1="96" x2="200" y2="96" strokeWidth=".6" opacity=".7"/>
        {/* mullions land on the falling ground, not through it */}
        <line {...L({ x1: 96, y1: 96, x2: 96, y2: 144, _d: .55 }, 80)}/>
        <line {...L({ x1: 132, y1: 96, x2: 132, y2: 147, _d: .6 }, 80)}/>
        <line {...L({ x1: 168, y1: 96, x2: 168, y2: 151, _d: .65 }, 80)}/>
        <line {...L({ x1: 224, y1: 112, x2: 224, y2: 152, _d: .7 }, 60)}/>
        <line {...L({ x1: 248, y1: 112, x2: 248, y2: 152, _d: .74 }, 60)}/>
        <line {...L({ x1: 272, y1: 112, x2: 272, y2: 152, _d: .78 }, 60)}/>
        <line x1="200" y1="132" x2="312" y2="132" strokeWidth=".6" opacity=".7"/>
      </g>
      <Sun L={L} x={330} y={58}/>
      <Olive L={L} x={34} s={.9} y={137} d={.9}/>
      <Dim a={60} b={312}/>
    </>),

    /* The Olive Court — courtyard estate: twin wings, low wall, arched gate, the olive at its heart */
    olive: () => (<>
      <Ground L={L}/>
      {/* twin wings with parapets */}
      <path {...L({ d: "M44 158 V102 H150 V158", _d: .2 })}/>
      <path {...L({ d: "M38 102 H156", _d: .35 })}/>
      <path {...L({ d: "M38 98 H156", _d: .4 })}/>
      <path {...L({ d: "M242 158 V102 H348 V158", _d: .25 })}/>
      <path {...L({ d: "M236 102 H354", _d: .38 })}/>
      <path {...L({ d: "M236 98 H354", _d: .43 })}/>
      {/* court wall + arched gate */}
      <path {...L({ d: "M150 134 H160 M188 134 H242", _d: .55 }, 120)}/>
      <g strokeWidth=".9">
        <line {...L({ x1: 160, y1: 134, x2: 160, y2: 158, _d: .62 }, 30)}/>
        <line {...L({ x1: 188, y1: 134, x2: 188, y2: 158, _d: .62 }, 30)}/>
      </g>
      <path {...L({ d: "M160 134 Q174 120 188 134", _d: .68 }, 50)}/>
      {/* the olive at the heart of the court */}
      <Olive L={L} x={216} s={1.15} d={.8}/>
      {/* wing windows + court-facing doors */}
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <rect {...L({ x: 60, y: 116, width: 20, height: 24, _d: .72 }, 90)}/>
        <rect {...L({ x: 96, y: 116, width: 20, height: 24, _d: .76 }, 90)}/>
        <rect {...L({ x: 262, y: 116, width: 20, height: 24, _d: .8 }, 90)}/>
        <rect {...L({ x: 300, y: 116, width: 20, height: 24, _d: .84 }, 90)}/>
      </g>
      <path {...L({ d: "M126 158 V124 H146 V158", _d: .74 }, 90)}/>
      <Sun L={L} x={312} y={54}/>
      <Dim a={44} b={348}/>
    </>),

    /* The Laurel — garden house: small gable, pergola, shrubs along the ground */
    laurel: () => (<>
      <Ground L={L}/>
      <path {...L({ d: "M96 158 V110 H222 V158", _d: .2 })}/>
      <path {...L({ d: "M84 110 L159 76 L234 110", _d: .35 })}/>
      <path {...L({ d: "M92 110 L159 80 L226 110", _d: .4 })}/>
      {/* door + cottage windows */}
      <path {...L({ d: "M146 158 V120 H170 V158", _d: .6 }, 120)}/>
      <g stroke={ink} strokeWidth=".7" opacity=".85">
        <rect {...L({ x: 108, y: 122, width: 20, height: 22, _d: .68 }, 90)}/>
        <line x1="118" y1="122" x2="118" y2="144" strokeWidth=".5" opacity=".7"/><line x1="108" y1="133" x2="128" y2="133" strokeWidth=".5" opacity=".7"/>
        <rect {...L({ x: 186, y: 122, width: 20, height: 22, _d: .72 }, 90)}/>
        <line x1="196" y1="122" x2="196" y2="144" strokeWidth=".5" opacity=".7"/><line x1="186" y1="133" x2="206" y2="133" strokeWidth=".5" opacity=".7"/>
      </g>
      {/* pergola */}
      <path {...L({ d: "M222 124 H322", _d: .55 }, 120)}/>
      <path {...L({ d: "M226 120 H326", _d: .6 }, 120)}/>
      <g strokeWidth=".9">
        <line {...L({ x1: 240, y1: 124, x2: 240, y2: 158, _d: .68 }, 40)}/>
        <line {...L({ x1: 272, y1: 124, x2: 272, y2: 158, _d: .72 }, 40)}/>
        <line {...L({ x1: 304, y1: 124, x2: 304, y2: 158, _d: .76 }, 40)}/>
      </g>
      <g stroke={ink} strokeWidth=".6" opacity=".7">
        <line x1="234" y1="116" x2="234" y2="120"/><line x1="250" y1="116" x2="250" y2="120"/>
        <line x1="266" y1="116" x2="266" y2="120"/><line x1="282" y1="116" x2="282" y2="120"/>
        <line x1="298" y1="116" x2="298" y2="120"/><line x1="314" y1="116" x2="314" y2="120"/>
      </g>
      <path {...L({ d: "M240 124 q10 -8 20 0 q10 8 20 0 q10 -8 20 0", _d: .85 }, 80)} stroke={ink} strokeWidth=".5" opacity=".5"/>
      {/* garden shrubs */}
      <g stroke={ink} strokeWidth=".9">
        <path {...L({ d: "M40 158 q10 -16 20 0", _d: .9 }, 40)}/>
        <path {...L({ d: "M64 158 q8 -12 16 0", _d: .94 }, 30)}/>
        <path {...L({ d: "M340 158 q10 -16 20 0", _d: .92 }, 40)}/>
      </g>
      <Olive L={L} x={368} s={.75} d={.96}/>
      <Sun L={L} x={60} y={54}/>
      <Dim a={96} b={222}/>
    </>),
  };

  return (
    <div className="elev" style={{ "--elev-h": h + "px" }}>
      <svg viewBox="0 30 392 166" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style={{display:"block"}} fill="none" stroke={ink} strokeWidth="0.914" strokeLinecap="round" strokeLinejoin="round">
        {(arts[variant] || arts.verde)()}
      </svg>
    </div>
  );
}
