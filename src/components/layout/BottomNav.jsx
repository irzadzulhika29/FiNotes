import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, Tags, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

const BottomNav = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/" },
    { icon: Calendar, label: "Monthly", path: "/monthly" },
    { icon: Tags, label: "Categories", path: "/categories" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark z-50 pb-safe">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )
            }
          >
            <item.icon className="size-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
