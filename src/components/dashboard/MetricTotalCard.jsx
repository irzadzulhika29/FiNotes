import React, { useState, useEffect } from "react";
import { Wallet, Pencil, Clock, Loader2, Check, X } from "lucide-react";
import {
  getBalance,
  upsertBalance,
  formatCurrency,
} from "../../lib/financeService";

const MetricTotalCard = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const { data: balanceData, error: balanceError } = await getBalance();
    if (!balanceError && balanceData) {
      setBalance(balanceData);
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setEditValue(balance?.amount?.toString() || "0");
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const amount = parseFloat(editValue.replace(/[^\d.-]/g, "")) || 0;
    const { data: saveData, error: saveError } = await upsertBalance(amount);
    if (!saveError && saveData) {
      setBalance(saveData);
    }
    setEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditValue("");
  };

  const formatUpdatedAt = (timestamp) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-paper-light dark:bg-paper-dark border border-border-light dark:border-border-dark shadow-sm group">
      {/* Background Decoration */}
      <div
        className="absolute right-0 top-0 h-full w-1/3 opacity-10 dark:opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsU51GIYn2CvAmcDN3MjLL6FxsOcAtCQLyfYEBRjVQmFprFr4K7Qf95iO21k4_vGNlryNuTUZU1TDu559yhXqRjyu0rO_m19bv2yoIHjblv6k0UCeja_U6w2O0MgwAspXn0USIwaqsSZjDU8OXtQd0DIeWmu9Ort6dx2KGuDF8GutgdurIv11Mli3rltBW1XZ0_4ONLSALZ2p6iVcKJL94d2HtT7pBXGLjGcQaqsqeb3xV_LCazXXFGY3zZiuiRPjLC_EMueVRzOSb')`,
          maskImage: "linear-gradient(to left, black, transparent)",
          WebkitMaskImage: "linear-gradient(to left, black, transparent)",
        }}
      ></div>

      {/* Illustration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 size-32 hidden sm:block opacity-80 pointer-events-none">
        <svg
          className="w-full h-full text-primary/40 stroke-current stroke-1"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            strokeWidth="0.5"
          ></path>
          <path
            d="M8 14C8 14 9.5 12 12 12C14.5 12 16 14 16 14"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M12 12V6"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M12 6L10 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M12 6L14 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>

      <div className="relative p-8 flex flex-col gap-2 z-10">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Wallet className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wider">
            Total Uang Dimiliki
          </span>
          {!editing && !loading && (
            <button
              onClick={handleEdit}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded ml-2"
            >
              <Pencil className="size-3 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex items-baseline gap-3 mt-1">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-6 animate-spin text-gray-400" />
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : editing ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-500">Rp</span>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight bg-transparent border-b-2 border-primary focus:outline-none w-64"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
              </button>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              {formatCurrency(balance?.amount || 0)}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Clock className="size-3" />
          Last updated: {formatUpdatedAt(balance?.updated_at)}
        </p>
      </div>
    </div>
  );
};

export default MetricTotalCard;
