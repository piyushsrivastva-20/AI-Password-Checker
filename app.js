import React, { useState, useMemo } from 'react';
import { Lock, Key, Zap, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

const App = () => {
  const [password, setPassword] = useState('');

  const analyzePassword = (pwd) => {
    if (!pwd) return { score: 0, label: 'Empty', entropy: 0, feedback: [] };

    let feedback = [];
    let score = 0;

    // 1. Calculate Shannon Entropy (Mathematical Randomness)
    const length = pwd.length;
    let range = 0;
    if (/[a-z]/.test(pwd)) range += 26;
    if (/[A-Z]/.test(pwd)) range += 26;
    if (/[0-9]/.test(pwd)) range += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) range += 32;
    const entropy = length > 0 ? Math.floor(length * Math.log2(range || 1)) : 0;

    // 2. AI-Heuristic Pattern Matching
    let deductions = 0;
    const keyboardWalks = ['qwerty', 'asdfgh', 'zxcvbn', '123456'];
    keyboardWalks.forEach(walk => {
      if (pwd.toLowerCase().includes(walk)) {
        deductions += 1.5;
        feedback.push("Predictable keyboard pattern detected.");
      }
    });

    if (/(abc|123|bcd|234)/i.test(pwd)) {
      deductions += 0.5;
      feedback.push("Sequential characters are easy to guess.");
    }

    // 3. Final Scoring (0-4)
    if (entropy < 30) score = 0;
    else if (entropy < 50) score = 1;
    else if (entropy < 70) score = 2;
    else if (entropy < 90) score = 3;
    else score = 4;

    score = Math.max(0, Math.floor(score - deductions));

    const config = [
      { text: 'Very Weak', color: 'bg-red-500', textCol: 'text-red-500' },
      { text: 'Weak', color: 'bg-orange-500', textCol: 'text-orange-500' },
      { text: 'Fair', color: 'bg-yellow-500', textCol: 'text-yellow-500' },
      { text: 'Strong', color: 'bg-green-500', textCol: 'text-green-500' },
      { text: 'Very Strong', color: 'bg-emerald-600', textCol: 'text-emerald-600' }
    ];

    return { ...config[score], score, entropy, feedback };
  };

  const analysis = useMemo(() => analyzePassword(password), [password]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Strength Checker</h1>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-12 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Type your password..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-3">
            <span className={`text-lg font-bold uppercase ${analysis.textCol}`}>{analysis.label}</span>
            <span className="text-slate-500 text-xs font-mono">Score: {analysis.score}/4</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${password && i < analysis.score ? analysis.color : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 text-white">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" /> Entropy
            </p>
            <p className="text-xl font-bold">{analysis.entropy} <span className="text-xs font-normal text-slate-600">bits</span></p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Crack Time
            </p>
            <p className="text-sm font-bold truncate">{analysis.entropy > 60 ? 'Centuries' : 'Fast'}</p>
          </div>
        </div>

        <div className="space-y-2">
          {analysis.feedback.map((msg, i) => (
            <div key={i} className="flex gap-2 text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <ShieldAlert className="w-4 h-4 shrink-0" /> {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
