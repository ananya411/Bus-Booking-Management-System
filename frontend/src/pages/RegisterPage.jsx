import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, User, Mail, Phone, Lock, UserPlus, CheckCircle } from 'lucide-react';
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

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'customer' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Please provide a valid email';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Please provide a 10-digit mobile number';
    if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await register({ name: formData.name.trim(), email: formData.email.trim(), phone: formData.phone.trim(), password: formData.password, role: 'customer' });
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    background: G.beige50,
    borderColor: hasError ? '#dc2626' : G.beige200,
    color: G.forest,
  });

  const Field = ({ label, name, type = 'text', icon: Icon, placeholder }) => (
    <div>
      <label className="block text-xs font-bold uppercase mb-1" style={{ color: G.forest }}>{label}</label>
      <div className="relative">
        <Icon className="w-5 h-5 absolute left-3.5 top-3" style={{ color: G.beigeDark }} />
        <input
          type={type} name={name} value={formData[name]} onChange={handleChange}
          placeholder={placeholder} required
          className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all border"
          style={inputStyle(!!errors[name])}
          onFocus={(e) => { e.target.style.borderColor = G.forestMid; e.target.style.boxShadow = '0 0 0 3px rgba(30,82,25,0.1)'; }}
          onBlur={(e) => { e.target.style.borderColor = errors[name] ? '#dc2626' : G.beige200; e.target.style.boxShadow = 'none'; }}
        />
      </div>
      {errors[name] && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ background: G.beige100 }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2" style={{ textDecoration: 'none' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: G.forestMid, color: G.beige50 }}>
            <Bus className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black" style={{ color: G.forest }}>Bus<span style={{ color: G.accent }}>Mitra</span></span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight" style={{ color: G.forest }}>Create Your Passenger Account</h2>
        <p className="mt-1 text-sm" style={{ color: G.beigeDark }}>
          Already registered?{' '}
          <Link to="/login" className="font-semibold" style={{ color: G.forestMid, textDecoration: 'none' }}>Log in to your account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="py-8 px-6 sm:px-10 shadow-xl rounded-3xl border space-y-5" style={{ background: '#fff', borderColor: G.beige200 }}>
          {apiError && <ErrorMessage message={apiError} onClose={() => setApiError('')} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name *" name="name" icon={User} placeholder="e.g. John Doe" />
            <Field label="Email Address *" name="email" type="email" icon={Mail} placeholder="name@example.com" />
            <Field label="Phone Number *" name="phone" type="tel" icon={Phone} placeholder="10-digit mobile number" />
            <Field label="Password (min 6 characters) *" name="password" type="password" icon={Lock} placeholder="••••••••" />
            <Field label="Confirm Password *" name="confirmPassword" type="password" icon={Lock} placeholder="••••••••" />

            <div className="p-3 rounded-xl border flex items-start space-x-2 text-xs" style={{ background: '#f0f5ef', borderColor: G.accent + '55', color: G.forestMid }}>
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: G.forestMid }} />
              <span>Registering creates a verified passenger account. Operator and Administrator roles are assigned centrally by system management.</span>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-60"
              style={{ background: G.forestMid, color: G.beige50, boxShadow: '0 4px 15px rgba(30,82,25,0.35)' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = G.forest; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = G.forestMid; }}
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Register as Passenger'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
