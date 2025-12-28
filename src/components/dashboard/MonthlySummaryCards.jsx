import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  getMonthlySummary,
  getCurrentMonth,
  formatCurrency,
} from "../../lib/financeService";

const SummaryCard = ({ label, amount, type, loading }) => {
  const amountColor =
    type === "income"
      ? "text-primary"
      : type === "expense"
      ? "text-red-500"
      : "text-gray-900 dark:text-white";
  const prefix = type === "income" ? "+ " : type === "expense" ? "- " : "";

  return (
    <div className="bg-paper-light dark:bg-paper-dark rounded-lg p-5 border border-border-light dark:border-border-dark flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
      {loading ? (
        <div className="flex items-center gap-2 h-8">
          <Loader2 className="size-5 animate-spin text-gray-400" />
        </div>
      ) : (
        <span className={`text-2xl font-bold ${amountColor} tracking-tight`}>
          {prefix}
          {formatCurrency(Math.abs(amount))}
        </span>
      )}

      {type === "net" && !loading && (
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>This month's balance</span>
        </div>
      )}
    </div>
  );
};

const MonthlySummaryCards = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0 });
  const [loading, setLoading] = useState(true);
  const currentMonth = getCurrentMonth();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const { data, error } = await getMonthlySummary(currentMonth);
    if (!error && data) {
      setSummary(data);
    }
    setLoading(false);
  };

  const getMonthLabel = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryCard
        label={`Income (${getMonthLabel()})`}
        amount={summary.income}
        type="income"
        loading={loading}
      />
      <SummaryCard
        label={`Expense (${getMonthLabel()})`}
        amount={summary.expense}
        type="expense"
        loading={loading}
      />
      <SummaryCard
        label="Net Value"
        amount={summary.net}
        type="net"
        loading={loading}
      />
    </div>
  );
};

export default MonthlySummaryCards;
