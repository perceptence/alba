import type { Metadata } from "next";
import CaseStudy from "./CaseStudy";

/* A real route in the same build and on the same origin as the product —
   /case-study is server-rendered by Next, so it returns 200 directly rather
   than relying on a client-side path check or a host rewrite rule. */

export const metadata: Metadata = {
  title: "ALBA — design case study",
  description:
    "How ALBA, a concierge app for managed estates, was designed and built — with the running product embedded.",
};

export default function Page() {
  return <CaseStudy />;
}
