import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome back</h2>
      <p className="text-slate-500 mb-8">Please sign in to access your account</p>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="doctor@example.com"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <label htmlFor="password" className="form-label">Password</label>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">Forgot password?</a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            placeholder="••••••••"
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-slate-300 text-blue-500 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            <span className="ml-2 text-sm text-slate-600">Remember me</span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : 'Sign in'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>For demo purposes, you can sign in with any email and password</p>
      </div>
    </>
  );
};

export default Login;