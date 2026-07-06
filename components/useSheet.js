import { useState } from "react";

/* Shared open/close behaviour for bottom-sheet flyouts.
   Spread scrimProps/sheetProps onto the two wrapper divs, and call `close` from
   any dismiss control (X button, scrim, cancel) so the slide-out animation plays
   before the sheet unmounts. The timeout matches the .3s in .sheet.closing
   (see app/alba.css). */
export function useSheet(onClose) {
  const [closing, setClosing] = useState(false);
  const close = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 300);
  };
  return {
    close,
    scrimProps: { className: "scrim" + (closing ? " closing" : ""), onClick: close },
    sheetProps: { className: "sheet" + (closing ? " closing" : ""), onClick: (e) => e.stopPropagation() },
  };
}
