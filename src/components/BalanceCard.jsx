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
    <div 
      className="relative overflow-hidden rounded-3xl gradient-primary p-6 sm:p-7 shadow-2xl shadow-black/40 animate-fade-in"
      role="region"
      aria-label="Informasi Total Saldo"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 ease-out" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 transition-transform duration-1000 ease-out" aria-hidden="true" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-white/15 rounded-xl sm:rounded-2xl backdrop-blur-sm">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-white/90 font-medium text-sm sm:text-base">Total Saldo</span>
          </div>
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all focus-ring active:scale-95"
            aria-label={isHidden ? "Tampilkan saldo" : "Sembunyikan saldo"}
          >
            {isHidden ? (
              <EyeOff className="w-5 h-5 text-white/70" />
            ) : (
              <Eye className="w-5 h-5 text-white/70" />
            )}
          </button>
        </div>

        {/* Balance */}
        <div className="mb-2 sm:mb-3">
          <h1 
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums tracking-tight transition-all duration-300 ${
              isHidden ? 'blur-sm' : 'blur-0'
            }`}
            aria-live="polite"
          >
            {isHidden ? "••••••••" : formatCurrency(totalBalance)}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
          Total dari semua transaksi Anda
        </p>

        {/* Balance Status Indicator */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${totalBalance >= 0 ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-white/70 text-xs sm:text-sm">
              {totalBalance >= 0 ? 'Keuangan Sehat' : 'Perlu Perhatian'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
