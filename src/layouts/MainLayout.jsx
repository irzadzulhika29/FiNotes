import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import BottomNav from "../components/layout/BottomNav";
import TransactionDrawer from "../components/dashboard/TransactionDrawer";
import { Plus } from "lucide-react";

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState("expense");

  const handleOpenDrawer = (type = "expense") => {
    setDrawerType(type);
    setDrawerOpen(true);
  };

  const handleTransactionSuccess = () => {
    // Trigger a refresh - this could be handled with context or state management
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-[#37352F] dark:text-gray-200 font-display transition-colors duration-200 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet context={{ onOpenDrawer: handleOpenDrawer }} />
      </main>

      <BottomNav />

      {/* FAB for Mobile */}
      <button
        onClick={() => handleOpenDrawer("expense")}
        className="fixed bottom-20 right-4 size-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center md:hidden hover:scale-105 transition-transform z-40"
      >
        <Plus className="size-8" />
      </button>

      {/* Transaction Drawer */}
      <TransactionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        type={drawerType}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};

export default MainLayout;
