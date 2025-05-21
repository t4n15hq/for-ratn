import React, { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import FloralLoadingSpinner from './components/FloralLoadingSpinner'; // New import
import LeafAccentIcon from './components/LeafAccentIcon'; // New import

// Simple inline SVG for a subtle background pattern - Magnolia outline
const MagnoliaPattern: React.FC = () => (
  <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
    className="fixed inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none"
    style={{ filter: 'grayscale(100%)', zIndex: -1 }}
  >
    <defs>
      <pattern id="magnolia" patternUnits="userSpaceOnUse" width="150" height="150">
        <path d="M50 10 C 40 20, 30 25, 20 30 C 10 35, 5 45, 5 55 C 5 70, 20 85, 30 90 C 40 95, 50 90, 50 90 M50 10 C 60 20, 70 25, 80 30 C 90 35, 95 45, 95 55 C 95 70, 80 85, 70 90 C 60 95, 50 90, 50 90 M40 50 C 35 55, 30 65, 30 75 C 30 85, 40 90, 50 90 C 60 90, 70 85, 70 75 C 70 65, 65 55, 60 50 M50 20 C 45 25, 40 35, 40 45 C 40 55, 45 60, 50 60 C 55 60, 60 55, 60 45 C 60 35, 55 25, 50 20 Z" 
        fill="none" stroke="var(--color-primary-DEFAULT)" strokeWidth="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#magnolia)" />
  </svg>
);


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-page text-textBase p-4">
        <MagnoliaPattern />
        <FloralLoadingSpinner className="w-20 h-20 text-primary-DEFAULT mb-4" />
        <p className="mt-2 text-lg text-textMuted font-nunito animate-fadeInSoft">Loading your planner...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-page text-textBase p-4 selection:bg-primary-light selection:text-primary-textOnPrimary">
      <MagnoliaPattern />
      {!session?.user ? (
        <div className="w-full flex flex-col items-center justify-center flex-grow animate-fadeInSoft">
          <LoginPage />
        </div>
      ) : (
        <>
          <header className="w-full max-w-4xl mx-auto py-8 text-center animate-fadeInSoft">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold tracking-tight text-primary-DEFAULT animate-subtle-glow-yellow">
              ratn's notepad
            </h1>
            <p className="mt-3 text-lg text-textMuted font-nunito">
              Welcome back, {session.user.email?.split('@')[0] || 'Bloom Enthusiast'}! Your notes are waiting.
            </p>
          </header>
          <main className="w-full flex-grow max-w-4xl mx-auto animate-fadeInSoft" style={{animationDelay: '0.2s'}}>
            <DashboardPage user={session.user} onLogout={handleLogout} />
          </main>
          <footer className="w-full max-w-4xl mx-auto py-6 text-center text-textMuted/80 text-sm font-nunito animate-fadeInSoft" style={{animationDelay: '0.4s'}}>
            <p>  made for ratn w love. <LeafAccentIcon className="inline-block ml-1 w-3 h-3 animate-swaying-leaf" style={{ animationDuration: '3.5s' }} /></p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;