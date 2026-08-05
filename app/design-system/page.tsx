import type { Metadata } from "next";
import DesignSystem from "./DesignSystem";

export const metadata: Metadata = {
  title: "ALBA — design system",
  description:
    "ALBA's colour, type, spacing, radius, motion and contrast — read from the running stylesheet.",
};

export default function Page() {
  return <DesignSystem />;
}
