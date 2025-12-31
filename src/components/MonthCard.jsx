import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import TransactionItem from "./TransactionItem";
import Button from "./ui/Button";

const MonthCard = ({
  monthKey,
  transactions,
  totalIncome,
  totalExpense,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonthYear = (key) => {
    const [year, month] = key.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  const netAmount = totalIncome - totalExpense;
  const incomePercentage =
    totalIncome + totalExpense > 0
      ? (totalIncome / (totalIncome + totalExpense)) * 100
      : 50;

  return (
    <div className="glass-card overflow-hidden animate-fade-in hover-lift border border-[var(--glass-border)]/70">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 sm:p-6 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/25">
            <span className="text-white font-bold text-sm tracking-wide">
              {monthKey.split("-")[1]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)] text-base">
              {formatMonthYear(monthKey)}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {transactions.length} transaksi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onAddTransaction(monthKey);
            }}
            className="hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
          >
            <Plus className="w-5 h-5" />
          </Button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 sm:px-6 pb-4 border-b border-[var(--glass-border)]/70">
        {/* Income & Expense */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-income-light)]" />
            <span className="text-sm text-[var(--color-text-secondary)]">
              Pemasukan
            </span>
            <span className="font-semibold text-[var(--color-income-light)] tabular-nums">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[var(--color-expense-light)]" />
            <span className="text-sm text-[var(--color-text-secondary)]">
              Pengeluaran
            </span>
            <span className="font-semibold text-[var(--color-expense-light)] tabular-nums">
              {formatCurrency(totalExpense)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
          <div
            className="h-full gradient-income transition-all duration-500 ease-out rounded-full"
            style={{ width: `${incomePercentage}%` }}
          />
        </div>

        {/* Net Amount */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-muted)]">
            Saldo Bulan Ini
          </span>
          <span
            className={`font-bold tabular-nums ${
              netAmount >= 0
                ? "text-[var(--color-income-light)]"
                : "text-[var(--color-expense-light)]"
            }`}
          >
            {netAmount >= 0 ? "+" : ""}
            {formatCurrency(netAmount)}
          </span>
        </div>
      </div>

      {/* Transactions List */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={onEditTransaction}
                onDelete={onDeleteTransaction}
              />
            ))
          ) : (
            <div className="text-center py-8 text-[var(--color-text-muted)]">
              <p>Belum ada transaksi</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => onAddTransaction(monthKey)}
              >
                <Plus className="w-4 h-4" />
                Tambah Transaksi
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthCard;
