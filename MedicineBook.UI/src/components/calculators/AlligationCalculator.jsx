import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const AlligationCalculator = () => {
  const { addToast } = useToast();
  const [lower, setLower] = useState('');
  const [higher, setHigher] = useState('');
  const [final, setFinal] = useState('');
  const [volume, setVolume] = useState('');

  const [result, setResult] = useState(null);

  const calculate = () => {
    const l = parseFloat(lower);
    const h = parseFloat(higher);
    const f = parseFloat(final);
    const v = parseFloat(volume);

    if (isNaN(l) || isNaN(h) || isNaN(f) || isNaN(v)) {
      addToast('Please enter valid numbers in all fields', 'error');
      return;
    }

    if (f <= l || f >= h) {
      addToast('Final concentration must be strictly between Lower and Higher concentrations', 'error');
      return;
    }

    const partsHigher = f - l;
    const partsLower = h - f;
    const totalParts = h - l;

    const volumeHigher = (v * partsHigher) / totalParts;
    const volumeLower = (v * partsLower) / totalParts;

    setResult({
      higherVolume: volumeHigher.toFixed(2),
      lowerVolume: volumeLower.toFixed(2),
      h, l
    });

    // Log the activity
    axios.post('/api/analytics/track', {
      actionType: 'Calculator',
      details: `Calculated Alligation: Final ${f}% from ${h}% & ${l}% (Vol: ${v}mL)`
    }).catch(err => console.error("Failed to log activity", err));
  };

  const reset = () => {
    setLower('');
    setHigher('');
    setFinal('');
    setVolume('');
    setResult(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-stretch animate-fade-in">
      {/* Inputs Section */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium">Lower % Concentration</label>
          <input 
            type="number" 
            value={lower} 
            onChange={e => setLower(e.target.value)}
            className="glass-input flex-1" 
            placeholder="e.g. 10" 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium">Higher % Concentration</label>
          <input 
            type="number" 
            value={higher} 
            onChange={e => setHigher(e.target.value)}
            className="glass-input flex-1" 
            placeholder="e.g. 20" 
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium">Final % Concentration</label>
          <input 
            type="number" 
            value={final} 
            onChange={e => setFinal(e.target.value)}
            className="glass-input flex-1 border-primary/50 focus:border-primary" 
            placeholder="e.g. 15" 
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium">Total final Volume</label>
          <div className="flex-1 flex relative">
            <input 
              type="number" 
              value={volume} 
              onChange={e => setVolume(e.target.value)}
              className="glass-input w-full pr-12 border-secondary/50 focus:border-secondary" 
              placeholder="e.g. 1000" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">mL</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
      <div className="md:hidden h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent my-2"></div>

      {/* Outputs & Actions Section */}
      <div className="flex-1 flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-6 pt-2">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">
              Amount of <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{result ? result.h + '%' : 'Higher %'}</span>
            </label>
            <div className="flex relative items-center">
              <input 
                type="text" 
                readOnly
                value={result ? result.higherVolume : ''}
                className="glass-input w-full pr-12 text-lg font-bold bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white" 
              />
              <span className="absolute right-4 text-slate-500 font-medium">mL</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">
              Amount of <span className="inline-block bg-secondary/10 text-secondary px-2 py-0.5 rounded font-bold">{result ? result.l + '%' : 'Lower %'}</span>
            </label>
            <div className="flex relative items-center">
              <input 
                type="text" 
                readOnly
                value={result ? result.lowerVolume : ''}
                className="glass-input w-full pr-12 text-lg font-bold bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white" 
              />
              <span className="absolute right-4 text-slate-500 font-medium">mL</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6 md:mt-0">
          <button 
            onClick={calculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95 text-lg"
          >
            Calculate
          </button>
          <button 
            onClick={reset}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95 text-lg flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlligationCalculator;
