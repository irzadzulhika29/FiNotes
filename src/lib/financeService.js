import { supabase } from '../lib/supabase';

// ============ BALANCE SERVICES ============

export const getBalance = async () => {
  const { data, error } = await supabase
    .from('balances')
    .select('*')
    .single();

  return { data, error };
};

export const upsertBalance = async (amount, note = null) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Not authenticated' } };

  // Check if balance exists
  const { data: existing } = await supabase
    .from('balances')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('balances')
      .update({ amount, note })
      .eq('id', existing.id)
      .select()
      .single();
    return { data, error };
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('balances')
      .insert({ user_id: user.id, amount, note })
      .select()
      .single();
    return { data, error };
  }
};

// ============ TRANSACTION SERVICES ============

export const getTransactions = async (month = null, limit = 50) => {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      category:categories(id, name, icon)
    `)
    .order('date', { ascending: false })
    .limit(limit);

  if (month) {
    query = query.eq('month', month);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getTransactionsByMonth = async (month) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      category:categories(id, name, icon)
    `)
    .eq('month', month)
    .order('date', { ascending: false });

  return { data, error };
};

export const getMonthlySummary = async (month) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('month', month);

  if (error) return { data: null, error };

  const summary = {
    income: 0,
    expense: 0,
    net: 0,
  };

  data?.forEach((tx) => {
    if (tx.type === 'income') {
      summary.income += parseFloat(tx.amount);
    } else {
      summary.expense += parseFloat(tx.amount);
    }
  });

  summary.net = summary.income - summary.expense;

  return { data: summary, error: null };
};

export const createTransaction = async (transaction) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: user.id,
    })
    .select(`
      *,
      category:categories(id, name, icon)
    `)
    .single();

  return { data, error };
};

export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      category:categories(id, name, icon)
    `)
    .single();

  return { data, error };
};

export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  return { error };
};

// ============ CATEGORY SERVICES ============

export const getCategories = async (type = null) => {
  let query = supabase
    .from('categories')
    .select('*')
    .order('name');

  if (type && type !== 'both') {
    query = query.or(`type.eq.${type},type.eq.both`);
  }

  const { data, error } = await query;
  return { data, error };
};

export const createCategory = async (category) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('categories')
    .insert({
      ...category,
      user_id: user.id,
    })
    .select()
    .single();

  return { data, error };
};

export const updateCategory = async (id, updates) => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  return { error };
};

// ============ UTILITY ============

export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const formatCurrency = (amount, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
};
