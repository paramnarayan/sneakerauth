import React, { useState } from 'react';
import Header from './Header';

const BatchAdmin = () => {
  const [batchId, setBatchId] = useState(1001);
  const [serials, setSerials] = useState("SN-1001, SN-1002, SN-1003");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRegisterBatch = async () => {
    const serialsList = serials.split(",").map(s => s.trim()).filter(Boolean);
    if (serialsList.length === 0) {
      setError("Serial array cannot be empty.");
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${API_BASE}/register_batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: batchId, serials: serialsList }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Transaction Reverted");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(`Network Failure: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up w-full max-w-4xl relative z-10">
      <Header 
        title="Batch Administration" 
        subtitle="Advanced admin panel. Manually register a batch of product physical serials and query the Merkle Root on-chain."
      />

      <div className="glass-card p-6 md:p-10 mb-8 relative z-10">
        
        {/* Decorative cyber corner accents */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyber-cyan/40 rounded-tr-xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-luxury-gold/40 rounded-bl-xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 mt-4">
          <div className="md:col-span-1 space-y-3">
            <label className="block text-xs font-bold text-luxury-light uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse-glow"></span>
              Batch Allocation ID
            </label>
            <input 
              type="number" 
              className="input-field font-mono text-center text-lg bg-obsidian-900/80 border-white/5 hover:border-luxury-gold/30 focus:border-luxury-gold focus:shadow-neon-gold"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-bold text-cyber-cyan uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse-glow"></span>
              Physical Serial Numbers
              <span className="text-[9px] text-gray-500 normal-case tracking-normal ml-2">(comma separated)</span>
            </label>
            <textarea 
              className="input-field min-h-[130px] resize-y font-mono text-sm leading-relaxed tracking-widest text-gray-300 bg-obsidian-900/80 border-white/5 hover:border-cyber-cyan/30 focus:border-cyber-cyan focus:shadow-neon-cyan"
              value={serials}
              onChange={(e) => setSerials(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleRegisterBatch}
          disabled={loading}
          className={`btn-primary w-full md:w-auto ${loading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {loading ? (
             <span className="flex items-center justify-center gap-3">
             <svg className="animate-spin h-4 w-4 text-luxury-light" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             ANCHORING TO BLOCKCHAIN
           </span>
          ) : 'ANCHOR BATCH TO BLOCKCHAIN'}
        </button>

        {error && (
          <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-medium text-sm hw-accel animate-in slide-in-from-top-2">
            ⚠️ {error}
          </div>
        )}

        {result && (
          <div className="mt-12 p-8 bg-obsidian-800/90 backdrop-blur-xl border border-cyber-cyan/50 rounded-2xl shadow-neon-cyan relative overflow-hidden hw-accel animate-fade-in-up">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-[60px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <h4 className="text-2xl font-bold text-cyber-cyan flex items-center gap-4 mb-8 tracking-[0.1em] uppercase">
              <span className="bg-cyber-cyan/20 p-2.5 rounded-full border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]">✨</span> 
              BATCH REGISTERED SUCCESSFULLY
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-obsidian-900/80 p-6 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyber-cyan to-blue-500"></div>
                <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-[0.2em]">Merkle Root</p>
                <p className="text-lg font-mono font-bold text-cyber-cyan tracking-widest break-all">
                  0x{result.batch_root.slice(0,8)}...{result.batch_root.slice(-6)}
                </p>
              </div>
              <div className="bg-obsidian-900/80 p-6 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-luxury-gold to-luxury-light"></div>
                <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-[0.2em]">Transaction Hash</p>
                <p className="text-sm font-mono text-gray-300 break-all">{result.tx_hash}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchAdmin;
