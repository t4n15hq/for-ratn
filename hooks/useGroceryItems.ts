import { useState, useCallback, useEffect } from 'react';
import { GroceryItem, SupabaseUser } from '../types';
import { supabase } from '../lib/supabaseClient';

export const useGroceryItems = (user: SupabaseUser | null, listId: string | null) => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroceryItems = useCallback(async () => {
    if (!user || !listId) {
      setGroceryItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('grocery_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('list_id', listId)
        .order('created_at', { ascending: true }); // Often want older items first or by checked status

      if (fetchError) throw fetchError;
      setGroceryItems(data || []);
    } catch (e: any)   {
      console.error('Error fetching grocery items:', e.message);
      setError('Failed to fetch grocery items. ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [user, listId]);

  useEffect(() => {
    if (listId) {
      fetchGroceryItems();
    } else {
      setGroceryItems([]); // Clear items if no list is selected
    }
  }, [fetchGroceryItems, listId]);

  const addGroceryItem = async (content: string, quantity?: string) => {
    if (!user || !listId || content.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      const newItemPayload = {
        user_id: user.id,
        list_id: listId,
        content: content.trim(),
        quantity: quantity?.trim() || null,
        is_checked: false,
      };
      const { data, error: insertError } = await supabase
        .from('grocery_items')
        .insert(newItemPayload)
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) {
        setGroceryItems(prev => [...prev, data]);
      }
    } catch (e: any) {
      console.error('Error adding grocery item:', e.message);
      setError('Failed to add grocery item. ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroceryItem = async (id: string) => {
    if (!user) return;
    const itemToToggle = groceryItems.find(item => item.id === id);
    if (!itemToToggle) return;

    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('grocery_items')
        .update({ is_checked: !itemToToggle.is_checked })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setGroceryItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, is_checked: !item.is_checked } : item
        )
      );
    } catch (e: any) {
      console.error('Error toggling grocery item:', e.message);
      setError('Failed to update grocery item. ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroceryItem = async (id: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setGroceryItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (e: any) {
      console.error('Error deleting grocery item:', e.message);
      setError('Failed to delete grocery item. ' + e.message);
    } finally {
      setLoading(false);
    }
  };
  
  const editGroceryItem = async (id: string, newContent: string, newQuantity?: string) => {
    if (!user || newContent.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('grocery_items')
        .update({ content: newContent.trim(), quantity: newQuantity?.trim() || null })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      await fetchGroceryItems(); // Re-fetch to ensure data consistency
    } catch (e: any) {
      console.error('Error editing grocery item:', e.message);
      setError('Failed to edit grocery item. ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return { groceryItems, addGroceryItem, toggleGroceryItem, deleteGroceryItem, editGroceryItem, loadingGroceryItems: loading, groceryItemError: error, refreshGroceryItems: fetchGroceryItems };
};
