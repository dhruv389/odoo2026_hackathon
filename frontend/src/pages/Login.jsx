import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight, Shield, Truck, BarChart3 } from 'lucide-react';
import { authAPI } from '../services/api';

const roles = [
  { id: 'manager', label: 'Fleet Manager', desc: 'Full system access', icon: Truck },
  { id: 'dispatcher', label: 'Dispatcher', desc: 'Trip operations', icon: ArrowRight },
  { id: 'analyst', label: 'Analyst', desc: 'Reports & analytics', icon: BarChart3 },
];

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('admin@fleetflow.io');
  const [password, setPassword] = useState('fleet2024');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#030508' }}>
      {/* Animated background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
      </div>
      <div className="noise-overlay" />

      <div className="relative z-10 w-full max-w-4xl mx-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

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
              Next-generation fleet intelligence platform. Monitor, dispatch, and optimize your entire fleet operation in real-time.
            </p>

            <div className="space-y-3">
              {[
                { icon: Shield, label: 'Enterprise-grade security & RBAC' },
                { icon: Truck, label: 'Real-time vehicle & driver tracking' },
                { icon: BarChart3, label: 'AI-powered analytics & reporting' },
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

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 mt-8" style={{ animation: 'fadeUp 0.8s ease-out' }}>
            {[
              { val: '2.4K+', label: 'Vehicles Managed' },
              { val: '98.7%', label: 'Uptime SLA' },
              { val: '₹42M', label: 'Cost Saved' },
            ].map(({ val, label }) => (
              <div key={label} className="glass-card p-4 text-center border border-white/5">
                <p className="font-display text-2xl text-cyan-400">{val}</p>
                <p className="text-xs text-silver-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login form */}
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

          <h2 className="font-display text-2xl silver-text mb-1">Welcome Back</h2>
          <p className="text-xs text-silver-500 font-mono mb-6">Sign in to your control center</p>

          {/* Role selector */}
          <div className="mb-5">
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-2 block">Access Role</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-all duration-200 ${role === id ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' : 'border-white/8 text-silver-500 hover:border-white/15 hover:text-silver-300'}`}
                >
                  <Icon size={14} className="mx-auto mb-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Email</label>
              <input 
                className="input-field" 
                type="email" 
                placeholder="admin@fleetflow.io" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Password</label>
              <div className="relative">
                <input 
                  className="input-field pr-10" 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-xs text-silver-500">Remember me</span>
              </label>
              <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-11 text-white font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Access Control Center</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-silver-600 font-mono">v2.4.1 — Production</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 font-mono">Systems Nominal</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-silver-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}