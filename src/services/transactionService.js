import { supabase, handleSupabaseError } from '../lib/supabase';

/**
 * Transaction Service
 * Service layer untuk semua operasi database transactions
 */

// ============================================
// CREATE - Tambah Transaksi Baru
// ============================================
export const createTransaction = async (transactionData) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          type: transactionData.type,
          amount: parseFloat(transactionData.amount),
          description: transactionData.description,
          category: transactionData.category,
          date: transactionData.date,
        },
      ])
      .select()
      .single();

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// READ - Ambil Semua Transaksi
// ============================================
export const getAllTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// READ - Ambil Transaksi Per Bulan
// ============================================
export const getTransactionsByMonth = async (year, month) => {
  try {
    // Format: YYYY-MM
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// READ - Ambil Satu Transaksi by ID
// ============================================
export const getTransactionById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// UPDATE - Update Transaksi
// ============================================
export const updateTransaction = async (id, transactionData) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        type: transactionData.type,
        amount: parseFloat(transactionData.amount),
        description: transactionData.description,
        category: transactionData.category,
        date: transactionData.date,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// DELETE - Hapus Transaksi
// ============================================
export const deleteTransaction = async (id) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) return handleSupabaseError(error);

    return {
      success: true,
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// STATISTICS - Ambil Statistik
// ============================================
export const getStatistics = async () => {
  try {
    const { data, error } = await supabase.rpc('get_statistics');

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// MONTHLY SUMMARY - Ambil Ringkasan Bulanan
// ============================================
export const getMonthlySummary = async () => {
  try {
    const { data, error } = await supabase
      .from('monthly_summary')
      .select('*')
      .order('month', { ascending: false });

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// CATEGORY SUMMARY - Ambil Ringkasan Kategori
// ============================================
export const getCategorySummary = async () => {
  try {
    const { data, error } = await supabase
      .from('category_summary')
      .select('*')
      .order('total_amount', { ascending: false });

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// TOTAL BALANCE - Ambil Total Saldo
// ============================================
export const getTotalBalance = async () => {
  try {
    const { data, error } = await supabase.rpc('get_total_balance');

    if (error) return handleSupabaseError(error);

    return {
      success: true,
      data: parseFloat(data) || 0,
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// ============================================
// REALTIME SUBSCRIPTION - Subscribe ke perubahan
// ============================================
export const subscribeToTransactions = (callback) => {
  const channel = supabase
    .channel('transactions-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

