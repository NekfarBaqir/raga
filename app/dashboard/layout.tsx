"use client";

import { useState } from "react";
import Sidebar from "@/components/dash-component/sidebar";
import Header from "@/components/dash-component/Header";
import Insight from "@/app/dashboard/Insight/Insight";
import Questions from "@/app/dashboard/Question/Question";
import Submissions from "@/app/dashboard/Submission/Submission";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<
    "insight" | "questions" | "submissions"
  >("insight");

  const renderContent = () => {
    switch (activeTab) {
      case "insight":
        return <Insight />;
      case "questions":
        return <Questions />;
      case "submissions":
        return <Submissions />;
      default:
        return <Insight />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
