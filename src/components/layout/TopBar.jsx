import React from "react";
import { Plus } from "lucide-react";

const TopBar = ({ title, onOpenDrawer }) => {
  return (
    <header className="h-14 border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 md:px-6 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">
          Personal Finance
        </span>
        <span className="text-gray-400 hidden sm:inline">/</span>
        <span className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          {title}
        </span>
      </div>

      {/* Desktop Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onOpenDrawer?.("expense")}
          className="hidden sm:flex items-center gap-2 h-8 px-3 rounded bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 border border-border-light dark:border-border-dark text-gray-700 dark:text-gray-200 text-xs font-medium transition-all shadow-sm"
        >
          <Plus className="size-4" />
          Expense
        </button>
        <button
          onClick={() => onOpenDrawer?.("income")}
          className="hidden sm:flex items-center gap-2 h-8 px-3 rounded bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="size-4" />
          Income
        </button>
      </div>
    </header>
  );
};

export default TopBar;
