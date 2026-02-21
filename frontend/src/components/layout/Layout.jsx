import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-obsidian-950">
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid pointer-events-none opacity-100" />
      {/* Radial glow */}
      <div className="fixed top-0 left-60 right-0 h-72 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.04) 0%, transparent 70%)' }} />

      <div className="noise-overlay" />
      <Sidebar />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar title={title} subtitle={subtitle} />
        <div className="flex-1 p-6 relative">
          {children}
        </div>
      </main>
    </div>
  );
}