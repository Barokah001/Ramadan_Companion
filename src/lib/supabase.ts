// src/lib/supabase.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple storage wrapper that works like window.storage
export const storage = {
  async get(key: string): Promise<{ key: string; value: string } | null> {
    try {
      const { data, error } = await supabase
        .from("storage")
        .select("value")
        .eq("key", key)
        .single();

      if (error || !data) return null;
      return { key, value: data.value };
    } catch {
      return null;
    }
  },

  async set(
    key: string,
    value: string,
  ): Promise<{ key: string; value: string } | null> {
    try {
      const { data, error } = await supabase
        .from("storage")
        .upsert({ key, value })
        .select()
        .single();

      if (error) return null;
      return { key, value: data.value };
    } catch {
      return null;
    }
  },

  async delete(key: string): Promise<{ key: string; deleted: boolean } | null> {
    try {
      const { error } = await supabase.from("storage").delete().eq("key", key);

      return { key, deleted: !error };
    } catch {
      return null;
    }
  },

  async list(prefix?: string): Promise<{ keys: string[] } | null> {
    try {
      let query = supabase.from("storage").select("key");

      if (prefix) {
        query = query.like("key", `${prefix}%`);
      }

      const { data, error } = await query;
      if (error || !data) return null;

      return { keys: data.map((item) => item.key) };
    } catch {
      return null;
    }
  },
};

/*
SQL to run in Supabase SQL Editor:

-- Create storage table
CREATE TABLE IF NOT EXISTS storage (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE storage ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (for testing)
CREATE POLICY "Allow all operations" ON storage FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_storage_updated_at
  BEFORE UPDATE ON storage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
*/
