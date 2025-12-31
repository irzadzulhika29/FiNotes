import React, { useState, useEffect, useMemo } from "react";
import { Plus, Sparkles } from "lucide-react";
import BalanceCard from "./components/BalanceCard";
import MonthCard from "./components/MonthCard";
import TransactionModal from "./components/TransactionModal";
import ConnectionStatus from "./components/ConnectionStatus";
import Button from "./components/ui/Button";
import { useToast, ToastContainer } from "./components/ui/Toast";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  subscribeToTransactions,
} from "./services/transactionService";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Load transactions from Supabase
  useEffect(() => {
    loadTransactions();
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const unsubscribe = subscribeToTransactions((payload) => {
      console.log("Realtime update:", payload);

      if (payload.eventType === "INSERT") {
        setTransactions((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setTransactions((prev) =>
          prev.map((t) => (t.id === payload.new.id ? payload.new : t))
        );
      } else if (payload.eventType === "DELETE") {
        setTransactions((prev) => prev.filter((t) => t.id !== payload.old.id));
      }
    });

    return () => unsubscribe();
  }, []);

  // Load all transactions from database
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const result = await getAllTransactions();

      if (result.success) {
        setTransactions(result.data);
      } else {
        showError(result.error || "Gagal memuat transaksi");
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      showError("Gagal memuat transaksi");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDeleteTransaction = async (id) => {
    try {
      const result = await deleteTransaction(id);

      if (result.success) {
        // Update akan otomatis via realtime subscription
        // Tapi kita update local state juga untuk immediate feedback
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        showSuccess("Transaksi berhasil dihapus");
      } else {
        showError(result.error || "Gagal menghapus transaksi");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showError("Gagal menghapus transaksi");
    }
  };

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        // Update existing
        const result = await updateTransaction(editingTransaction.id, transactionData);

        if (result.success) {
          setTransactions((prev) =>
            prev.map((t) => (t.id === result.data.id ? result.data : t))
          );
          showSuccess("Transaksi berhasil diperbarui");
        } else {
          showError(result.error || "Gagal memperbarui transaksi");
        }
      } else {
        // Add new
        const result = await createTransaction(transactionData);

        if (result.success) {
          setTransactions((prev) => [result.data, ...prev]);
          showSuccess("Transaksi berhasil ditambahkan");
        } else {
          showError(result.error || "Gagal menambahkan transaksi");
        }
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      showError("Gagal menyimpan transaksi");
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
    <div className="min-h-screen max-w-md mx-auto pb-24 safe-bottom">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded-lg focus:shadow-xl"
      >
        Langsung ke konten utama
      </a>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Connection Status (only in development or on error) */}
      <ConnectionStatus />

      {/* Header */}
      <header className="sticky top-0 z-[var(--z-index-sticky)] backdrop-blur-xl bg-[var(--color-bg-primary)]/80 border-b border-[var(--glass-border)] safe-top">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[var(--color-primary)] animate-pulse-glow" />
              <h1 className="text-xl font-bold text-gradient">FiNotes</h1>
            </div>
            <p className="lg:hidden text-sm text-[var(--color-text-muted)] mobile-hide">
              Kelola keuangan Anda dengan mudah
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 lg:py-10" role="main">
        <div className="space-y-6 lg:grid lg:grid-cols-1 lg:gap-8 lg:space-y-0">
          <aside className="space-y-4" aria-label="Informasi Saldo">
            {/* Balance Card */}
            <BalanceCard totalBalance={totalBalance} />
          </aside>

          {/* Month Cards */}
          <section className="space-y-4" aria-label="Daftar Transaksi Bulanan">
            {/* Loading State */}
            {isLoading ? (
              <div className="glass-card p-8 sm:p-10 text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  Memuat Data...
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  Mohon tunggu sebentar
                </p>
              </div>
            ) : groupedTransactions.length === 0 ? (
              <div className="glass-card p-8 sm:p-10 text-center animate-fade-in" role="article">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 animate-bounce">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  Mulai Catat Keuanganmu
                </h3>
                <p className="text-[var(--color-text-muted)] mb-5 max-w-sm mx-auto">
                  Tambahkan pemasukan dan pengeluaran pertamamu untuk mulai mengelola keuangan dengan lebih baik
                </p>
                <Button
                  variant="primary"
                  onClick={() => handleAddTransaction(currentMonthKey)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
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
          </section>
        </div>
      </main>

      {/* Floating Action Button */}
      {groupedTransactions.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[var(--z-index-fixed)] safe-bottom safe-right">
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleAddTransaction(currentMonthKey)}
            className="rounded-full shadow-2xl shadow-[var(--color-primary)]/40 hover-scale hover-glow w-14 h-14 sm:w-16 sm:h-16"
            aria-label="Tambah transaksi baru"
          >
            <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
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
