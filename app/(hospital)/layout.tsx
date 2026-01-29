import { ReactNode } from "react";
import HospitalLayoutClient from "./HospitalLayoutClient";

export default function HospitalSubdomainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <HospitalLayoutClient>{children}</HospitalLayoutClient>;
}
