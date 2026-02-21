import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight, Shield, Users, Building2, UserCog, TrendingUp, Truck } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/ToastContainer';

const roles = [
  { 
    value: 'admin', 
    label: 'Admin', 
    desc: 'Full system control', 
    icon: Shield,
    color: 'rose'
  },
  { 
    value: 'fleet_manager', 
    label: 'Fleet Manager', 
    desc: 'Fleet operations', 
    icon: Truck,
    color: 'cyan'
  },
  { 
    value: 'dispatcher', 
    label: 'Dispatcher', 
    desc: 'Trip management', 
    icon: UserCog,
    color: 'emerald'
  },
  { 
    value: 'safety_officer', 
    label: 'Safety Officer', 
    desc: 'Safety & compliance', 
    icon: Shield,
    color: 'amber'
  },
  { 
    value: 'financial_analyst', 
    label: 'Financial Analyst', 
    desc: 'Cost & analytics', 
    icon: TrendingUp,
    color: 'purple'
  },
  { 
    value: 'driver', 
    label: 'Driver', 
    desc: 'Driver access', 
    icon: Users,
    color: 'blue'
  },
];

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'dispatcher'
  });
  
  const navigate = useNavigate();
  const { toasts, removeToast, toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Account created successfully!');
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  const selectedRole = roles.find(r => r.value === form.role);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8" style={{ background: '#030508' }}>
      {/* Animated background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
      </div>
      <div className="noise-overlay" />

      <div className="relative z-10 w-full max-w-5xl mx-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left: Branding */}
        <div className="hidden lg:block">
          <div className="mb-8" style={{ animation: 'fadeUp 0.6s ease-out' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-800 flex items-center justify-center" style={{ boxShadow: '0 0 40px rgba(6,182,212,0.4)' }}>
                  <Zap size={26} className="text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-xl -z-10" />
              </div>
              <div>
                <div className="font-display text-5xl tracking-widest">
                  <span className="text-white">FLEET</span>
                  <span className="text-cyan-400">FLOW</span>
                </div>
              </div>
            </div>
            <p className="text-silver-400 text-lg leading-relaxed mb-8">
              Join the next-generation fleet intelligence platform. Get started with your team account and transform your fleet operations.
            </p>

            <div className="space-y-3">
              {[
                { icon: Shield, label: 'Role-based access control' },
                { icon: Building2, label: 'Multi-tenant architecture' },
                { icon: Users, label: 'Collaborative workspace' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Icon size={14} className="text-cyan-400" />
                  </div>
                  <span className="text-sm text-silver-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-3 mt-8" style={{ animation: 'fadeUp 0.8s ease-out' }}>
            {[
              { val: '500+', label: 'Companies' },
              { val: '99.9%', label: 'Uptime' },
              { val: 'ISO 27001', label: 'Certified' },
            ].map(({ val, label }) => (
              <div key={label} className="glass-card p-4 text-center border border-white/5">
                <p className="font-display text-xl text-cyan-400">{val}</p>
                <p className="text-xs text-silver-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Signup form */}
        <div className="glass-card border border-white/8 p-8" style={{ animation: 'fadeUp 0.5s ease-out', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-800 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div className="font-display text-3xl">
              <span className="text-white">FLEET</span>
              <span className="text-cyan-400">FLOW</span>
            </div>
          </div>

          <h2 className="font-display text-2xl silver-text mb-1">Create Account</h2>
          <p className="text-xs text-silver-500 font-mono mb-6">Join your fleet management team</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Full Name</label>
              <input 
                className="input-field" 
                type="text" 
                placeholder="John Doe" 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Email Address</label>
              <input 
                className="input-field" 
                type="email" 
                placeholder="john@company.com" 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-2 block">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                      form.role === value 
                        ? 'border-cyan-500/40 bg-cyan-500/10' 
                        : 'border-white/8 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} className={form.role === value ? 'text-cyan-400' : 'text-silver-500'} />
                      <span className={`text-xs font-medium ${form.role === value ? 'text-cyan-400' : 'text-silver-300'}`}>
                        {label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {selectedRole && (
                <p className="text-xs text-silver-500 mt-2 flex items-center gap-2">
                  <selectedRole.icon size={12} className="text-cyan-400" />
                  {selectedRole.desc}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Password</label>
              <div className="relative">
                <input 
                  className="input-field pr-10" 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <input 
                  className="input-field pr-10" 
                  type={showConfirmPass ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPass(!showConfirmPass)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300"
                >
                  {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded" required />
              <span className="text-xs text-silver-500">
                I agree to the <button type="button" className="text-cyan-400 hover:text-cyan-300">Terms of Service</button> and <button type="button" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</button>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-11 text-white font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-xs text-silver-500">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
