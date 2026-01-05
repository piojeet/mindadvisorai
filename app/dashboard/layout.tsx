"use client"
import DasNavBar from "@/components/layout/DasNavBar";
import DasTopNav from "@/components/layout/DasTopNav";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="min-h-screen flex">
        <DasNavBar sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-64 flex flex-col flex-1">
          <DasTopNav onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
