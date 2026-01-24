// src/lib/supabase.ts - Proper Supabase Integration

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage API implementation using Supabase
export const storage = {
  async get(key: string): Promise<{ key: string; value: string } | null> {
    try {
      const { data, error } = await supabase
        .from('storage')
        .select('key, value')
        .eq('key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - key doesn't exist
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set(key: string, value: string): Promise<{ key: string; value: string } | null> {
    try {
      const { data, error } = await supabase
        .from('storage')
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Storage set error:', error);
      return null;
    }
  },

  async delete(key: string): Promise<{ key: string; deleted: boolean } | null> {
    try {
      const { error } = await supabase
        .from('storage')
        .delete()
        .eq('key', key);

      if (error) throw error;

      return { key, deleted: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      return null;
    }
  },

  async list(prefix?: string): Promise<{ keys: string[] } | null> {
    try {
      let query = supabase.from('storage').select('key');

      if (prefix) {
        query = query.ilike('key', `${prefix}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const keys = data?.map(item => item.key) || [];
      return { keys };
    } catch (error) {
      console.error('Storage list error:', error);
      return null;
    }
  },

  // Batch operations for better performance
  async getMany(keys: string[]): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('storage')
        .select('key, value')
        .in('key', keys);

      if (error) throw error;

      const result: Record<string, string> = {};
      data?.forEach(item => {
        result[item.key] = item.value;
      });

      return result;
    } catch (error) {
      console.error('Storage getMany error:', error);
      return {};
    }
  },

  async setMany(items: Record<string, string>): Promise<boolean> {
    try {
      const records = Object.entries(items).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('storage')
        .upsert(records, { onConflict: 'key' });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Storage setMany error:', error);
      return false;
    }
  },

  // Clear all data (useful for testing)
  async clear(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('storage')
        .delete()
        .neq('key', ''); // Delete all rows

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
};