import React, { useState } from 'react';
import { RefreshCw, Play, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const VancomycinCalculator = () => {
  const { addToast } = useToast();
  
  // Patient Inputs
  const [unit, setUnit] = useState('metric');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');
  const [scr, setScr] = useState('');
  const [trough, setTrough] = useState('15');
  const [mic, setMic] = useState('1.0');

  // Core Results
  const [coreResult, setCoreResult] = useState(null);
  
  // Dosing Options Table
  const [dosingOptions, setDosingOptions] = useState([]);
  
  // Sandbox State
  const [selectedRegimen, setSelectedRegimen] = useState(null);
  const [customDose, setCustomDose] = useState('');
  const [customFreq, setCustomFreq] = useState('');
  const [customInfTime, setCustomInfTime] = useState('');
  const [customResult, setCustomResult] = useState(null);

  const calculateDosingProfile = (dose, tau, infTime, ke, vd, micValue) => {
    // Peak = (Dose / (t_inf * Vd * Ke)) * (1 - e^(-Ke * t_inf)) / (1 - e^(-Ke * tau))
    const peak = (dose / (infTime * vd * ke)) * (1 - Math.exp(-ke * infTime)) / (1 - Math.exp(-ke * tau));
    // Trough = Peak * e^(-Ke * (tau - t_inf))
    const trgh = peak * Math.exp(-ke * (tau - infTime));
    // AUC24 = Daily Dose / CL
    const cl = ke * vd;
    const dailyDose = dose * (24 / tau);
    const auc24 = dailyDose / cl;
    const aucMic = auc24 / micValue;
    
    return { peak, trgh, aucMic };
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const a = parseFloat(age);
    const s = parseFloat(scr);
    const t = parseFloat(trough);
    const m = parseFloat(mic);

    if (isNaN(w) || isNaN(a) || isNaN(s) || isNaN(t) || isNaN(m)) {
      addToast('Please enter valid numbers in all fields', 'error');
      return;
    }

    const kg = unit === 'imperial' ? w / 2.20462 : w;
    let crcl = ((140 - a) * kg) / (72 * s);
    if (sex === 'female') crcl *= 0.85;

    const vd = 0.9 * kg;
    const ke = (0.00083 * crcl) + 0.0044;
    const t12 = 0.693 / ke;
    let loadDose = Math.round((20 * kg) / 250) * 250;
    if (loadDose === 0) loadDose = 250; 

    setCoreResult({
      crcl: crcl.toFixed(1),
      vd: vd.toFixed(1),
      ke: ke.toFixed(3),
      t12: t12.toFixed(1),
      loadDose: loadDose,
      raw: { kg, ke, vd, m }
    });

    // Generate Comparison Table for standard frequencies
    const freqs = [8, 12, 24, 36, 48];
    const options = [];
    
    let defaultSelected = null;
    let bestTauError = Infinity;

    freqs.forEach(tau => {
      // Estimate dose to hit target trough using simple bolus model: Dose = Trough * Vd * (1-e^-k*tau) / e^-k*tau
      const expKTau = Math.exp(-ke * tau);
      const rawDose = t * vd * (1 - expKTau) / expKTau;
      let dose = Math.round(rawDose / 250) * 250;
      if (dose < 250) dose = 250;
      
      const infTime = Math.max(1, dose / 1000);
      const profile = calculateDosingProfile(dose, tau, infTime, ke, vd, m);
      
      const option = {
        tau,
        dose,
        infTime,
        aucMic: profile.aucMic.toFixed(0),
        peak: profile.peak.toFixed(1),
        trough: profile.trgh.toFixed(1)
      };
      options.push(option);

      // Simple heuristic to auto-select the best starting regimen (closest to target trough 15)
      const error = Math.abs(profile.trgh - t);
      if (error < bestTauError) {
        bestTauError = error;
        defaultSelected = option;
      }
    });

    setDosingOptions(options);

    if (defaultSelected) {
      handleSelectRegimen(defaultSelected, ke, vd, m);
    }

    axios.post('/api/analytics/track', {
      actionType: 'Calculator',
      details: `Vancomycin Dose calculated for ${a}yo ${sex}, ${kg.toFixed(1)}kg`
    }).catch(err => console.error("Failed to log activity", err));
  };

  const handleSelectRegimen = (option, ke, vd, m) => {
    setSelectedRegimen(option);
    setCustomDose(option.dose.toString());
    setCustomFreq(option.tau.toString());
    setCustomInfTime(option.infTime.toString());
    
    const profile = calculateDosingProfile(option.dose, option.tau, option.infTime, ke, vd, m);
    setCustomResult({
      aucMic: profile.aucMic.toFixed(0),
      peak: profile.peak.toFixed(1),
      trough: profile.trgh.toFixed(1)
    });
  };

  const recalculateCustom = () => {
    if (!coreResult) return;
    const d = parseFloat(customDose);
    const f = parseFloat(customFreq);
    const i = parseFloat(customInfTime);
    
    if (isNaN(d) || isNaN(f) || isNaN(i) || d <= 0 || f <= 0 || i <= 0) {
      addToast('Please enter valid positive numbers for the custom dose', 'error');
      return;
    }
    
    const profile = calculateDosingProfile(d, f, i, coreResult.raw.ke, coreResult.raw.vd, coreResult.raw.m);
    setCustomResult({
      aucMic: profile.aucMic.toFixed(0),
      peak: profile.peak.toFixed(1),
      trough: profile.trgh.toFixed(1)
    });
  };

  const reset = () => {
    setWeight('');
    setAge('');
    setScr('');
    setCoreResult(null);
    setDosingOptions([]);
    setSelectedRegimen(null);
    setCustomResult(null);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-stretch animate-fade-in">
      
      {/* Inputs Section */}
      <div className="xl:w-1/3 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 border-b border-slate-200 dark:border-white/10 pb-2">
          Patient Parameters
        </h3>
        
        <div className="flex flex-col gap-1">
          <label className="text-slate-700 dark:text-slate-300 font-medium text-xs">Unit System</label>
          <select 
            className="glass-input py-2 bg-slate-50 dark:bg-slate-800 text-sm"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="metric">Metric (kg, mg/dL)</option>
            <option value="imperial">Imperial (lbs, mg/dL)</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-slate-700 dark:text-slate-300 font-medium text-xs">Weight</label>
            <div className="flex relative">
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="glass-input w-full pr-10 text-sm" placeholder="70" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">{unit === 'metric' ? 'kg' : 'lbs'}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-slate-700 dark:text-slate-300 font-medium text-xs">Age</label>
            <div className="flex relative">
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="glass-input w-full pr-12 text-sm" placeholder="45" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">years</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-slate-700 dark:text-slate-300 font-medium text-xs">Sex</label>
            <select className="glass-input py-2 bg-slate-50 dark:bg-slate-800 text-sm" value={sex} onChange={(e) => setSex(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-slate-700 dark:text-slate-300 font-medium text-xs">SCr</label>
            <div className="flex relative">
              <input type="number" step="0.1" value={scr} onChange={e => setScr(e.target.value)} className="glass-input w-full pr-14 text-sm" placeholder="1.0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">mg/dL</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-slate-700 dark:text-slate-300 font-medium text-xs">Target Trough</label>
            <div className="flex relative">
              <input type="number" value={trough} onChange={e => setTrough(e.target.value)} className="glass-input w-full pr-12 text-sm border-primary/50 focus:border-primary" placeholder="15" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">mg/L</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-slate-700 dark:text-slate-300 font-medium text-xs">MIC</label>
            <div className="flex relative">
              <input type="number" step="0.1" value={mic} onChange={e => setMic(e.target.value)} className="glass-input w-full pr-16 text-sm" placeholder="1.0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">mcg/mL</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={calculate} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 text-sm">
            Calculate
          </button>
          <button onClick={reset} className="w-12 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl active:scale-95 flex items-center justify-center" title="Reset">
            <RefreshCw size={16} />
          </button>
        </div>
        
        {coreResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-xs flex flex-col gap-2">
            <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-1">
              <span className="text-slate-500">Est. CrCl:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{coreResult.crcl} mL/min</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-1">
              <span className="text-slate-500">Volume (Vd):</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{coreResult.vd} L</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-1">
              <span className="text-slate-500">Ke / t½:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{coreResult.ke} hr⁻¹ / {coreResult.t12} hrs</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Loading Dose:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 rounded">{coreResult.loadDose} mg</span>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="hidden xl:block w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
      <div className="xl:hidden h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent my-1"></div>

      {/* Outputs & Sandbox Section */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Dosing Options Table */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ${dosingOptions.length > 0 ? 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 shadow-lg' : 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent opacity-70'}`}>
          <div className="flex justify-between items-end mb-4 border-b border-slate-200 dark:border-white/10 pb-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Compare Dosing Options
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">Target AUC₂₄: 400-600</span>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
                  <th className="font-medium pb-2 text-left">Freq</th>
                  {dosingOptions.map(opt => (
                    <th key={opt.tau} className="font-bold text-slate-700 dark:text-slate-200 pb-2 min-w-[70px]">q{opt.tau}h</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr>
                  <td className="py-3 text-left font-medium text-slate-600 dark:text-slate-400">Dose (mg)</td>
                  {dosingOptions.map(opt => (
                    <td key={opt.tau} className="py-3 font-mono font-bold text-slate-900 dark:text-white">{opt.dose}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 text-left font-medium text-slate-600 dark:text-slate-400">AUC₂₄/MIC</td>
                  {dosingOptions.map(opt => {
                    const isTarget = opt.aucMic >= 400 && opt.aucMic <= 600;
                    return (
                      <td key={opt.tau} className={`py-3 font-mono font-bold ${isTarget ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {opt.aucMic}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 text-left font-medium text-slate-600 dark:text-slate-400">Peak (mcg/mL)</td>
                  {dosingOptions.map(opt => (
                    <td key={opt.tau} className="py-3 font-mono text-slate-700 dark:text-slate-300">{opt.peak}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 text-left font-medium text-slate-600 dark:text-slate-400">Trough (mcg/mL)</td>
                  {dosingOptions.map(opt => (
                    <td key={opt.tau} className="py-3 font-mono text-slate-700 dark:text-slate-300">{opt.trough}</td>
                  ))}
                </tr>
                <tr>
                  <td className="pt-3 pb-1"></td>
                  {dosingOptions.map(opt => (
                    <td key={opt.tau} className="pt-3 pb-1">
                      <button 
                        onClick={() => handleSelectRegimen(opt, coreResult.raw.ke, coreResult.raw.vd, coreResult.raw.m)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all active:scale-95 ${
                          selectedRegimen?.tau === opt.tau
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {selectedRegimen?.tau === opt.tau ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            {dosingOptions.length === 0 && (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500">Calculate to view dosing options</div>
            )}
          </div>
        </div>

        {/* Sandbox */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row gap-6 ${dosingOptions.length > 0 ? 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 shadow-lg' : 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent opacity-70'}`}>
          
          <div className="flex-1">
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">
              Suggested Dose
            </h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <label className="w-24 text-slate-600 dark:text-slate-400 font-medium text-sm">Dose</label>
                <div className="flex-1 flex relative">
                  <input type="number" value={customDose} onChange={e => setCustomDose(e.target.value)} disabled={!coreResult} className="glass-input w-full pr-10 py-1.5 text-sm font-bold" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">mg</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="w-24 text-slate-600 dark:text-slate-400 font-medium text-sm">Frequency</label>
                <div className="flex-1 flex relative">
                  <input type="number" value={customFreq} onChange={e => setCustomFreq(e.target.value)} disabled={!coreResult} className="glass-input w-full pr-10 py-1.5 text-sm font-bold" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">hrs</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="w-24 text-slate-600 dark:text-slate-400 font-medium text-sm">Infusion Time</label>
                <div className="flex-1 flex relative">
                  <input type="number" step="0.5" value={customInfTime} onChange={e => setCustomInfTime(e.target.value)} disabled={!coreResult} className="glass-input w-full pr-10 py-1.5 text-sm font-bold" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">hrs</span>
                </div>
              </div>
              
              <button 
                onClick={recalculateCustom}
                disabled={!coreResult}
                className="mt-1 w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 rounded-xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play size={14} /> Recalculate
              </button>
            </div>
          </div>

          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

          <div className="flex-1">
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">
              Current Dosing Schedule
            </h3>
            
            <div className="flex flex-col gap-2 text-sm mt-2">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Dose:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {customDose && customFreq ? `${customDose} mg q${customFreq}h` : '--'}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">AUC₂₄/MIC:</span>
                <span className="font-mono font-bold text-primary">
                  {customResult ? `${customResult.aucMic} mcg*hr/mL` : '--'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Peak:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {customResult ? `${customResult.peak} mcg/mL` : '--'}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Trough:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {customResult ? `${customResult.trough} mcg/mL` : '--'}
                </span>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default VancomycinCalculator;
