import { Link } from 'react-router-dom';
import { Truck, Zap, BarChart3, Shield, MapPin, ArrowRight, CheckCircle2, Activity, Fuel, Users, Wrench } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Vehicle Registry', desc: 'Complete fleet inventory management with real-time tracking', color: 'cyan' },
  { icon: MapPin, title: 'Trip Dispatcher', desc: 'Smart route planning and trip assignment', color: 'emerald' },
  { icon: Wrench, title: 'Maintenance', desc: 'Preventive maintenance scheduling and tracking', color: 'amber' },
  { icon: Fuel, title: 'Expense Tracking', desc: 'Comprehensive fuel and expense management', color: 'cyan' },
  { icon: Users, title: 'Driver Profiles', desc: 'Driver performance monitoring and management', color: 'emerald' },
  { icon: BarChart3, title: 'Analytics', desc: 'Real-time insights and data visualization', color: 'amber' },
];

const stats = [
  { value: '10k+', label: 'Vehicles Managed', icon: Truck },
  { value: '99.9%', label: 'Uptime', icon: Activity },
  { value: '50M+', label: 'Trips Completed', icon: MapPin },
  { value: '24/7', label: 'Support', icon: Shield },
];

function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#030508' }}>
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" style={{ backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)', animation: 'float 15s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)', animation: 'float 18s ease-in-out infinite reverse' }} />
      </div>
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5 backdrop-blur-sm bg-obsidian-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-800 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl tracking-wide silver-text">FLEETFLOW</h1>
              <p className="text-[10px] font-mono text-cyan-500 tracking-wider">FLEET MANAGEMENT</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="btn-ghost">
              Dashboard
            </Link>
            <Link to="/login" className="btn-primary">
              Get Started <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-mono text-silver-300">Enterprise Fleet Management Platform</span>
          </div>
          
          <h2 className="font-display text-7xl md:text-8xl tracking-wide mb-6 leading-tight">
            <span className="silver-text">STREAMLINE</span>
            <br />
            <span className="cyan-text">YOUR FLEET</span>
          </h2>
          
          <p className="text-xl text-silver-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Complete fleet management solution with real-time tracking, analytics, and intelligent automation. 
            Optimize operations, reduce costs, and maximize efficiency.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <Link to="/login" className="btn-primary text-base px-8 py-3">
              Launch Dashboard <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <a href="#features" className="btn-ghost text-base px-8 py-3">
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card p-6 text-center group hover:border-cyan-500/20 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-display text-4xl cyan-text mb-1">{stat.value}</div>
                <div className="text-sm text-silver-500 font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="font-display text-5xl tracking-wide silver-text mb-4">POWERFUL FEATURES</h3>
          <p className="text-silver-400 text-lg">Everything you need to manage your fleet efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card-hover p-6 group cursor-pointer">
              <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/15 border border-${feature.color}-500/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h4 className="font-display text-xl tracking-wide text-silver-100 mb-2">{feature.title}</h4>
              <p className="text-silver-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="glass-card p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-display text-4xl tracking-wide silver-text mb-6">
                WHY CHOOSE FLEETFLOW?
              </h3>
              <div className="space-y-4">
                {[
                  'Real-time vehicle tracking and monitoring',
                  'Automated maintenance scheduling',
                  'Comprehensive expense management',
                  'Advanced analytics and reporting',
                  'Driver performance insights',
                  'Scalable cloud infrastructure'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-silver-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="glass-card p-8 border-cyan-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-8 h-8 text-cyan-400" />
                  <div>
                    <div className="font-display text-2xl silver-text">LIVE DASHBOARD</div>
                    <div className="text-xs text-silver-500 font-mono">Real-time Fleet Overview</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-obsidian-900/50 rounded-lg">
                    <span className="text-sm text-silver-400">Active Vehicles</span>
                    <span className="font-mono text-cyan-400 font-semibold">847</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-obsidian-900/50 rounded-lg">
                    <span className="text-sm text-silver-400">Ongoing Trips</span>
                    <span className="font-mono text-emerald-400 font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-obsidian-900/50 rounded-lg">
                    <span className="text-sm text-silver-400">Fleet Efficiency</span>
                    <span className="font-mono text-amber-400 font-semibold">94.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 mb-12">
        <div className="glass-card p-16 text-center border-cyan-500/20" style={{ boxShadow: '0 0 60px rgba(6,182,212,0.1)' }}>
          <h3 className="font-display text-5xl tracking-wide silver-text mb-4">READY TO TRANSFORM YOUR FLEET?</h3>
          <p className="text-silver-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of companies optimizing their fleet operations with FleetFlow
          </p>
          <Link to="/login" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Start Managing Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-obsidian-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-800 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-sm tracking-wide silver-text">FLEETFLOW</span>
            </div>
            <div className="text-sm text-silver-500 font-mono">
              © 2026 FleetFlow. Enterprise Fleet Management Platform.
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(5deg); }
          50% { transform: translate(-10px, 10px) rotate(-5deg); }
          75% { transform: translate(10px, 20px) rotate(3deg); }
        }
        .bg-grid {
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(34,211,238,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34,211,238,0.03) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}

export default LandingPage;