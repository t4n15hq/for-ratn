import { createClient } from '@supabase/supabase-js';

// These should ideally be environment variables, but using provided values directly.
const supabaseUrl = 'https://jwkaviugpafzkjnhjhep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a2F2aXVncGFmemtqbmhqaGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDcwNDMsImV4cCI6MjA2MzQyMzA0M30.xmrFrDUNqjL389xABx8A8SXwCphJrTwu5z2jEbJcPrI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);