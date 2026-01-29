import type { Metadata } from "next";
import HospitalHomeClient from "./HospitalHomeClient";

export const dynamic = "force-dynamic";

export default function HospitalHomePage() {
  return <HospitalHomeClient />;
}
