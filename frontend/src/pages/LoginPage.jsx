import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, Key, ShieldCheck } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import Logo from '../components/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const performLogin = async (loginEmail, loginPass) => {
    setLoading(true);
    setError('');
    try {
      const res = await login(loginEmail, loginPass);
      const userRole = res.data?.user?.role || res.data?.role;
      if (redirectPath === '/') {
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
          return;
        }
        if (userRole === 'operator') {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    await performLogin(email, password);
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    await performLogin(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brand-gray">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
          <Logo className="h-12 w-auto mx-auto" />
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900">
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Or{' '}
          <Link to="/register" className="font-bold text-brand-dark hover:underline">
            create a new account today
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100 bg-white space-y-6">
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Address */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase mb-1 text-gray-700 tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all border border-gray-300 bg-gray-50/70 text-gray-900 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-bold uppercase mb-1 text-gray-700 tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl text-sm font-medium outline-none transition-all border border-gray-300 bg-gray-50/70 text-gray-900 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-1 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center cursor-pointer text-gray-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded mr-2 accent-[#6DCE05]"
                />
                Remember me
              </label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-bold text-brand-dark hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold rounded-xl shadow-lg shadow-brand-accent/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-60 active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                <Key className="w-3.5 h-3.5 text-brand-dark" />
                <span>Quick Demo Accounts</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Click to 1-click log in</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: 'Customer', email: 'customer@demo.com', pass: 'Demo@123', desc: 'Passenger' },
                { label: 'Operator', email: 'operator@demo.com', pass: 'Demo@123', desc: 'Fleet Partner' },
                { label: 'Admin', email: 'admin@demo.com', pass: 'Demo@123', desc: 'Super Admin' },
              ].map(({ label, email: e, pass, desc }) => (
                <button
                  key={label}
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickDemo(e, pass)}
                  className="p-2.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-brand-accent/20 hover:border-brand-accent text-left transition-all group disabled:opacity-50 active:scale-[0.98]"
                  title={`1-Click log in as ${label} (${e})`}
                >
                  <p className="font-bold text-gray-900 group-hover:text-brand-dark flex items-center justify-between">
                    <span>{label}</span>
                    <span className="text-[9px] text-brand-dark font-extrabold uppercase bg-brand-accent/30 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Go →</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-1 text-center">
            <p className="text-[11px] text-gray-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-dark" />
              <span>Protected by 256-bit SSL encryption</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
