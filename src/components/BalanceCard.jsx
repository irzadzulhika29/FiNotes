import React, { useState } from "react";
import { Eye, EyeOff, Wallet } from "lucide-react";

const BalanceCard = ({ totalBalance }) => {
  const [isHidden, setIsHidden] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 animate-pulse-glow">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/90 font-medium">Total Saldo</span>
          </div>
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isHidden ? "Show balance" : "Hide balance"}
          >
            {isHidden ? (
              <EyeOff className="w-5 h-5 text-white/70" />
            ) : (
              <Eye className="w-5 h-5 text-white/70" />
            )}
          </button>
        </div>

        {/* Balance */}
        <div className="mb-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white tabular-nums tracking-tight">
            {isHidden ? "••••••••" : formatCurrency(totalBalance)}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white/60 text-sm">Total dari semua transaksi Anda</p>
      </div>
    </div>
  );
};

export default BalanceCard;
