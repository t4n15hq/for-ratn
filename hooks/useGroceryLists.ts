
import { useState, useCallback, useEffect } from 'react';
import { GroceryList, SupabaseUser } from '../types';
import { supabase } from '../lib/supabaseClient';

export const useGroceryLists = (user: SupabaseUser | null) => {
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroceryLists = useCallback(async () => {
    if (!user) {
      setGroceryLists([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('grocery_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setGroceryLists(data || []);
    } catch (e: any) {
      console.error('Error fetching grocery lists:', e.message);
      setError('Failed to fetch grocery lists. ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGroceryLists();
  }, [fetchGroceryLists]);

  const addGroceryList = async (name: string) => {
    if (!user || name.trim() === '') return null;
    setLoading(true);
    setError(null);
    try {
      const newListPayload = {
        user_id: user.id,
        name: name.trim(),
      };
      const { data, error: insertError } = await supabase
        .from('grocery_lists')
        .insert(newListPayload)
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) {
        setGroceryLists(prev => [data, ...prev]);
        return data;
      }
      return null;
    } catch (e: any) {
      console.error('Error adding grocery list:', e.message);
      setError('Failed to add grocery list. ' + e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroceryList = async (id: string) => {
    if (!user) return;
    setLoading(true); 
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('grocery_lists')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }
      // This log helps confirm the Supabase call didn't immediately error out.
      console.log(`Supabase delete call for grocery list ID: ${id} completed without an immediate error object. Filtering local state.`);
      setGroceryLists(prev => prev.filter(list => list.id !== id));
    } catch (e: any) {
      console.error('Error during deleteGroceryList operation:', e.message);
      setError('Failed to delete grocery list. Please check console for Supabase errors. Message: ' + e.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Add editGroceryList if needed later

  return { groceryLists, addGroceryList, deleteGroceryList, loadingGroceryLists: loading, groceryListError: error, refreshGroceryLists: fetchGroceryLists };
};
