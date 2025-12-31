import React from "react";
import {
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Briefcase,
  Gift,
  Wallet,
  CreditCard,
} from "lucide-react";

const categoryIcons = {
  salary: Briefcase,
  freelance: Wallet,
  investment: TrendingUp,
  gift: Gift,
  other_income: CreditCard,
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  bills: Home,
  other_expense: CreditCard,
};

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { id, type, amount, description, category, date } = transaction;

  const isIncome = type === "income";
  const IconComponent =
    categoryIcons[category] || (isIncome ? TrendingUp : TrendingDown);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-elevated)]/50 hover:bg-[var(--color-bg-elevated)] transition-all duration-200 animate-fade-in">
      {/* Icon */}
      <div
        className={`
        p-3 rounded-xl
        ${
          isIncome
            ? "bg-[var(--color-income)]/15 text-[var(--color-income-light)]"
            : "bg-[var(--color-expense)]/15 text-[var(--color-expense-light)]"
        }
      `}
      >
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[var(--color-text-primary)] truncate">
          {description}
        </h4>
        <p className="text-sm text-[var(--color-text-muted)]">
          {formatDate(date)}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p
          className={`font-semibold tabular-nums ${
            isIncome
              ? "text-[var(--color-income-light)]"
              : "text-[var(--color-expense-light)]"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(amount)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(transaction)}
          className="p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          aria-label="Edit transaction"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-expense)]"
          aria-label="Delete transaction"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
