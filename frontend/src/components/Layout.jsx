import React, { useEffect, useState } from 'react';
const Layout = ({ children, activeTab, setActiveTab }) => {
  const [apiOnline, setApiOnline] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/health`);
        setApiOnline(res.ok);
      } catch (err) {
        setApiOnline(false);
      }
    };
    checkHealth();
    const intervalId = setInterval(checkHealth, 10000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="flex h-screen bg-obsidian-900 overflow-hidden relative selection:bg-cyber-cyan/30">
      {}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none hw-accel"></div>
      {}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyber-cyan/5 blur-[120px] rounded-full pointer-events-none hw-accel"></div>
      {}
      <aside className="w-72 bg-obsidian-800/90 backdrop-blur-2xl border-r border-white/5 flex flex-col z-20 shadow-2xl relative hw-accel">
        {}
        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-luxury-gold/30 to-transparent"></div>
        {}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] hw-accel">✨</span>
              <div className="absolute inset-0 bg-luxury-gold/20 blur-xl rounded-full scale-150 group-hover:bg-luxury-gold/40 transition-colors duration-500"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest text-white uppercase flex items-center gap-1">
                Sneaker<span className="text-luxury-light">Auth</span>
              </h1>
              <p className="text-[10px] text-cyber-cyan font-mono tracking-[0.2em] mt-1 opacity-80 uppercase">ZK Verifier v2</p>
            </div>
          </div>
        </div>
        {}
        <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto">
          <div>
            <p className="px-5 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-4">Core Actions</p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('authenticate')}
                  className={`nav-item ${activeTab === 'authenticate' ? 'nav-item-active' : ''}`}
                >
                  <span className="text-lg w-6">🔍</span>
                  AUTHENTICATE
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`nav-item ${activeTab === 'transfer' ? 'nav-item-active' : ''}`}
                >
                  <span className="text-lg text-luxury-light w-6">🤝</span>
                  TRANSFER OWNERSHIP
                </button>
              </li>
            </ul>
          </div>
          <div>
             <p className="px-5 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-4">Administration</p>
             <ul className="space-y-2">
               <li>
                <button
                  onClick={() => setActiveTab('batch')}
                  className={`nav-item ${activeTab === 'batch' ? 'nav-item-active' : ''}`}
                >
                  <span className="text-lg w-6">🏭</span>
                  BATCH ADMIN
                </button>
              </li>
             </ul>
          </div>
        </nav>
        {}
        <div className="p-6 border-t border-white/5 bg-obsidian-900/50 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Network Status</h3>
            <span className="relative flex h-3 w-3">
              {apiOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${apiOnline ? 'bg-cyber-cyan' : 'bg-rose-500'}`}></span>
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 text-xs">API Link</span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${apiOnline ? 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                {apiOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 text-xs">Chain</span>
              <span className="font-mono text-xs text-gray-400">Sepolia Testnet</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 text-xs">Latency</span>
              <span className="font-mono text-xs text-cyber-cyan">12ms</span>
            </div>
          </div>
        </div>
      </aside>
      {}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <div className="flex-1 max-w-5xl mx-auto w-full p-8 md:p-12 z-10 relative">
          {!apiOnline && (
            <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 backdrop-blur-md hw-accel animate-in slide-in-from-top-2">
              <span className="text-rose-400 animate-pulse text-xl">⚠️</span>
              <p className="text-sm font-medium text-rose-200">
                Connection to ORB API lost at <code className="bg-obsidian-900 px-2 py-1 rounded border border-rose-500/30 text-rose-300">{API_URL}</code>. Start the backend server.
              </p>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};
export default Layout;
