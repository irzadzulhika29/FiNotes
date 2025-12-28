import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Tags,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Monthly Pages", path: "/monthly" },
    { icon: Tags, label: "Categories", path: "/categories" },
  ];

  return (
    <aside className="hidden md:flex w-64 h-full flex-shrink-0 bg-background-light dark:bg-background-dark border-r border-border-light dark:border-border-dark flex-col pt-6 pb-4 transition-all duration-300">
      {/* User Profile */}
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            MF
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-sm font-semibold leading-tight truncate text-gray-900 dark:text-white">
              My Finance
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Personal Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                isActive
                  ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              )
            }
          >
            <item.icon className="size-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-2 border-t border-border-light dark:border-border-dark px-3">
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Favorites
          </p>
          <a
            className="flex items-center gap-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            href="#"
          >
            <span className="size-1.5 rounded-full bg-primary"></span>
            Savings Goal
          </a>
        </div>
      </nav>

      {/* Bottom Settings */}
      <div className="px-2 mt-auto">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              isActive
                ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            )
          }
        >
          <Settings className="size-5" />
          <span className="text-sm font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
