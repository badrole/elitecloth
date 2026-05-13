import { Metadata } from "next";
import { AdminAuthWrapper } from "@/components/admin/auth-wrapper";

export const metadata: Metadata = {
  title: "Admin Dashboard | Elitecloth",
  description: "Elitecloth Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthWrapper>{children}</AdminAuthWrapper>;
}
