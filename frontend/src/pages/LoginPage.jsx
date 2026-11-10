import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Mail, Lock, LogIn, Key } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const G = {
  forest:    '#1a3a16',
  forestMid: '#1e5219',
  accent:    '#7db575',
  beige50:   '#faf7f0',
  beige100:  '#f5f0e8',
  beige200:  '#ede4d0',
  beigeDark: '#a08c5b',
};

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
    if (!email || !password) { setError('Please fill in both email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      const userRole = res.data?.user?.role || res.data?.role;
      if (redirectPath === '/') {
        if (userRole === 'admin') { navigate('/admin/dashboard'); return; }
        if (userRole === 'operator') { navigate('/operator/trips'); return; }
      }
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e, p) => { setEmail(e); setPassword(p); setError(''); };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ background: G.beige100 }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2" style={{ textDecoration: 'none' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: G.forestMid, color: G.beige50 }}>
            <Bus className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black" style={{ color: G.forest }}>Bus<span style={{ color: G.accent }}>Mitra</span></span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight" style={{ color: G.forest }}>Sign In to Your Account</h2>
        <p className="mt-1 text-sm" style={{ color: G.beigeDark }}>
          Or{' '}
          <Link to="/register" className="font-semibold" style={{ color: G.forestMid, textDecoration: 'none' }}>create a new account today</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="py-8 px-6 sm:px-10 shadow-xl rounded-3xl border space-y-6" style={{ background: '#fff', borderColor: G.beige200 }}>
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase mb-1" style={{ color: G.forest }}>Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3" style={{ color: G.beigeDark }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all border"
                  style={{ background: G.beige50, borderColor: G.beige200, color: G.forest }}
                  onFocus={(e) => { e.target.style.borderColor = G.forestMid; e.target.style.boxShadow = '0 0 0 3px rgba(30,82,25,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = G.beige200; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase mb-1" style={{ color: G.forest }}>Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3" style={{ color: G.beigeDark }} />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all border"
                  style={{ background: G.beige50, borderColor: G.beige200, color: G.forest }}
                  onFocus={(e) => { e.target.style.borderColor = G.forestMid; e.target.style.boxShadow = '0 0 0 3px rgba(30,82,25,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = G.beige200; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center cursor-pointer" style={{ color: '#5a4d2e' }}>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded mr-2" style={{ accentColor: G.forestMid }} />
                Remember me
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold" style={{ color: G.forestMid, textDecoration: 'none' }}>Forgot password?</a>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-60"
              style={{ background: G.forestMid, color: G.beige50, boxShadow: '0 4px 15px rgba(30,82,25,0.35)' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = G.forest; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = G.forestMid; }}
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="border-t pt-5 space-y-3" style={{ borderColor: G.beige200 }}>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: '#5a4d2e' }}>
              <Key className="w-3.5 h-3.5" style={{ color: G.forestMid }} />
              <span>Quick Demo Credentials</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: 'Customer', email: 'customer@example.com', pass: 'customer123' },
                { label: 'Operator', email: 'operator@example.com', pass: 'operator123' },
                { label: 'Admin', email: 'admin@example.com', pass: 'admin123' },
              ].map(({ label, email: e, pass }) => (
                <button
                  key={label} type="button" onClick={() => fillDemo(e, pass)}
                  className="p-2.5 rounded-xl border text-left transition-all"
                  style={{ background: G.beige50, borderColor: G.beige200 }}
                  onMouseEnter={(el) => { el.currentTarget.style.borderColor = G.accent; el.currentTarget.style.background = '#f0f5ef'; }}
                  onMouseLeave={(el) => { el.currentTarget.style.borderColor = G.beige200; el.currentTarget.style.background = G.beige50; }}
                >
                  <p className="font-bold" style={{ color: G.forest }}>{label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: G.beigeDark }}>{e}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
