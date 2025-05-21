import { useState, useCallback, useEffect } from 'react';
import { Task, SupabaseUser } from '../types';
import { supabase } from '../lib/supabaseClient';

export const useTasks = (user: SupabaseUser | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Ensure dueDate is null if it's an empty string or undefined from DB
      const formattedTasks = data?.map(task => ({
        ...task,
        dueDate: task.due_date || null, // Supabase column name is due_date
      })) || [];
      setTasks(formattedTasks as Task[]);

    } catch (e: any) {
      console.error('Error fetching tasks:', e.message);
      setError('Failed to fetch tasks. ' + e.message);
      setTasks([]); // Clear tasks on error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (content: string, dueDate?: string) => {
    if (!user || content.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      const newTaskPayload = {
        user_id: user.id,
        content: content.trim(),
        is_done: false,
        due_date: dueDate || null, // Use null for Supabase if undefined
        // created_at is set by Supabase
      };
      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert(newTaskPayload)
        .select()
        .single(); // Assuming you want the inserted task back

      if (insertError) throw insertError;
      if (data) {
         // Add to local state or re-fetch. Re-fetching for simplicity here.
        await fetchTasks();
      }
    } catch (e: any) {
      console.error('Error adding task:', e.message);
      setError('Failed to add task. ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [user, fetchTasks]);

  const toggleTask = useCallback(async (id: string) => {
    if (!user) return;
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ is_done: !taskToToggle.is_done })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      // Update local state optimistically or re-fetch
       setTasks(prevTasks =>
         prevTasks.map(task =>
           task.id === id ? { ...task, is_done: !task.is_done } : task
         )
       );
    } catch (e: any) {
      console.error('Error toggling task:', e.message);
      setError('Failed to update task. ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [user, tasks]);

  const deleteTask = useCallback(async (id: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      // Remove from local state or re-fetch
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (e: any) {
      console.error('Error deleting task:', e.message);
      setError('Failed to delete task. ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const editTask = useCallback(async (id: string, newContent: string, newDueDate?: string) => {
    if (!user || newContent.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ content: newContent.trim(), due_date: newDueDate || null })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      // Update local state or re-fetch
      await fetchTasks(); // Re-fetch to ensure data consistency and sorting
    } catch (e: any) {
      console.error('Error editing task:', e.message);
      setError('Failed to edit task. ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [user, fetchTasks]);

  return { tasks, addTask, toggleTask, deleteTask, editTask, loadingTasks: loading, taskError: error, refreshTasks: fetchTasks };
};