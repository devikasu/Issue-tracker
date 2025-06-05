import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleAuth = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (isSignUp) {
      // SIGNUP
      const { error } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        {
          // Redirect here after email confirmation
          emailRedirectTo: process.env.NEXT_PUBLIC_EMAIL_REDIRECT_URL || 'http://localhost:3000',
        }
      );

      setLoading(false);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          'Signup successful! Please check your email to confirm your account before logging in.'
        );
        setIsSignUp(false); // Switch to login mode
        setEmail('');
        setPassword('');
      }
    } else {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      setLoading(false);

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Create an Account' : 'Login to Your Account'}
        </h1>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="alert"
            aria-live="assertive"
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4"
          >
            {success}
          </div>
        )}

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full p-2 border border-gray-300 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-blue-500 underline font-medium"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccess('');
            }}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
