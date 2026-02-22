import React, { useState } from 'react';
import Header from './Header';

const Authenticate = () => {
  const [refFile, setRefFile] = useState(null);
  const [testFile, setTestFile] = useState(null);
  const [batchId, setBatchId] = useState(2001);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAuthenticate = async () => {
    if (!refFile || !testFile) {
      setError("Please upload both a reference image and a test image.");
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("reference_image", refFile);
    formData.append("test_image", testFile);
    formData.append("batch_id", batchId);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${API_BASE}/authenticate`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Server Error");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(`Connection Failure: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up w-full max-w-4xl relative z-10">
      <Header 
        title="Authenticate Sneaker" 
        subtitle="Upload a reference image of the authenticated sneaker and a test image to verify. Our ORB model compares the two, and if genuine, the SHA256 fingerprint is permanently recorded on the Sepolia blockchain."
      />

      <div className="glass-card p-6 md:p-10 mb-8 relative z-10">
        
        {/* Decorative cyber corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan/40 rounded-tl-xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-luxury-gold/40 rounded-br-xl"></div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-luxury-light uppercase tracking-widest mb-1">📁 Reference Image</label>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">The canonical model graph</p>
            </div>
            <div className="relative group overflow-hidden rounded-xl bg-obsidian-900/50 border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300">
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setRefFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="p-4 flex flex-col items-center justify-center text-center h-24">
                 <span className="text-luxury-gold mb-2 group-hover:scale-110 transition-transform hw-accel">↑</span>
                 <span className="text-xs font-mono text-gray-400 group-hover:text-luxury-light transition-colors">UPLOAD AUTHENTIC</span>
              </div>
            </div>
            {refFile && (
              <div className="mt-4 rounded-xl overflow-hidden border border-luxury-gold/30 relative group hw-accel shadow-neon-gold">
                <div className="absolute inset-0 bg-luxury-gold/10 z-10 pointer-events-none" />
                <img src={URL.createObjectURL(refFile)} alt="Reference" className="w-full h-48 object-cover opacity-90" />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-cyber-cyan uppercase tracking-widest mb-1">📁 Test Image</label>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">The artifact to verify</p>
            </div>
            <div className="relative group overflow-hidden rounded-xl bg-obsidian-900/50 border border-white/5 hover:border-cyber-cyan/30 transition-colors duration-300">
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setTestFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="p-4 flex flex-col items-center justify-center text-center h-24">
                 <span className="text-cyber-cyan mb-2 group-hover:scale-110 transition-transform hw-accel">↑</span>
                 <span className="text-xs font-mono text-gray-400 group-hover:text-cyber-cyan transition-colors">UPLOAD ARTIFACT</span>
              </div>
            </div>
            {testFile && (
              <div className="mt-4 rounded-xl overflow-hidden border border-cyber-cyan/30 relative group hw-accel shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                {/* Cyber scanline effect on image */}
                <div className="absolute inset-0 bg-cyber-cyan/10 z-10 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-cyber-cyan/50 shadow-[0_0_10px_#00F0FF] z-20 animate-scanline pointer-events-none" />
                <img src={URL.createObjectURL(testFile)} alt="Test" className="w-full h-48 object-cover opacity-90" />
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Batch ID</label>
            <input 
              type="number" 
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="input-field mt-6 font-mono text-center text-lg"
            />
          </div>
        </div>

        <button 
          onClick={handleAuthenticate}
          disabled={loading}
          className={`btn-primary mt-12 w-full md:w-auto ${loading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-4 w-4 text-luxury-light" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              RUNNING ORB ANALYSIS
            </span>
          ) : 'RUN AUTHENTICITY CHECK'}
        </button>

        {error && (
          <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-medium text-sm hw-accel animate-in slide-in-from-top-2">
            ⚠️ {error}
          </div>
        )}
      </div>

      {result && (
        <div className="animate-fade-in-up flex flex-col gap-6 z-10 relative hw-accel">
          {result.authentic ? (
            <div className="bg-obsidian-800/90 backdrop-blur-xl border border-luxury-gold/50 rounded-2xl p-8 shadow-neon-gold relative overflow-hidden">
              {/* Luxury holographic glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/10 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-[60px] -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
              
              <h4 className="text-2xl font-bold text-luxury-light flex items-center gap-4 mb-10 tracking-[0.1em] uppercase">
                <span className="bg-luxury-gold/20 p-2.5 rounded-full border border-luxury-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.3)]">✨</span> 
                SNEAKER AUTHENTICATED
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-obsidian-900/80 rounded-xl border border-white/5 relative overflow-hidden group hover:border-luxury-gold/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-[0.2em]">Verdict</p>
                  <p className="text-2xl font-bold text-luxury-light tracking-wide">GENUINE</p>
                </div>
                <div className="p-6 bg-obsidian-900/80 rounded-xl border border-white/5 relative overflow-hidden group hover:border-cyber-cyan/30 transition-colors">
                   <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-[0.2em]">Confidence</p>
                  <p className="text-2xl font-bold text-white tracking-wider">{(result.confidence * 100).toFixed(1)}<span className="text-cyber-cyan text-lg">%</span></p>
                </div>
                <div className="p-6 bg-obsidian-900/80 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-[0.2em]">Method</p>
                  <p className="text-2xl font-bold text-gray-300 tracking-wider">ORB Match</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-bold text-luxury-gold mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-1 bg-luxury-gold rounded-full animate-pulse-glow"></span>
                  SHA256 Product Serial
                </p>
                <div className="bg-obsidian-900 border border-luxury-gold/20 text-luxury-light font-mono text-sm p-5 rounded-xl break-all shadow-inner tracking-widest relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-luxury-gold to-luxury-light"></div>
                  {result.serial}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-obsidian-900/50 border border-white/5 rounded-xl hover:border-cyber-cyan/20 transition-colors">
                  <p className="text-[9px] font-bold text-cyber-cyan mb-2 uppercase tracking-[0.2em]">Register TX Hash</p>
                  <p className="text-[10px] font-mono text-gray-400 break-all bg-obsidian-900 p-2 rounded">{result.register_tx}</p>
                </div>
                <div className="p-5 bg-obsidian-900/50 border border-white/5 rounded-xl hover:border-cyber-cyan/20 transition-colors">
                  <p className="text-[9px] font-bold text-cyber-cyan mb-2 uppercase tracking-[0.2em]">Verify TX Hash</p>
                  <p className="text-[10px] font-mono text-gray-400 break-all bg-obsidian-900 p-2 rounded">{result.verify_tx}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-obsidian-800/90 backdrop-blur-xl border border-rose-500/50 rounded-2xl p-8 shadow-[0_0_30px_rgba(244,63,94,0.15)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <h4 className="text-2xl font-bold text-rose-500 flex items-center gap-4 mb-8 tracking-[0.1em] uppercase">
                <span className="bg-rose-500/20 p-2.5 rounded-full border border-rose-500/30">🚨</span> 
                COUNTERFEIT DETECTED
              </h4>
              <div className="bg-obsidian-900 p-6 rounded-xl border border-rose-500/20">
                <p className="font-bold text-white mb-3 text-lg tracking-wide">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                <p className="text-gray-400 text-sm leading-relaxed tracking-wide">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Authenticate;
