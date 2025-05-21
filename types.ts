import { User } from '@supabase/supabase-js';

export interface Task {
  id: string; // UUID from Supabase
  user_id?: string; // Foreign key to auth.users
  content: string;
  is_done: boolean;
  created_at: string; // ISO 8601 string from Supabase
  dueDate?: string | null; // YYYY-MM-DD format or null
}

// Optional: If you want to pass the full Supabase user object around
export type SupabaseUser = User;

// New Types for Grocery List Feature
export interface GroceryList {
  id: string; // UUID from Supabase
  user_id: string;
  name: string;
  created_at: string; // ISO 8601 string
}

export interface GroceryItem {
  id: string; // UUID from Supabase
  list_id: string; // Foreign key to grocery_lists
  user_id: string;
  content: string;
  quantity?: string | null;
  is_checked: boolean;
  created_at: string; // ISO 8601 string
}
