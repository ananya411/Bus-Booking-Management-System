import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, CheckCircle, ShieldCheck } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import Logo from '../components/Logo';

// ── Top-level InputField (defined OUTSIDE component to prevent remounting & focus loss) ──
function InputField({
  label,
  name,
  type = 'text',
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
  required = true,
}) {
  const inputType = showPasswordToggle ? (isPasswordVisible ? 'text' : 'password') : type;

  return (
    <div>
      <label htmlFor={name} className="block text-xs font-bold uppercase mb-1 text-gray-700 tracking-wider">
        {label}
      </label>
      <div className="relative">
        <Icon className="w-5 h-5 absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
        <input
          id={name}
          name={name}
          type={inputType}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete || (name.includes('password') ? 'new-password' : name)}
          className={`w-full pl-11 ${showPasswordToggle ? 'pr-11' : 'pr-4'} py-2.5 rounded-xl text-sm font-medium outline-none transition-all border ${
            error
              ? 'border-red-400 bg-red-50/30 text-gray-900 focus:ring-2 focus:ring-red-400/20'
              : 'border-gray-300 bg-gray-50/70 text-gray-900 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'
          }`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-1 focus:outline-none"
            tabIndex={-1}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'customer',
      });
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brand-gray">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
          <Logo className="h-12 w-auto mx-auto" />
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900">
          Create Your Passenger Account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-dark hover:underline">
            Log in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100 bg-white space-y-5">
          {apiError && <ErrorMessage message={apiError} onClose={() => setApiError('')} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name *"
              name="name"
              icon={User}
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />

            <InputField
              label="Email Address *"
              name="email"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <InputField
              label="Mobile Phone *"
              name="phone"
              type="tel"
              icon={Phone}
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              autoComplete="tel"
            />

            <InputField
              label="Password (min 6 characters) *"
              name="password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              showPasswordToggle={true}
              isPasswordVisible={showPassword}
              onTogglePasswordVisibility={() => setShowPassword((prev) => !prev)}
            />

            <InputField
              label="Confirm Password *"
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
              showPasswordToggle={true}
              isPasswordVisible={showConfirmPassword}
              onTogglePasswordVisibility={() => setShowConfirmPassword((prev) => !prev)}
            />

            <div className="p-3.5 rounded-xl border border-brand-accent/30 bg-brand-accent/10 flex items-start space-x-2.5 text-xs text-brand-dark">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-brand-dark" />
              <span>
                Registering creates a verified passenger account. Operator and Administrator roles are assigned centrally by system management.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold rounded-xl shadow-lg shadow-brand-accent/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-60 active:scale-[0.99]"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Register as Passenger'}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-gray-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-dark" />
              <span>256-bit encrypted secure registration</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
