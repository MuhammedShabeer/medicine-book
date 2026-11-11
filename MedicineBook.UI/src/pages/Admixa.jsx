import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { 
  Syringe, 
  Search, 
  X, 
  AlertTriangle, 
  AlertOctagon, 
  Check, 
  Copy, 
  Printer, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  Clock, 
  Droplets, 
  Thermometer, 
  FlaskConical, 
  ShieldAlert, 
  Package, 
  Sparkles, 
  Edit, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Download, 
  Upload, 
  FileText, 
  Info, 
  Zap, 
  Lock, 
  Dna, 
  Eye, 
  Heart, 
  HeartPulse, 
  Shield, 
  Apple, 
  Biohazard, 
  BookOpen,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  INITIAL_ADMIXA_DRUGS, 
  DRUG_CLASSES, 
  generateBarcodeRects, 
  parseVehicles, 
  extractCernerCodes 
} from '../data/admixaData';

// Class icon helper
const getClassIcon = (drugClass) => {
  switch (drugClass) {
    case 'Antibacterial': return Shield;
    case 'Antifungal': return Sparkles;
    case 'Antiviral': return Activity;
    case 'Anticoagulant': return Heart;
    case 'Electrolyte': return Zap;
    case 'Corticosteroid': return FlaskConical;
    case 'Immunosuppressant': return ShieldAlert;
    case 'Hematologic': return Heart;
    case 'Chemotherapy': return Biohazard;
    case 'Catheter lock': return Lock;
    case 'Monoclonal antibody': return Dna;
    case 'Ophthalmic': return Eye;
    case 'Immunoglobulin': return Shield;
    case 'Vasopressor': return HeartPulse;
    case 'Endocrine': return Syringe;
    case 'Metabolic': return FlaskConical;
    case 'Nutrition': return Apple;
    default: return Syringe;
  }
};

// Render Tall Man lettering in medicine names
const renderTallManName = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  return words.map((word, wIdx) => {
    if (/[a-z]/.test(word) && /[A-Z]{2,}/.test(word)) {
      const parts = word.split(/([A-Z]{2,})/g);
      return (
        <span key={wIdx}>
          {parts.map((p, pIdx) => 
            /[A-Z]{2,}/.test(p) ? (
              <span key={pIdx} className="font-extrabold text-amber-500 dark:text-amber-400">
                {p}
              </span>
            ) : p
          )}{' '}
        </span>
      );
    }
    return word + ' ';
  });
};

// Pure SVG Code 128 Barcode Component
const BarcodeSvg = ({ code, className = "h-10 w-full max-w-[210px]" }) => {
  const { width, rects } = useMemo(() => generateBarcodeRects(code), [code]);
  return (
    <svg 
      viewBox={`0 0 ${width} 50`} 
      preserveAspectRatio="none" 
      className={`${className} fill-current text-slate-800 dark:text-slate-100 select-none`}
      aria-label={`Barcode ${code}`}
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y="0" width={r.width} height="50" />
      ))}
    </svg>
  );
};

// Formats multi-line text with bullets and local policy tags
const formatClinicalText = (text) => {
  if (!text) return <p className="text-slate-400 dark:text-slate-500 italic">Not specified</p>;
  const lines = String(text).split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) return <p className="text-slate-400 dark:text-slate-500 italic">Not specified</p>;

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
      {lines.map((line, idx) => {
        const isBullet = /^[•\-*]\s+/.test(line);
        let content = line.replace(/^[•\-*]\s+/, '');
        const isHgh = /^(HGH(?: policy| product)?)\s*:\s*/i.test(content);
        const hghTag = isHgh ? content.match(/^(HGH(?: policy| product)?)\s*:\s*/i)[1] : null;
        if (isHgh) {
          content = content.replace(/^(HGH(?: policy| product)?)\s*:\s*/i, '');
        }

        return (
          <div key={idx} className={`flex items-start gap-2 ${isBullet ? 'pl-2' : ''}`}>
            {isBullet && <span className="text-primary font-bold mt-1 text-xs">•</span>}
            <div className="flex-1">
              {hghTag && (
                <span className="inline-block mr-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {hghTag}
                </span>
              )}
              <span>{content}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LOCAL_STORAGE_KEY = 'admixa_custom_drugs_v1';

const Admixa = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const isAdmin = user?.roles?.includes('Admin');

  // Load drugs from localStorage or defaults
  const [drugs, setDrugs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse saved admixa drugs:", e);
    }
    return INITIAL_ADMIXA_DRUGS;
  });

  // Save to localStorage when drugs change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drugs));
    } catch (e) {
      console.error("Failed to save admixa drugs:", e);
    }
  }, [drugs]);

  // View state: selectedDrugId (null = list view, id string = detail monograph view)
  const [selectedDrugId, setSelectedDrugId] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All'); // 'All', 'HighAlert', or class name
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Editor Drawer state (Admin)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);

  const searchInputRef = useRef(null);
  const commandInputRef = useRef(null);

  // Keyboard shortcut listener: / or Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && (e.key === 'k' || e.key === 'K')) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsEditorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Unique drug classes list with counts
  const classCounts = useMemo(() => {
    const counts = { All: drugs.length, HighAlert: 0 };
    drugs.forEach(d => {
      if (d.highAlert) counts.HighAlert++;
      if (d.drugClass) {
        counts[d.drugClass] = (counts[d.drugClass] || 0) + 1;
      }
    });
    return counts;
  }, [drugs]);

  const availableClasses = useMemo(() => {
    const classes = Object.keys(classCounts).filter(c => c !== 'All' && c !== 'HighAlert');
    return classes.sort();
  }, [classCounts]);

  // Filtered drugs
  const filteredDrugs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return drugs.filter(drug => {
      // Class/category filter
      if (selectedClass === 'HighAlert' && !drug.highAlert) return false;
      if (selectedClass !== 'All' && selectedClass !== 'HighAlert' && drug.drugClass !== selectedClass) return false;

      // Text search
      if (!q) return true;
      const nameMatch = (drug.name || '').toLowerCase().includes(q);
      const aliasMatch = (drug.aliases || '').toLowerCase().includes(q);
      const classMatch = (drug.drugClass || '').toLowerCase().includes(q);
      const productMatch = (drug.product || '').toLowerCase().includes(q);
      const cernerMatch = (drug.cernerCodes || []).some(c => c.toLowerCase().includes(q));

      return nameMatch || aliasMatch || classMatch || productMatch || cernerMatch;
    });
  }, [drugs, searchQuery, selectedClass]);

  // Selected drug object
  const currentDrug = useMemo(() => {
    if (!selectedDrugId) return null;
    return drugs.find(d => d.id === selectedDrugId) || null;
  }, [drugs, selectedDrugId]);

  // Adjacent drugs for previous/next navigation
  const { prevDrug, nextDrug } = useMemo(() => {
    if (!currentDrug) return { prevDrug: null, nextDrug: null };
    const list = filteredDrugs.length > 0 ? filteredDrugs : drugs;
    const idx = list.findIndex(d => d.id === currentDrug.id);
    return {
      prevDrug: idx > 0 ? list[idx - 1] : null,
      nextDrug: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null
    };
  }, [filteredDrugs, drugs, currentDrug]);

  // Copy Cerner Code helper
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      addToast(`Cerner Item Code ${code} copied!`, 'success');
    } catch {
      addToast(code, 'info');
    }
  };

  // Open Monograph
  const handleOpenDrug = (drug) => {
    setSelectedDrugId(drug.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsCommandPaletteOpen(false);
  };

  // Reset to initial dataset
  const handleResetDefaults = () => {
    if (window.confirm("Reset all Admixa monographs to the verified default dataset (66 medicines)? Any custom edits will be reverted.")) {
      setDrugs(INITIAL_ADMIXA_DRUGS);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      addToast("Admixa reset to default monographs", "info");
    }
  };

  // Export dataset
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(drugs, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `admixa-medicines-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    addToast("Exported medicines dataset", "success");
  };

  // Import dataset
  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported) && imported.length > 0) {
          setDrugs(imported);
          addToast(`Imported ${imported.length} medicine monographs!`, 'success');
        } else {
          addToast("Invalid JSON format for medicines", "error");
        }
      } catch (err) {
        addToast("Error parsing JSON file", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Admin: Open editor to Add
  const handleAddDrug = () => {
    setEditingDrug({
      id: `drug-${Date.now()}`,
      name: '',
      form: 'Injection',
      drugClass: 'Antibacterial',
      highAlert: false,
      cernerCodes: [],
      product: '',
      maxConc: '',
      storage: '',
      reconstitution: '',
      diluents: 'NS, D5W',
      dilution: '',
      rate: '',
      stability: '',
      comments: '',
      extra: [],
      aliases: '',
      references: [],
      reviewNote: 'Compiled monograph',
      lastReviewed: new Date().toISOString().slice(0, 10)
    });
    setIsEditorOpen(true);
  };

  // Admin: Open editor to Edit
  const handleEditDrug = (drug) => {
    setEditingDrug(JSON.parse(JSON.stringify(drug)));
    setIsEditorOpen(true);
  };

  // Admin: Save Drug (Create or Update)
  const handleSaveDrug = (e) => {
    e.preventDefault();
    if (!editingDrug || !editingDrug.name.trim()) {
      addToast("Medicine name is required", "error");
      return;
    }

    // Auto-derive Cerner codes from product field if not provided
    const foundCodes = extractCernerCodes(editingDrug.product);
    const updatedCodes = editingDrug.cernerCodes && editingDrug.cernerCodes.length > 0
      ? editingDrug.cernerCodes
      : foundCodes;

    const savedRecord = {
      ...editingDrug,
      cernerCodes: updatedCodes,
      updatedAt: new Date().toISOString()
    };

    const exists = drugs.some(d => d.id === savedRecord.id);
    let newDrugsList;
    if (exists) {
      newDrugsList = drugs.map(d => d.id === savedRecord.id ? savedRecord : d);
      addToast(`Updated ${savedRecord.name}`, 'success');
    } else {
      newDrugsList = [savedRecord, ...drugs];
      addToast(`Added ${savedRecord.name}`, 'success');
    }

    setDrugs(newDrugsList);
    setIsEditorOpen(false);
    setSelectedDrugId(savedRecord.id);
  };

  // Admin: Delete Drug
  const handleDeleteDrug = (drugId) => {
    const toDel = drugs.find(d => d.id === drugId);
    if (!toDel) return;
    if (window.confirm(`Are you sure you want to delete "${toDel.name}"? This action cannot be undone.`)) {
      setDrugs(drugs.filter(d => d.id !== drugId));
      setIsEditorOpen(false);
      setSelectedDrugId(null);
      addToast(`Deleted ${toDel.name}`, 'info');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16">
      
      {/* Print-only CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #admixa-print-area, #admixa-print-area * {
            visibility: visible;
          }
          #admixa-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* =========================================================================
          TOP HERO HEADER CARD
         ========================================================================= */}
      <div className="no-print bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-500/25">
                <Syringe size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                  Admixa
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    IV &amp; Injectable Guide
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Cleanroom preparation protocols: reconstitution, vehicle compatibility, dilution, and stability
                </p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-3xl text-sm leading-relaxed">
              Standardized parenteral monographs compiled by Sayyid Muhammed. Checked against FDA Prescribing Information, UK SmPCs, and the ASHP Handbook on Injectable Drugs (Trissel's).
            </p>
          </div>

          {/* Quick Stat Badges & Actions */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-sm border border-slate-200 dark:border-white/10 flex items-center gap-1.5">
                <Syringe size={14} />
                <strong>{drugs.length}</strong> Medicines
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <strong>{classCounts.HighAlert || 0}</strong> High Alert
              </span>
            </div>

            {/* Quick Command Palette Button */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary border border-slate-200 dark:border-white/10 shadow-sm hover:shadow transition-all text-xs font-bold"
              title="Quick Search (Ctrl+K or /)"
            >
              <Search size={15} />
              <span className="hidden sm:inline">Find Medicine</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-600">
                Ctrl K
              </kbd>
            </button>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAddDrug}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all text-xs font-bold"
                >
                  <Plus size={15} />
                  <span>Add Medicine</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary border border-slate-200 dark:border-white/10 shadow-sm transition-all"
                  title="Export JSON"
                >
                  <Download size={15} />
                </button>

                <label 
                  className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary border border-slate-200 dark:border-white/10 shadow-sm transition-all cursor-pointer"
                  title="Import JSON"
                >
                  <Upload size={15} />
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-white/10 shadow-sm transition-all"
                  title="Reset to 66 Defaults"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW A: SINGLE MONOGRAPH DETAIL VIEW
         ========================================================================= */}
      {currentDrug ? (
        <div id="admixa-print-area" className="flex flex-col gap-6">
          
          {/* Back Navigation & Controls */}
          <div className="no-print flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setSelectedDrugId(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary border border-slate-200 dark:border-white/10 text-xs font-bold shadow-sm transition-all"
            >
              <ArrowLeft size={16} />
              <span>Back to all medicines</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary border border-slate-200 dark:border-white/10 text-xs font-bold shadow-sm transition-all"
              >
                <Printer size={15} />
                <span>Print Monograph</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleEditDrug(currentDrug)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-primary text-white hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/20 transition-all"
                >
                  <Edit size={15} />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Monograph Top Hero Banner */}
          {(() => {
            const classConfig = DRUG_CLASSES[currentDrug.drugClass] || {
              gradient: 'from-slate-600 to-slate-800',
              badge: 'bg-slate-100 text-slate-800'
            };
            const isChemo = /chemo|cytotox/i.test((currentDrug.form || '') + ' ' + (currentDrug.drugClass || ''));
            const codes = (currentDrug.cernerCodes && currentDrug.cernerCodes.length > 0)
              ? currentDrug.cernerCodes
              : extractCernerCodes(currentDrug.product);

            return (
              <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-white/10">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20 backdrop-blur">
                        {currentDrug.drugClass}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/10">
                        {currentDrug.form || 'Injection'}
                      </span>
                      {currentDrug.highAlert && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/90 text-white border border-rose-400 shadow-md shadow-rose-900/50">
                          <AlertTriangle size={13} />
                          High-Alert Medicine
                        </span>
                      )}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                      {renderTallManName(currentDrug.name)}
                    </h2>

                    {currentDrug.aliases && (
                      <p className="text-slate-300 text-sm mt-1.5 font-medium">
                        Also known as <strong className="text-white">{currentDrug.aliases}</strong>
                      </p>
                    )}
                  </div>

                  {/* Primary Cerner Barcode Preview in Header */}
                  {codes.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center gap-2 shrink-0">
                      <BarcodeSvg code={codes[0]} className="h-10 w-44 text-white" />
                      <button
                        type="button"
                        onClick={() => handleCopyCode(codes[0])}
                        className="text-[11px] font-mono text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
                        title="Click to copy Cerner code"
                      >
                        <Copy size={12} />
                        <span>Cerner: {codes[0]}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Quick Metrics Bar (4 Cards) */}
          {(() => {
            const vehiclesList = parseVehicles(currentDrug.diluents);
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Max Final Concentration */}
                <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shrink-0">
                    <FlaskConical size={22} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Max Concentration
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate block mt-0.5">
                      {currentDrug.maxConc ? currentDrug.maxConc.split('\n')[0] : '—'}
                    </span>
                  </div>
                </div>

                {/* 2. Infuse Over / Administration */}
                <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 shrink-0">
                    <Clock size={22} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Infuse Over / Rate
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate block mt-0.5">
                      {currentDrug.rate ? currentDrug.rate.split(/[\n;]/)[0] : '—'}
                    </span>
                  </div>
                </div>

                {/* 3. Compatible Vehicles */}
                <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shrink-0">
                    <Droplets size={22} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Compatible Vehicles
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {vehiclesList.length > 0 ? (
                        vehiclesList.slice(0, 3).map((v, i) => (
                          <span
                            key={i}
                            className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                              v.type === 'prohibited'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {v.label}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 truncate">{currentDrug.diluents || '—'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Stability */}
                <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
                    <Thermometer size={22} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Stability / BUD
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate block mt-0.5">
                      {currentDrug.stability ? currentDrug.stability.split(/[\n;.]/)[0] : '—'}
                    </span>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* Safety & Reference Banners */}
          <div className="flex flex-col gap-3">
            {currentDrug.highAlert && (
              <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 text-rose-950 dark:text-rose-200 flex items-start gap-3">
                <AlertOctagon size={20} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <strong className="font-bold">High-Alert Medication: </strong>
                  Requires an independent double-check before dispensing and administering to prevent medication errors.
                </div>
              </div>
            )}

            {/chemo|cytotox/i.test((currentDrug.form || '') + ' ' + (currentDrug.drugClass || '')) && (
              <div className="p-4 rounded-2xl bg-purple-50/90 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-900/60 text-purple-950 dark:text-purple-200 flex items-start gap-3">
                <Biohazard size={20} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <strong className="font-bold">Cytotoxic — Hazardous Drug: </strong>
                  Prepare inside a certified biological safety cabinet (BSC) or isolator with chemotherapy PPE and a closed-system drug-transfer device (CSTD).
                </div>
              </div>
            )}

            {currentDrug.reviewNote && (
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-950 dark:text-blue-200 flex items-start gap-2.5 text-xs">
                <Check size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Reference Verification: </strong>
                  {currentDrug.reviewNote}
                </span>
              </div>
            )}
          </div>

          {/* Main Monograph 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (8 cols): Step-by-Step Preparation & Clinical Content */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Preparation & Administration Step Flow */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
                  <Syringe size={20} className="text-primary" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Preparation &amp; Administration Flow
                  </h3>
                </div>

                <div className="flex flex-col gap-6">
                  
                  {/* Step 1: Reconstitution */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
                        <span>Reconstitution</span>
                      </h4>
                      {formatClinicalText(currentDrug.reconstitution || 'Not needed. Ready-to-use liquid solution.')}
                    </div>
                  </div>

                  {/* Step 2: Compatible Vehicles */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
                        <span>Compatible Vehicles &amp; Infusion Solutions</span>
                      </h4>
                      
                      {/* Visual Vehicle Badges */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {parseVehicles(currentDrug.diluents).map((v, i) => (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              v.type === 'prohibited'
                                ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            }`}
                          >
                            <Droplets size={12} />
                            <span>{v.label}</span>
                            {v.note && <span className="text-[10px] opacity-75 font-normal">({v.note})</span>}
                          </span>
                        ))}
                      </div>

                      {formatClinicalText(currentDrug.diluents)}
                    </div>
                  </div>

                  {/* Step 3: Dilution / Final Volume */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      3
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
                        <span>Dilution &amp; Final Volume</span>
                      </h4>
                      {formatClinicalText(currentDrug.dilution)}
                    </div>
                  </div>

                  {/* Step 4: Infuse Over / Administration Rate */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      4
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
                        <span>Infuse Over / Administration Rate</span>
                      </h4>
                      {formatClinicalText(currentDrug.rate)}
                    </div>
                  </div>

                  {/* Step 5: Stability & Storage */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      5
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
                        <span>Stability &amp; Beyond-Use Date (BUD)</span>
                      </h4>
                      {formatClinicalText(currentDrug.stability)}
                    </div>
                  </div>

                </div>
              </div>

              {/* Extra Sections (if any) */}
              {currentDrug.extra && currentDrug.extra.length > 0 && (
                <div className="flex flex-col gap-4">
                  {currentDrug.extra.map((sec, sIdx) => (
                    <div key={sIdx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                      <h4 className="text-md font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <Info size={18} className="text-primary" />
                        <span>{sec.label}</span>
                      </h4>
                      {formatClinicalText(sec.value)}
                    </div>
                  ))}
                </div>
              )}

              {/* Clinical Notes and Precautions */}
              {currentDrug.comments && (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <AlertTriangle size={18} />
                    <span>Clinical Notes &amp; Precautions</span>
                  </div>
                  {formatClinicalText(currentDrug.comments)}
                </div>
              )}

              {/* References List */}
              {currentDrug.references && currentDrug.references.length > 0 && (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold text-sm">
                    <BookOpen size={18} className="text-primary" />
                    <span>References &amp; Product Information</span>
                  </div>
                  <ul className="space-y-2">
                    {currentDrug.references.map((ref, rIdx) => (
                      <li key={rIdx} className="text-xs flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{ref.title}</span>
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-bold shrink-0"
                          >
                            <span>Open</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pager: Previous & Next Medicine */}
              <div className="no-print flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                {prevDrug ? (
                  <button
                    type="button"
                    onClick={() => handleOpenDrug(prevDrug)}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary border border-slate-200 dark:border-white/10 shadow-sm transition-all text-xs font-bold text-left"
                  >
                    <ChevronLeft size={16} />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Previous</span>
                      <span>{prevDrug.name}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextDrug ? (
                  <button
                    type="button"
                    onClick={() => handleOpenDrug(nextDrug)}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary border border-slate-200 dark:border-white/10 shadow-sm transition-all text-xs font-bold text-right"
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Next</span>
                      <span>{nextDrug.name}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                ) : <div />}
              </div>

            </div>

            {/* Right Column (4 cols): Product Formulation & Barcodes Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Product Formulation & Cerner Barcodes */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10 font-bold text-sm text-slate-900 dark:text-white">
                  <Package size={18} className="text-primary" />
                  <span>Item &amp; Formulation</span>
                </div>

                <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                  {formatClinicalText(currentDrug.product)}
                </div>

                {/* Cerner Scannable Barcodes */}
                <div className="mt-2 flex flex-col gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Cerner Barcodes
                  </span>
                  {(() => {
                    const codes = (currentDrug.cernerCodes && currentDrug.cernerCodes.length > 0)
                      ? currentDrug.cernerCodes
                      : extractCernerCodes(currentDrug.product);

                    if (!codes.length) {
                      return <p className="text-xs text-slate-400 italic">No Cerner item numbers on file</p>;
                    }

                    return codes.map(code => (
                      <div key={code} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex flex-col items-center gap-2">
                        <BarcodeSvg code={code} className="h-9 w-full max-w-[200px]" />
                        <div className="flex items-center justify-between w-full pt-1 border-t border-slate-200/60 dark:border-white/5 text-xs">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(code)}
                            className="inline-flex items-center gap-1 text-primary hover:underline text-[11px] font-semibold"
                          >
                            <Copy size={12} />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Storage of Intact Product */}
              {currentDrug.storage && (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10 font-bold text-sm text-slate-900 dark:text-white">
                    <Thermometer size={18} className="text-teal-600" />
                    <span>Storage of Intact Product</span>
                  </div>
                  {formatClinicalText(currentDrug.storage)}
                </div>
              )}

              {/* Metadata Card */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={15} />
                  <span>Reviewed: <strong>{currentDrug.lastReviewed || 'Verified'}</strong></span>
                </div>
                {currentDrug.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Clock size={15} />
                    <span>Last Updated: <strong>{new Date(currentDrug.updatedAt).toLocaleDateString()}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText size={15} />
                  <span>Compiled by <strong>Sayyid Muhammed</strong></span>
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW B: MEDICINES CATALOG / LIST VIEW
           ========================================================================= */
        <div className="flex flex-col gap-6">
          
          {/* Search Bar & Filter Strip */}
          <div className="flex flex-col gap-4">
            
            {/* Live Search Input */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search generic name, Tazocin, Augmentin, KCl, or 10-digit Cerner code..."
                className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
                  /
                </kbd>
              </div>
            </div>

            {/* Filter Chips Horizontal Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              
              {/* All Filter */}
              <button
                type="button"
                onClick={() => setSelectedClass('All')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedClass === 'All'
                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
                }`}
              >
                <span>All Medicines</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedClass === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  {classCounts.All}
                </span>
              </button>

              {/* High Alert Filter */}
              <button
                type="button"
                onClick={() => setSelectedClass('HighAlert')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedClass === 'HighAlert'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50/50'
                }`}
              >
                <AlertTriangle size={13} />
                <span>High Alert</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedClass === 'HighAlert' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950'
                }`}>
                  {classCounts.HighAlert || 0}
                </span>
              </button>

              {/* Class Specific Filters */}
              {availableClasses.map(clsName => {
                const isSelected = selectedClass === clsName;
                const IconComponent = getClassIcon(clsName);
                return (
                  <button
                    key={clsName}
                    type="button"
                    onClick={() => setSelectedClass(clsName)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent size={13} />
                    <span>{clsName}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      {classCounts[clsName]}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

          {/* Results Summary & Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              {searchQuery
                ? `Showing ${filteredDrugs.length} ${filteredDrugs.length === 1 ? 'match' : 'matches'} for "${searchQuery}"`
                : `${selectedClass === 'All' ? 'All Medicines' : selectedClass} · ${filteredDrugs.length} monographs`}
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-primary hover:underline font-semibold"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Medicines Cards Grid */}
          {filteredDrugs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDrugs.map(drug => {
                const classConfig = DRUG_CLASSES[drug.drugClass] || {
                  gradient: 'from-slate-600 to-slate-800',
                  badge: 'bg-slate-100 text-slate-800 border-slate-200'
                };
                const IconComponent = getClassIcon(drug.drugClass);
                const vehiclesList = parseVehicles(drug.diluents);
                const codes = (drug.cernerCodes && drug.cernerCodes.length > 0)
                  ? drug.cernerCodes
                  : extractCernerCodes(drug.product);

                return (
                  <div
                    key={drug.id}
                    onClick={() => handleOpenDrug(drug)}
                    className="group flex flex-col justify-between p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 hover:border-primary/60 dark:hover:border-primary/60 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${classConfig.badge}`}>
                          <IconComponent size={12} />
                          <span>{drug.drugClass}</span>
                        </span>

                        {drug.highAlert && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            <AlertTriangle size={11} />
                            High Alert
                          </span>
                        )}
                      </div>

                      {/* Medicine Name with Tall Man */}
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                        {renderTallManName(drug.name)}
                      </h3>

                      {/* Aliases & Brands */}
                      {drug.aliases && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {drug.aliases}
                        </p>
                      )}

                      {/* Quick Monograph Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {/* Infuse over rate */}
                        {drug.rate && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {drug.rate.split(/[\n;]/)[0]}
                          </span>
                        )}

                        {/* Max concentration */}
                        {drug.maxConc && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {drug.maxConc.split('\n')[0]}
                          </span>
                        )}

                        {/* Primary Vehicles */}
                        {vehiclesList.slice(0, 2).map((v, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              v.type === 'prohibited'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {v.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 dark:border-white/5 text-xs">
                      {codes.length > 0 ? (
                        <span className="font-mono text-slate-400 dark:text-slate-500">
                          Cerner: {codes[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">Monograph</span>
                      )}

                      <span className="inline-flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                        <span>View</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                No medicines match your search
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                Try typing a generic drug name (e.g. Vancomycin), a brand name (e.g. Tazocin), an abbreviation (e.g. KCl), or a 10-digit Cerner item number.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedClass('All');
                }}
                className="mt-2 px-4 py-2 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          COMMAND PALETTE SEARCH MODAL (Ctrl+K or /)
         ========================================================================= */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Search Input */}
            <div className="relative border-b border-slate-200 dark:border-white/10 p-4 flex items-center gap-3">
              <Search size={20} className="text-slate-400 shrink-0" />
              <input
                ref={commandInputRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Admixa medicines by generic, brand, abbreviation, or Cerner number..."
                className="w-full bg-transparent text-sm md:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(false)}
                className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Esc
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-white/5">
              {filteredDrugs.length > 0 ? (
                filteredDrugs.slice(0, 15).map(drug => (
                  <button
                    key={drug.id}
                    type="button"
                    onClick={() => handleOpenDrug(drug)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{drug.name}</span>
                        {drug.highAlert && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-rose-500 text-white">
                            High Alert
                          </span>
                        )}
                      </div>
                      {drug.aliases && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          {drug.aliases}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {drug.drugClass}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching medicines found for "{searchQuery}".
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-400 px-4">
              <span>Press <kbd className="font-mono bg-white dark:bg-slate-700 px-1 py-0.5 rounded">Esc</kbd> to exit</span>
              <span>Showing up to 15 results</span>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          ADMIN EDIT / ADD MONOGRAPH DRAWER
         ========================================================================= */}
      {isEditorOpen && editingDrug && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingDrug.name ? `Edit: ${editingDrug.name}` : 'Add New Medicine'}
                </h3>
                <p className="text-xs text-slate-500">
                  Monograph details will be updated across the Admixa IV guide.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Form Body */}
            <form onSubmit={handleSaveDrug} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs md:text-sm">
              
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine Name &amp; Strength *
                </label>
                <input
                  type="text"
                  required
                  value={editingDrug.name}
                  onChange={e => setEditingDrug({ ...editingDrug, name: e.target.value })}
                  placeholder="e.g. Vancomycin 500 mg (vial)"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Drug Class
                  </label>
                  <select
                    value={editingDrug.drugClass}
                    onChange={e => setEditingDrug({ ...editingDrug, drugClass: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                  >
                    {availableClasses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dosage Form
                  </label>
                  <input
                    type="text"
                    value={editingDrug.form || ''}
                    onChange={e => setEditingDrug({ ...editingDrug, form: e.target.value })}
                    placeholder="Injection, Infusion, Eye drop"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDrug.highAlert || false}
                    onChange={e => setEditingDrug({ ...editingDrug, highAlert: e.target.checked })}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span>Mark as High-Alert Medicine</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brand Names &amp; Aliases
                </label>
                <input
                  type="text"
                  value={editingDrug.aliases || ''}
                  onChange={e => setEditingDrug({ ...editingDrug, aliases: e.target.value })}
                  placeholder="e.g. Tazocin, Zosyn"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product / Item Formulation (include Cerner item 89...)
                </label>
                <textarea
                  rows={2}
                  value={editingDrug.product || ''}
                  onChange={e => setEditingDrug({ ...editingDrug, product: e.target.value })}
                  placeholder="500 mg (vial); Item No on Cerner: 8900001234"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reconstitution
                </label>
                <textarea
                  rows={2}
                  value={editingDrug.reconstitution || ''}
                  onChange={e => setEditingDrug({ ...editingDrug, reconstitution: e.target.value })}
                  placeholder="Reconstitute with 10 mL of SWFI to yield 50 mg/mL."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Compatible Vehicles
                </label>
                <input
                  type="text"
                  value={editingDrug.diluents || ''}
                  onChange={e => setEditingDrug({ ...editingDrug, diluents: e.target.value })}
                  placeholder="NS, D5W, LR (or write 'Incompatible with normal saline')"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dilution &amp; Final Volume
                </label>
                <textarea
                  rows={2}
                  value={editingDrug.dilution || ''}
                  onChange={e => setEditingDrug({ ...editingDrug, dilution: e.target.value })}
                  placeholder="Dilute in 100 mL to 250 mL of compatible fluid."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Infuse Over / Administration Rate
                </label>
                <input
                  type="text"
                  value={editingDrug.rate || ''}
                  onChange={e => setEditingDrug({ ...editingDrug, rate: e.target.value })}
                  placeholder="Infuse over 60 minutes (not faster than 10 mg/min)"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Stability after Preparation (BUD)
                </label>
                <textarea
                  rows={2}
                  value={editingDrug.stability || ''}
                  onChange={e => setEditingDrug({ ...editingDrug, stability: e.target.value })}
                  placeholder="24 hours room temperature, 14 days refrigerated."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Notes &amp; Precautions
                </label>
                <textarea
                  rows={3}
                  value={editingDrug.comments || ''}
                  onChange={e => setEditingDrug({ ...editingDrug, comments: e.target.value })}
                  placeholder="• Red man syndrome if infused too fast.&#10;HGH: Monitor trough levels before 4th dose."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              {/* Drawer Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                {editingDrug.id && drugs.some(d => d.id === editingDrug.id) ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteDrug(editingDrug.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-bold transition-colors"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Admixa;
