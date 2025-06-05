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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_EMAIL_REDIRECT_URL || 'http://localhost:3000',
        },
      });

      setLoading(false);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          'Signup successful! Please check your email to confirm your account before logging in.'
        );
        setIsSignUp(false); // switch to login form
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
        router.push('/dashboard'); // redirect on login success
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffcff1' }}>
      <div
        className="p-8 rounded shadow-md w-full max-w-md"
        style={{ backgroundColor: '#fff0f7', boxShadow: '0 4px 12px rgba(255, 204, 225, 0.5)' }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#a30054' }}>
          {isSignUp ? 'Create an Account' : 'Login to Your Account'}
        </h1>

        {error && (
          <div
            className="px-4 py-2 rounded mb-4"
            style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24' }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="px-4 py-2 rounded mb-4"
            style={{ backgroundColor: '#d4edda', border: '1px solid #c3e6cb', color: '#155724' }}
          >
            {success}
          </div>
        )}

        <label className="block mb-2 font-medium" style={{ color: '#660036' }}>
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-2 rounded mb-4"
          style={{
            border: '1px solid #d18bbf',
            backgroundColor: '#ffe6f2',
            color: '#660036',
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-medium" style={{ color: '#660036' }}>
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full p-2 rounded mb-6"
          style={{
            border: '1px solid #d18bbf',
            backgroundColor: '#ffe6f2',
            color: '#660036',
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full p-2 rounded text-white"
          onClick={handleAuth}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#f4b6d9' : '#a30054',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#7a003e';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#a30054';
          }}
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>

        <p className="mt-6 text-center text-sm" style={{ color: '#660036' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="underline font-medium"
            style={{ color: '#a30054', background: 'none', border: 'none', cursor: 'pointer' }}
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
