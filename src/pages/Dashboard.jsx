import React from "react";
import { useOutletContext } from "react-router-dom";
import MetricTotalCard from "../components/dashboard/MetricTotalCard";
import MonthlySummaryCards from "../components/dashboard/MonthlySummaryCards";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import TopBar from "../components/layout/TopBar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { profile } = useAuth();
  const { onOpenDrawer } = useOutletContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFullDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const userName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <TopBar title="📊 Dashboard" onOpenDrawer={onOpenDrawer} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 pb-20 md:pb-10">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-6 md:gap-8">
          {/* Welcome Section */}
          <div className="flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {getGreeting()}, {userName}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {getFullDate()}
            </span>
          </div>

          <MetricTotalCard />
          <MonthlySummaryCards />
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
