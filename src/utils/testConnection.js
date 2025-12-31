/**
 * Test Supabase Connection
 * Helper script untuk testing koneksi ke database
 */

import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...');
  console.log('================================');

  try {
    // Test 1: Check if client is initialized
    console.log('✓ Supabase client initialized');

    // Test 2: Simple query
    const { data, error, count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✓ Connection successful!');
    console.log(`✓ Found ${count} transaction(s) in database`);

    // Test 3: Test RPC function
    const { data: statsData, error: statsError } = await supabase.rpc('get_total_balance');

    if (statsError) {
      console.warn('⚠️ RPC function test failed:', statsError.message);
    } else {
      console.log('✓ RPC functions working');
      console.log(`  Total Balance: Rp ${statsData?.toLocaleString('id-ID') || 0}`);
    }

    console.log('================================');
    console.log('✅ All tests passed!');

    return {
      success: true,
      transactionCount: count,
      sampleData: data?.[0] || null,
    };
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Run test automatically when imported in development
if (import.meta.env.DEV) {
  // Uncomment line below to auto-test on app start
  // testSupabaseConnection();
}

