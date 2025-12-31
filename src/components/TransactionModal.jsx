import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

const categories = {
  income: [
    { value: "salary", label: "Gaji" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investasi" },
    { value: "gift", label: "Hadiah" },
    { value: "other_income", label: "Lainnya" },
  ],
  expense: [
    { value: "food", label: "Makanan" },
    { value: "transport", label: "Transportasi" },
    { value: "shopping", label: "Belanja" },
    { value: "bills", label: "Tagihan" },
    { value: "other_expense", label: "Lainnya" },
  ],
};

const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
  defaultMonth,
}) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        description: editingTransaction.description,
        category: editingTransaction.category,
        date: editingTransaction.date,
      });
    } else {
      // Set default date based on selected month
      if (defaultMonth) {
        const [year, month] = defaultMonth.split("-");
        setFormData((prev) => ({
          ...prev,
          type: "expense",
          amount: "",
          description: "",
          category: "food",
          date: `${year}-${month}-01`,
        }));
      } else {
        setFormData({
          type: "expense",
          amount: "",
          description: "",
          category: "food",
          date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [editingTransaction, defaultMonth, isOpen]);

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: type === "income" ? "salary" : "food",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      id: editingTransaction?.id || crypto.randomUUID(),
      createdAt: editingTransaction?.createdAt || new Date().toISOString(),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-xl bg-[var(--color-bg-secondary)] rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 animate-slide-up shadow-2xl shadow-black/40 border border-[var(--glass-border)]/80">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-[var(--color-bg-elevated)]/50 border border-[var(--glass-border)] rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                formData.type === "income"
                  ? "gradient-income text-white shadow-lg shadow-green-500/20"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                formData.type === "expense"
                  ? "gradient-expense text-white shadow-lg shadow-red-500/20"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Amount */}
          <Input
            label="Jumlah"
            type="number"
            prefix="Rp"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            placeholder="0"
            className="text-2xl font-semibold tracking-tight"
            required
          />

          {/* Description */}
          <Input
            label="Deskripsi"
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Contoh: Gaji bulan Desember"
            required
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Kategori
            </label>
            <div className="flex flex-wrap gap-2">
              {categories[formData.type].map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: cat.value }))
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    formData.category === cat.value
                      ? formData.type === "income"
                        ? "gradient-income text-white border-transparent shadow-lg shadow-green-500/20"
                        : "gradient-expense text-white border-transparent shadow-lg shadow-red-500/20"
                      : "bg-[var(--color-bg-elevated)]/50 border-[var(--glass-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <Input
            label="Tanggal"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant={formData.type === "income" ? "income" : "expense"}
            size="lg"
            className="w-full"
          >
            {editingTransaction ? "Simpan Perubahan" : "Tambah Transaksi"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
