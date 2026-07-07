import { I } from "@/components/icons";

/* The single "text · arrow · underline" link used across the app.
   Renders a <button> when interactive (onClick), or a <span> when it's a
   visual affordance nested inside another button (e.g. the Home residence
   panel). It sits 20px below the element above it via .txtlink in alba.css;
   where that element carries trailing padding, that instance zeroes it
   (see the :has(+ .txtlink) rules) so the gap is always a clean 20px. */
export function TextLink({ children, onClick }) {
  if (onClick) {
    return (
      <button className="txtlink" onClick={onClick}>{children}<I.arrow /></button>
    );
  }
  return <span className="txtlink">{children}<I.arrow /></span>;
}
