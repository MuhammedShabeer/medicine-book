import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Beaker, Syringe } from 'lucide-react';
import AlligationCalculator from '../components/calculators/AlligationCalculator';
import VancomycinCalculator from '../components/calculators/VancomycinCalculator';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState('alligation');

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl mb-2 text-slate-900 dark:text-white flex items-center gap-3">
            <CalculatorIcon className="text-primary" size={36} /> 
            Clinical Calculators
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Essential tools for pharmacy and clinical dosing</p>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-10 max-w-5xl mx-auto">
        
        {/* Tabs Bar */}
        <div className="flex p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('alligation')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'alligation' 
                ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Beaker size={18} />
            Alligation Calculator
          </button>
          
          <button
            onClick={() => setActiveTab('vancomycin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'vancomycin' 
                ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Syringe size={18} />
            Vancomycin Calculator
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'alligation' && <AlligationCalculator />}
          {activeTab === 'vancomycin' && <VancomycinCalculator />}
        </div>

      </div>
    </div>
  );
};

export default Calculator;
