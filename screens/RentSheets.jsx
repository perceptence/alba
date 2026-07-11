import { PAYMENTS } from "@/lib/data";
import { money } from "@/lib/util";
import { I } from "@/components/icons";
import { useSheet } from "@/components/useSheet";

export function PayDetailSheet({ id, onClose }) {
  const { close, scrimProps, sheetProps } = useSheet(onClose);
  const pp=PAYMENTS.find(x=>x.id===id);
  if(!pp)return null;
  return (<div {...scrimProps}><div {...sheetProps}>
    <div className="grab"/>
    <div className="sh-head"><span style={{flex:1}}><div className="sh-title sf">{pp.month}</div><div className="sh-sub">Rent payment</div></span>
      <button className="sh-x" onClick={close} aria-label="Close"><I.close/></button></div>
    <div className="sh-body">
      <div className="kvl" style={{marginTop:0}}>
        <div className="kv"><span className="k">Status</span><span className="v st-g">Paid</span></div>
        <div className="kv"><span className="k">Amount</span><span className="v num">{money(pp.amount)}</span></div>
        <div className="kv"><span className="k">Paid on</span><span className="v">{pp.paid}</span></div>
        <div className="kv"><span className="k">Method</span><span className="v">{pp.method}</span></div>
        <div className="kv"><span className="k">Via</span><span className="v">{pp.via}</span></div>
        <div className="kv"><span className="k">Confirmation</span><span className="v">{pp.conf}</span></div>
      </div>
    </div>
  </div></div>);
}
