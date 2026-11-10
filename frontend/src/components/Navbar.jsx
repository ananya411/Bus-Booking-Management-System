import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, LogOut, Ticket, Shield, LayoutDashboard, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const G = {
  bg: '#1a3a16',
  bgDark: '#0f2a0c',
  accent: '#7db575',
  beige: '#faf7f0',
  beige2: '#f5f0e8',
  text: '#d6e8d3',
  textMuted: '#7db575',
  border: 'rgba(125,181,117,0.25)',
};

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isOperator } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const navLinkStyle = (path) => ({
    fontSize: '0.875rem',
    fontWeight: location.pathname === path || location.pathname.startsWith(path + '/') ? 700 : 500,
    color: location.pathname === path || location.pathname.startsWith(path + '/') ? G.beige : G.text,
    borderBottom: location.pathname === path || location.pathname.startsWith(path + '/') ? `2px solid ${G.accent}` : '2px solid transparent',
    paddingBottom: '2px',
    transition: 'all 0.15s',
    textDecoration: 'none',
  });

  return (
    <header style={{ background: G.bg, borderBottom: `1px solid ${G.border}`, position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group" style={{ textDecoration: 'none' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all"
              style={{ background: G.accent, color: G.bgDark }}
            >
              <Bus className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight" style={{ color: G.beige }}>
              Bus<span style={{ color: G.accent }}>Mitra</span>
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" style={navLinkStyle('/')} onMouseEnter={(e) => { e.currentTarget.style.color = G.beige; }} onMouseLeave={(e) => { e.currentTarget.style.color = location.pathname === '/' ? G.beige : G.text; }}>Home</Link>
            <Link to="/search" style={navLinkStyle('/search')} onMouseEnter={(e) => { e.currentTarget.style.color = G.beige; }} onMouseLeave={(e) => { e.currentTarget.style.color = location.pathname.startsWith('/search') ? G.beige : G.text; }}>Find Buses</Link>
            {isAuthenticated && (
              <Link to="/my-bookings" style={navLinkStyle('/my-bookings')} onMouseEnter={(e) => { e.currentTarget.style.color = G.beige; }} onMouseLeave={(e) => { e.currentTarget.style.color = location.pathname === '/my-bookings' ? G.beige : G.text; }}>My Bookings</Link>
            )}
            {isAdmin && (
              <Link to="/admin/dashboard" className="flex items-center space-x-1" style={{ color: G.accent, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                <Shield className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}
            {isOperator && (
              <Link to="/operator/trips" className="flex items-center space-x-1" style={{ color: G.accent, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Operator Trips</span>
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium px-3 py-2 rounded-xl border transition-all"
                  style={{ background: 'rgba(125,181,117,0.12)', borderColor: G.border, color: G.beige }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase" style={{ background: G.accent, color: G.bgDark }}>
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name || user?.email}</span>
                  <ChevronDown className="w-4 h-4" style={{ color: G.textMuted }} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-1 border z-50" style={{ background: G.bgDark, borderColor: G.border }}>
                    <div className="px-4 py-2.5 border-b" style={{ borderColor: G.border }}>
                      <p className="text-sm font-semibold truncate" style={{ color: G.beige }}>{user?.name || 'User'}</p>
                      <p className="text-xs truncate" style={{ color: G.textMuted }}>{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded" style={{ background: 'rgba(125,181,117,0.2)', color: G.accent }}>
                        {user?.role || 'customer'}
                      </span>
                    </div>
                    <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm transition-colors" style={{ color: G.text, textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(125,181,117,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <Ticket className="w-4 h-4 mr-3" style={{ color: G.textMuted }} />
                      My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm transition-colors" style={{ color: G.accent, textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(125,181,117,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Dashboard
                      </Link>
                    )}
                    {isOperator && (
                      <Link to="/operator/trips" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm transition-colors" style={{ color: G.accent, textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(125,181,117,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Operator Dashboard
                      </Link>
                    )}
                    <button type="button" onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-sm border-t transition-colors" style={{ color: '#f87171', borderColor: G.border, background: 'transparent' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-xl transition-all" style={{ color: G.text, textDecoration: 'none', border: `1px solid ${G.border}` }} onMouseEnter={(e) => { e.currentTarget.style.color = G.beige; e.currentTarget.style.borderColor = G.accent; }} onMouseLeave={(e) => { e.currentTarget.style.color = G.text; e.currentTarget.style.borderColor = G.border; }}>
                  Log In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold rounded-xl shadow-md transition-all" style={{ background: G.accent, color: G.bgDark, textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#52964a'; }} onMouseLeave={(e) => { e.currentTarget.style.background = G.accent; }}>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" className="p-2 rounded-lg transition-colors" style={{ color: G.text }}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 pt-3 pb-6 space-y-2" style={{ background: G.bgDark, borderColor: G.border }}>
          {[{ to: '/', label: 'Home' }, { to: '/search', label: 'Find Buses' }].map(({ to, label }) => (
            <Link key={to} to={to} className="block px-3 py-2.5 rounded-lg text-base font-medium transition-colors" style={{ color: G.text, textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(125,181,117,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>{label}</Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="block px-3 py-2.5 rounded-lg text-base font-medium" style={{ color: G.text, textDecoration: 'none' }}>My Bookings</Link>
              {isAdmin && <Link to="/admin/dashboard" className="block px-3 py-2.5 rounded-lg text-base font-medium" style={{ color: G.accent, textDecoration: 'none' }}>Admin Portal</Link>}
              {isOperator && <Link to="/operator/trips" className="block px-3 py-2.5 rounded-lg text-base font-medium" style={{ color: G.accent, textDecoration: 'none' }}>Operator Dashboard</Link>}
              <div className="pt-2 border-t" style={{ borderColor: G.border }}>
                <button type="button" onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center space-x-2" style={{ color: '#f87171' }}>
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out ({user?.name || user?.email})</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t flex flex-col space-y-2" style={{ borderColor: G.border }}>
              <Link to="/login" className="w-full py-2.5 text-center text-sm font-semibold rounded-xl" style={{ color: G.beige, background: 'rgba(125,181,117,0.15)', textDecoration: 'none' }}>Log In</Link>
              <Link to="/register" className="w-full py-2.5 text-center text-sm font-bold rounded-xl" style={{ background: G.accent, color: G.bgDark, textDecoration: 'none' }}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
