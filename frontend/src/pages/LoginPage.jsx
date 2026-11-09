import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Mail, Lock, LogIn, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      const userRole = res.data?.user?.role || res.data?.role;

      // Smart redirect based on role if default redirect is '/'
      if (redirectPath === '/') {
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
          return;
        } else if (userRole === 'operator') {
          navigate('/operator/trips');
          return;
        }
      }
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Bus className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-gray-900">BusMitra</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Or{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            create a new account today
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100 space-y-6">
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-2"
                />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick Demo Credentials</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoCredentials('customer@example.com', 'customer123')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-indigo-400 bg-gray-50/70 hover:bg-indigo-50 text-left transition-colors"
              >
                <p className="font-bold text-gray-900">Customer</p>
                <p className="text-[10px] text-gray-500">customer@example.com</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('operator@example.com', 'operator123')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-indigo-400 bg-gray-50/70 hover:bg-indigo-50 text-left transition-colors"
              >
                <p className="font-bold text-gray-900">Operator</p>
                <p className="text-[10px] text-gray-500">operator@example.com</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@example.com', 'admin123')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-indigo-400 bg-gray-50/70 hover:bg-indigo-50 text-left transition-colors"
              >
                <p className="font-bold text-gray-900">Admin</p>
                <p className="text-[10px] text-gray-500">admin@example.com</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
