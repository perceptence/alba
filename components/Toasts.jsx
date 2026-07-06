import { useState } from "react";
import { I } from "@/components/icons";

/* Transient toast notifications. */
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (t) => {
    const id = Date.now() + Math.random();
    setToasts((x) => [...x, { id, ...t }]);
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 2800);
  };
  return { toasts, push };
}

export const ToastHost = ({ toasts }) => (
  <div className="toasts">
    {toasts.map((t) => (
      <div key={t.id} className="toast">
        <I.check />
        <span className="tt">{t.t}</span>
        {t.d && <span className="td">{t.d}</span>}
      </div>
    ))}
  </div>
);
