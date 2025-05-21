import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
  </svg>
);

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
  </svg>
);

const FloralLoginIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12 6c-1.09 0-2.1.25-2.97.68-.32.16-.53.5-.45.86.08.36.42.58.78.52.7-.29 1.47-.46 2.24-.46s1.54.17 2.24.46c.36.06.7-.16.78-.52.08-.36-.13-.7-.45-.86C14.1 6.25 13.09 6 12 6zm0 10c-1.09 0-2.1-.25-2.97-.68-.32.16-.53.5-.45.86.08.36.42.58.78-.52.7-.29 1.47-.46 2.24-.46s1.54.17 2.24.46c.36.06.7-.16.78-.52.08-.36-.13-.7-.45-.86C14.1 15.75 13.09 16 12 16zm4.24-7.76c-.16-.32-.5-.53-.86-.45-.36.08-.58.42-.52.78.29.7.46 1.47.46 2.24s-.17 1.54-.46 2.24c-.06.36.16.7.52.78.36.08.7-.13.86-.45.35-.8.56-1.7.56-2.57s-.21-1.77-.56-2.57zM7.76 8.24c.16-.32.5-.53.86-.45.36.08.58.42.52.78-.29.7-.46 1.47-.46 2.24s.17 1.54.46 2.24c.06.36-.16.7-.52.78-.36.08-.7-.13-.86-.45C6.96 13.07 6.75 12.1 6.75 11.2s.21-1.77.56-2.57z"/>
  </svg>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({ email, password });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      if (response.error) {
        setError(response.error.message);
      } else if (isSignUp && response.data.user && response.data.session === null) {
        setError("Signed up! Please check your email to confirm your account.");
      }
    } catch (catchError: any) {
      setError(catchError.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-card-DEFAULT rounded-xl shadow-xl border border-primary-light/50">
      <div className="text-center">
        <FloralLoginIcon className="w-16 h-16 text-primary-DEFAULT mx-auto mb-4 animate-floral-pulse" style={{animationDuration: '2.5s'}} />
        <h1 className="text-3xl font-playfair font-bold text-textBase mb-2 lowercase tracking-tight">
          {isSignUp ? 'for ratn.' : 'for ratn.'}
        </h1>
        <p className="text-textMuted font-nunito italic">
          {isSignUp
            ? 'Pick up where you left off.'
            : 'Set things up, stay on track.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-textMuted mb-1 font-nunito">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-textMuted/70" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@email.com"
              disabled={loading}
              className="w-full pl-10 p-3 border border-card-border rounded-lg shadow-sm focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT bg-card-input text-textInput placeholder-textPlaceholder font-nunito transition duration-150 ease-in-out"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-textMuted mb-1 font-nunito">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-textMuted/70" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="your secret key"
              disabled={loading}
              className="w-full pl-10 p-3 border border-card-border rounded-lg shadow-sm focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT bg-card-input text-textInput placeholder-textPlaceholder font-nunito transition duration-150 ease-in-out"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-error-text bg-error-DEFAULT p-3 rounded-md border border-error-border font-nunito animate-fadeInSoft">{error}</p>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-primary-textOnPrimary bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-DEFAULT focus:ring-primary-light font-nunito transition duration-150 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed hover:animate-gentle-bloom"
          >
            {loading ? (isSignUp ? 'creating your space...' : 'signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-textMuted font-nunito">
        {isSignUp ? 'ratz you already made an account! ' : 'are you ratn?'}{' '}
        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
          className="font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors hover:animate-gentle-bloom"
          disabled={loading}
        >
          {isSignUp ? 'sign in' : 'click here to sign up'}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;