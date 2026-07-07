import { AV, ROSA } from "@/lib/data";
import { Avatar } from "@/components/Avatar";

/* The estate manager's presence — avatar, name, availability dot, and
   "role · replies" line. Shared by the Concierge tab and the Residence
   "Your manager" section so Rosa reads as one person everywhere.
   Pass `large` for the roomier section variant (Residence). */
export function ManagerPresence({ large = false }) {
  return (
    <div className={"mgr-id" + (large ? " lg" : "")}>
      <Avatar cfg={AV.rosa} size={44} />
      <div className="mgr-idty">
        <div className="mgr-name sf">{ROSA.name}</div>
        <div className="mgr-sub"><span className="mgr-dot" />{ROSA.role} · Replies within the hour</div>
      </div>
    </div>
  );
}
