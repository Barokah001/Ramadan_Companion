// src/lib/supabase.ts - Fixed Supabase Integration

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're not using auth
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Prefer': 'return=representation',
    },
  },
});

// Storage API implementation using Supabase
export const storage = {
  async get(key: string) {
    const value = localStorage.getItem(key);
    return value ? { key, value } : null;
  },

  async set(key: string, value: string) {
    localStorage.setItem(key, value);
    return { key, value };
  },

  async delete(key: string) {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },

  async list(prefix?: string) {
    const keys = Object.keys(localStorage).filter((k) =>
      prefix ? k.startsWith(prefix) : true,
    );
    return { keys };
  },

  async clear() {
    localStorage.clear();
    return true;
  },
};
