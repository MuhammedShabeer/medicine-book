import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const VancomycinCalculator = () => {
  const { addToast } = useToast();
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');
  const [scr, setScr] = useState('');
  const [trough, setTrough] = useState('');

  const [result, setResult] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const a = parseFloat(age);
    const s = parseFloat(scr);
    const t = parseFloat(trough);

    if (isNaN(w) || isNaN(a) || isNaN(s) || isNaN(t)) {
      addToast('Please enter valid numbers in all fields', 'error');
      return;
    }

    // Weight conversion to kg
    const kg = unit === 'imperial' ? w / 2.20462 : w;

    // CrCl (Cockcroft-Gault)
    let crcl = ((140 - a) * kg) / (72 * s);
    if (sex === 'female') crcl *= 0.85;

    // Volume of Distribution
    const vd = 0.9 * kg;

    // Elimination Rate Constant
    const ke = (0.00083 * crcl) + 0.0044;

    // Half-life
    const t12 = 0.693 / ke;

    // Loading Dose (rounded to nearest 250)
    let rawLoad = 20 * kg;
    let loadDose = Math.round(rawLoad / 250) * 250;
    
    // If exactly halfway, standard round goes up, but just to ensure we have a valid dose:
    if (loadDose === 0) loadDose = 250; 

    // Dosing Interval (Tau)
    let tau = 24;
    if (crcl > 90) tau = 8;
    else if (crcl >= 50) tau = 12;
    else if (crcl >= 20) tau = 24;
    else tau = 0; // Special case for < 20

    // Maintenance Dose
    let maintStr = 'Dose by levels';
    if (tau > 0) {
      const expKeTau = Math.exp(-ke * tau);
      const cmax = t / expKeTau;
      const rawMaint = cmax * vd * (1 - expKeTau);
      
      let maintDose = Math.round(rawMaint / 250) * 250;
      if (maintDose === 0) maintDose = 250; // Minimum sensible dose usually
      maintStr = `${maintDose} mg / ${tau} hours`;
    }

    setResult({
      crcl: crcl.toFixed(1),
      vd: vd.toFixed(1),
      ke: ke.toFixed(3),
      t12: t12.toFixed(1),
      loadDose: loadDose,
      maintStr: maintStr,
      raw: { kg, a, sex, s, t }
    });

    // Log the activity
    axios.post('/api/analytics/track', {
      actionType: 'Calculator',
      details: `Vancomycin Dose calculated for ${a}yo ${sex}, ${kg.toFixed(1)}kg`
    }).catch(err => console.error("Failed to log activity", err));
  };

  const reset = () => {
    setWeight('');
    setAge('');
    setScr('');
    setTrough('');
    setResult(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-stretch animate-fade-in">
      
      {/* Inputs Section */}
      <div className="flex-1 flex flex-col gap-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium text-sm">Unit System</label>
          <select 
            className="glass-input flex-1 py-2 bg-slate-50 dark:bg-slate-800"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="metric">Metric (kg, mg/dL)</option>
            <option value="imperial">Imperial (lbs, mg/dL)</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium text-sm">Patient Weight</label>
          <div className="flex-1 flex relative">
            <input 
              type="number" 
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className="glass-input w-full pr-12" 
              placeholder="e.g. 70" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">
              {unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium text-sm">Patient Age</label>
          <div className="flex-1 flex relative">
            <input 
              type="number" 
              value={age}
              onChange={e => setAge(e.target.value)}
              className="glass-input w-full pr-16" 
              placeholder="e.g. 45" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">years</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium text-sm">Patient Sex</label>
          <select 
            className="glass-input flex-1 py-2 bg-slate-50 dark:bg-slate-800"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium text-sm">Serum Creatinine (SCr)</label>
          <div className="flex-1 flex relative">
            <input 
              type="number" 
              step="0.1"
              value={scr}
              onChange={e => setScr(e.target.value)}
              className="glass-input w-full pr-16" 
              placeholder="e.g. 1.0" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">mg/dL</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-48 text-slate-700 dark:text-slate-300 font-medium text-sm">Target Trough Level</label>
          <div className="flex-1 flex relative">
            <input 
              type="number" 
              value={trough}
              onChange={e => setTrough(e.target.value)}
              className="glass-input w-full pr-12 border-primary/50 focus:border-primary" 
              placeholder="e.g. 15" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">mg/L</span>
          </div>
        </div>
        
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
      <div className="md:hidden h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent my-2"></div>

      {/* Outputs & Actions Section */}
      <div className="flex-1 flex flex-col justify-between gap-6">
        
        {/* Results Box */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ${result ? 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 shadow-lg' : 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent opacity-70'}`}>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">
            Calculation Results
          </h3>
          
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5 border-dashed">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Estimated CrCl:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{result ? `${result.crcl} mL/min` : '--'}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5 border-dashed">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Volume of Distribution (Vd):</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{result ? `${result.vd} L` : '--'}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5 border-dashed">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Elimination Rate (Ke):</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{result ? `${result.ke} hr⁻¹` : '--'}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5 border-dashed">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Half-life (t½):</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{result ? `${result.t12} hours` : '--'}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5 border-dashed">
              <span className="text-primary font-semibold">Recommended Loading Dose:</span>
              <span className="font-bold text-slate-900 dark:text-white bg-primary/10 px-2 py-0.5 rounded">{result ? `${result.loadDose} mg` : '--'}</span>
            </div>
          </div>
          
          <div className={`mt-4 p-4 rounded-xl border ${result ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 border-transparent'}`}>
             <div className="text-center text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
               Recommended Maintenance Dose & Interval:
             </div>
             <div className="text-center text-2xl font-bold text-emerald-600 dark:text-emerald-300">
               {result ? result.maintStr : '--'}
             </div>
          </div>
        </div>

        <div className="flex gap-4 mt-2">
          <button 
            onClick={calculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95 text-lg"
          >
            Calculate Dose
          </button>
          <button 
            onClick={reset}
            className="w-14 md:w-auto md:px-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            title="Reset"
          >
            <RefreshCw size={20} /> <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VancomycinCalculator;
