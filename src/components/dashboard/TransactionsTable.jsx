import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ShoppingCart,
  Briefcase,
  CarTaxiFront,
  Music,
  Loader2,
  Receipt,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  getTransactions,
  formatCurrency,
  formatDate,
  deleteTransaction,
} from "../../lib/financeService";

const defaultIcons = {
  Food: {
    icon: ShoppingCart,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  Income: { icon: Briefcase, color: "text-green-600", bgColor: "bg-green-100" },
  Transport: {
    icon: CarTaxiFront,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  Subscription: {
    icon: Music,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  default: { icon: Receipt, color: "text-gray-600", bgColor: "bg-gray-100" },
};

const getIconConfig = (categoryName, type) => {
  if (type === "income") {
    return defaultIcons["Income"];
  }
  return defaultIcons[categoryName] || defaultIcons["default"];
};

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await getTransactions(null, 10);
    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await deleteTransaction(id);
    if (!error) {
      setTransactions(transactions.filter((tx) => tx.id !== id));
    }
    setActiveMenu(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Recent Transactions
          </h3>
        </div>
        <div className="bg-paper-light dark:bg-paper-dark border border-border-light dark:border-border-dark rounded-lg p-8 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Recent Transactions
          </h3>
        </div>
        <div className="bg-paper-light dark:bg-paper-dark border border-border-light dark:border-border-dark rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <Receipt className="size-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No transactions yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Start by adding your first income or expense
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Recent Transactions
        </h3>
        <button className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
          View All
          <ArrowRight className="size-4" />
        </button>
      </div>

      <div className="bg-paper-light dark:bg-paper-dark border border-border-light dark:border-border-dark rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-white/5">
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                Date
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Category
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.map((tx) => {
              const categoryName =
                tx.category?.name ||
                (tx.type === "income" ? "Income" : "Other");
              const iconConfig = getIconConfig(categoryName, tx.type);
              const IconComponent = iconConfig.icon;

              return (
                <tr
                  key={tx.id}
                  className="group border-b border-border-light dark:border-border-dark last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-8 sm:size-6 rounded flex items-center justify-center shrink-0",
                          iconConfig.bgColor,
                          iconConfig.color
                        )}
                      >
                        <IconComponent className="size-4" />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                        <span className="truncate max-w-[150px] sm:max-w-none">
                          {tx.description}
                        </span>
                        <span className="sm:hidden text-xs text-gray-400 font-normal">
                          {categoryName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                        tx.type === "income"
                          ? "bg-primary/10 text-green-800 dark:text-green-300 border-primary/20"
                          : "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300 border-border-light dark:border-transparent"
                      )}
                    >
                      {categoryName}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "py-3 px-4 text-right font-medium transition-colors",
                      tx.type === "income"
                        ? "text-primary"
                        : "text-gray-900 dark:text-white group-hover:text-red-500"
                    )}
                  >
                    {tx.type === "income" ? "+" : "-"}{" "}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3 px-4 relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === tx.id ? null : tx.id)
                      }
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="size-4 text-gray-400" />
                    </button>

                    {activeMenu === tx.id && (
                      <div className="absolute right-4 top-full mt-1 bg-paper-light dark:bg-paper-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-20 py-1 min-w-[120px]">
                        <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center gap-2">
                          <Edit className="size-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
