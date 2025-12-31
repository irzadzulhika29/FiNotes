import React, { useState, useEffect, useMemo } from "react";
import { Plus, Sparkles } from "lucide-react";
import BalanceCard from "./components/BalanceCard";
import MonthCard from "./components/MonthCard";
import TransactionModal from "./components/TransactionModal";
import Button from "./components/ui/Button";

// LocalStorage key
const STORAGE_KEY = "finotes_transactions";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Load transactions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved transactions:", e);
      }
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Calculate total balance
  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      return t.type === "income" ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [transactions]);

  // Group transactions by month
  const groupedTransactions = useMemo(() => {
    const groups = {};

    transactions.forEach((t) => {
      const monthKey = t.date.substring(0, 7); // YYYY-MM
      if (!groups[monthKey]) {
        groups[monthKey] = {
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
        };
      }
      groups[monthKey].transactions.push(t);
      if (t.type === "income") {
        groups[monthKey].totalIncome += t.amount;
      } else {
        groups[monthKey].totalExpense += t.amount;
      }
    });

    // Sort transactions within each month by date (newest first)
    Object.keys(groups).forEach((key) => {
      groups[key].transactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    });

    // Return sorted by month (newest first)
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([monthKey, data]) => ({
        monthKey,
        ...data,
      }));
  }, [transactions]);

  // Handlers
  const handleAddTransaction = (monthKey = null) => {
    setSelectedMonth(monthKey);
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setSelectedMonth(null);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      // Update existing
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionData.id ? transactionData : t))
      );
    } else {
      // Add new
      setTransactions((prev) => [...prev, transactionData]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    setSelectedMonth(null);
  };

  // Get current month key
  const currentMonthKey = new Date().toISOString().substring(0, 7);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--color-bg-primary)]/80 border-b border-[var(--glass-border)]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />
            <h1 className="text-xl font-bold text-gradient">FiNotes</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <BalanceCard totalBalance={totalBalance} />

        {/* Month Cards */}
        <div className="space-y-4">
          {/* Current month first if not exists */}
          {groupedTransactions.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Mulai Catat Keuanganmu
              </h3>
              <p className="text-[var(--color-text-muted)] mb-4">
                Tambahkan pemasukan dan pengeluaran pertamamu
              </p>
              <Button
                variant="primary"
                onClick={() => handleAddTransaction(currentMonthKey)}
              >
                <Plus className="w-4 h-4" />
                Tambah Transaksi
              </Button>
            </div>
          ) : (
            groupedTransactions.map(
              ({ monthKey, transactions, totalIncome, totalExpense }) => (
                <MonthCard
                  key={monthKey}
                  monthKey={monthKey}
                  transactions={transactions}
                  totalIncome={totalIncome}
                  totalExpense={totalExpense}
                  onAddTransaction={handleAddTransaction}
                  onEditTransaction={handleEditTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              )
            )
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      {groupedTransactions.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleAddTransaction(currentMonthKey)}
            className="rounded-full shadow-2xl shadow-[var(--color-primary)]/40 hover-scale"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        defaultMonth={selectedMonth}
      />
    </div>
  );
}

export default App;
