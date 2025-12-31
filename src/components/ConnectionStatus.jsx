import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * ConnectionStatus Component
 * Menampilkan status koneksi ke Supabase
 */
const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, connected, disconnected, error
  const [message, setMessage] = useState('Mengecek koneksi...');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { error } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .limit(1);

      if (error) {
        setStatus('error');
        setMessage(error.message);
      } else {
        setStatus('connected');
        setMessage('Terhubung ke database');
      }
    } catch (error) {
      setStatus('disconnected');
      setMessage('Gagal terhubung ke database');
    }
  };

  // Jangan tampilkan jika sudah connected (untuk production)
  if (status === 'connected' && import.meta.env.PROD) {
    return null;
  }

  const statusConfig = {
    checking: {
      icon: <Wifi className="w-4 h-4 animate-pulse" />,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-600',
    },
    connected: {
      icon: <Wifi className="w-4 h-4" />,
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-600',
    },
    disconnected: {
      icon: <WifiOff className="w-4 h-4" />,
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-600',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-600',
    },
  };

  const config = statusConfig[status];

  // Only show in development or if there's an error
  if (import.meta.env.PROD && status !== 'error' && status !== 'disconnected') {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-4 left-4 z-50
        flex items-center gap-2 px-3 py-2 rounded-lg
        border backdrop-blur-xl
        ${config.bg} ${config.border} ${config.text}
        text-xs font-medium
        transition-all duration-300
        animate-fade-in
      `}
      role="status"
      aria-live="polite"
    >
      {config.icon}
      <span>{message}</span>
      {(status === 'error' || status === 'disconnected') && (
        <button
          onClick={checkConnection}
          className="ml-2 px-2 py-0.5 rounded hover:bg-white/20 transition-colors"
          aria-label="Coba lagi"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;

