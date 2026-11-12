import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  INITIAL_ADMIXA_DRUGS, 
  DRUG_CLASSES, 
  generateBarcodeRects, 
  parseVehicles, 
  extractCernerCodes 
} from '../data/admixaData';
import { E3 } from '../data/admixaIcons';

const getIcon = (name, className = '') => {
  const src = E3[name];
  if (!src) return null;
  return <img className={`e3 ${className}`} src={src} alt="" aria-hidden="true" />;
};
import './admixa.css';

// Class visual definitions from Admixa template
const CLASS_META = {
  Antibacterial: { g: 'linear-gradient(135deg,#A78BFA,#8B5CF6 45%,#EC4899)', s: '#B149E0', e: 'bacteria' },
  Antifungal: { g: 'linear-gradient(135deg,#C084FC,#9333EA)', s: '#9333EA', e: 'mushroom' },
  Antiviral: { g: 'linear-gradient(135deg,#7C3AED,#3730A3 50%,#0F172A)', s: '#7C3AED', e: 'virus' },
  Anticoagulant: { g: 'linear-gradient(135deg,#FB7185,#E11D48)', s: '#E11D48', e: 'blood' },
  Electrolyte: { g: 'linear-gradient(135deg,#FDBA74,#F97316 50%,#EC4899)', s: '#F97316', e: 'sparkles' },
  Corticosteroid: { g: 'linear-gradient(135deg,#FCD34D,#F59E0B)', s: '#F59E0B', e: 'testtube' },
  Immunosuppressant: { g: 'linear-gradient(135deg,#F0ABFC,#D946EF 50%,#8B5CF6)', s: '#D946EF', e: 'shield' },
  Hematologic: { g: 'linear-gradient(135deg,#F87171,#DC2626 50%,#991B1B)', s: '#DC2626', e: 'blood' },
  Chemotherapy: { g: 'linear-gradient(135deg,#C084FC,#7E22CE 55%,#581C87)', s: '#7E22CE', e: 'biohazard' },
  'Catheter lock': { g: 'linear-gradient(135deg,#6EE7B7,#10B981 50%,#0F766E)', s: '#10B981', e: 'lock' },
  'Monoclonal antibody': { g: 'linear-gradient(135deg,#A5B4FC,#6366F1 50%,#4338CA)', s: '#6366F1', e: 'dna' },
  Ophthalmic: { g: 'linear-gradient(135deg,#5EEAD4,#06B6D4 50%,#3B82F6)', s: '#06B6D4', e: 'eye' },
  Immunoglobulin: { g: 'linear-gradient(135deg,#FDE68A,#F59E0B 50%,#B45309)', s: '#D97706', e: 'shield' },
  Vasopressor: { g: 'linear-gradient(135deg,#FDA4AF,#E11D48 50%,#9F1239)', s: '#E11D48', e: 'heart' },
  Endocrine: { g: 'linear-gradient(135deg,#7DD3FC,#0EA5E9 50%,#0369A1)', s: '#0EA5E9', e: 'syringe' },
  Metabolic: { g: 'linear-gradient(135deg,#99F6E4,#14B8A6 50%,#0F766E)', s: '#14B8A6', e: 'alembic' },
  Nutrition: { g: 'linear-gradient(135deg,#BEF264,#65A30D 55%,#3F6212)', s: '#65A30D', e: 'apple' }
};

const getClassMeta = (drugClass) => {
  return CLASS_META[drugClass] || { g: 'linear-gradient(135deg,#94A3B8,#64748B)', s: '#64748B', e: 'syringe' };
};

const CLASS_NAMES = Object.keys(CLASS_META);

const HIGH_ALERT_META = { g: 'linear-gradient(135deg,#FB923C,#F43F5E 55%,#BE123C)', s: '#F43F5E', e: 'warning' };

const getDrugLook = (d) => {
  if (/chemo|cytotox/i.test((d.form || '') + ' ' + (d.drugClass || ''))) return getClassMeta('Chemotherapy');
  if (d.highAlert) return HIGH_ALERT_META;
  return getClassMeta(d.drugClass);
};

const isChemo = (d) => /chemo|cytotox/i.test((d.form || '') + ' ' + (d.drugClass || ''));
const isLock = (d) => /lock/i.test((d.form || '') + ' ' + (d.drugClass || ''));
const isOph = (d) => /eye|ophthal|intravitreal|intracameral|subconjunctival/i.test((d.form || '') + ' ' + (d.drugClass || ''));

const shortFirstLine = (text) => {
  if (!text) return '';
  return String(text).split('\n')[0].replace(/\((label|SmPC|US label)\)\.?/gi, '').replace(/^HGH(?: policy)?:\s*/, '').trim();
};

const shortVehicles = (diluents) => {
  if (!diluents) return '';
  const first = String(diluents).split('\n')[0];
  const v = [];
  if (/\b(NS|0\.9%|saline)\b/i.test(first) && !/no saline|saline incompat/i.test(first)) v.push('NS');
  if (/\b(D5W|5% dextrose|glucose)\b/i.test(first) && !/no dextrose|dextrose incompat/i.test(first)) v.push('D5W');
  if (/\b(LR|Hartmann|Ringer)\b/i.test(first)) v.push('LR');
  if (/\b(SWFI|sterile water)\b/i.test(first)) v.push('SWFI');
  if (!v.length && /saline only/i.test(first)) return 'NS only';
  if (!v.length && /glucose only|dextrose only/i.test(first)) return 'D5W only';
  return v.join(' · ');
};

const Admixa = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles?.includes('Admin');

  // Drugs state with localStorage persistence
  const [drugs, setDrugs] = useState(() => {
    try {
      const saved = localStorage.getItem('admixa_custom_drugs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved Admixa drugs:', e);
    }
    return INITIAL_ADMIXA_DRUGS;
  });

  const saveDrugsToStorage = (updated) => {
    setDrugs(updated);
    try {
      localStorage.setItem('admixa_custom_drugs', JSON.stringify(updated));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  };

  // View state: 'home', 'drug', 'analytics'
  const [view, setView] = useState(routeId ? 'drug' : 'home');
  const [selectedDrugId, setSelectedDrugId] = useState(routeId || null);

  // Sync route param with state
  useEffect(() => {
    if (routeId) {
      setSelectedDrugId(routeId);
      setView('drug');
    } else {
      setSelectedDrugId(null);
      setView('home');
    }
  }, [routeId]);

  // Filtering & Search
  const [q, setQ] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [canEdit, setCanEdit] = useState(false);

  // UI state
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [palQ, setPalQ] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const showToast = (message, icon = 'check') => {
    setToastMsg({ message, icon });
    setTimeout(() => setToastMsg(null), 2400);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        document.getElementById('admixa-main-q')?.focus();
      } else if (e.key === 'Escape') {
        setIsPaletteOpen(false);
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered results
  const filteredDrugs = useMemo(() => {
    let list = drugs;
    if (selectedFilter !== 'All') {
      if (selectedFilter === 'High alert') {
        list = list.filter(d => d.highAlert);
      } else {
        list = list.filter(d => d.drugClass === selectedFilter);
      }
    }

    if (!q.trim()) {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    }

    const term = q.trim().toLowerCase();
    return list.filter(d => {
      const name = (d.name || '').toLowerCase();
      const aliases = (d.aliases || '').toLowerCase();
      const drugClass = (d.drugClass || '').toLowerCase();
      const product = (d.product || '').toLowerCase();
      const cerner = (d.cernerCodes || []).join(' ');
      return name.includes(term) || aliases.includes(term) || drugClass.includes(term) || product.includes(term) || cerner.includes(term);
    }).sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(term);
      const bStarts = b.name.toLowerCase().startsWith(term);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [drugs, selectedFilter, q]);

  // Palette results
  const paletteResults = useMemo(() => {
    if (!palQ.trim()) return drugs.slice(0, 10);
    const term = palQ.trim().toLowerCase();
    return drugs.filter(d => {
      const name = (d.name || '').toLowerCase();
      const aliases = (d.aliases || '').toLowerCase();
      const cerner = (d.cernerCodes || []).join(' ');
      return name.includes(term) || aliases.includes(term) || cerner.includes(term);
    }).slice(0, 15);
  }, [drugs, palQ]);

  // Selected drug object
  const currentDrug = useMemo(() => {
    if (!selectedDrugId) return null;
    return drugs.find(d => d.id === selectedDrugId) || null;
  }, [drugs, selectedDrugId]);

  // Open drug view
  const handleOpenDrug = (drug) => {
    setSelectedDrugId(drug.id);
    setView('drug');
    navigate('/admixa/' + drug.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to list
  const handleBackToList = () => {
    setSelectedDrugId(null);
    setView('home');
    navigate('/admixa');
  };

  // Copy Cerner Code
  const handleCopyCerner = (code, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Cerner code ${code} copied!`, 'clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Drawer Edit Drug
  const handleStartEdit = (drug) => {
    setEditingDrug({ ...drug });
    setIsDrawerOpen(true);
  };

  // Drawer Add Drug
  const handleStartAdd = () => {
    setEditingDrug({
      id: 'custom-' + Date.now(),
      name: '',
      aliases: '',
      drugClass: 'Antibacterial',
      highAlert: false,
      product: '',
      maxConc: '',
      storage: '',
      reconstitution: '',
      diluents: '',
      dilution: '',
      rate: '',
      stability: '',
      comments: '',
      references: ['FDA Label', 'ASHP Handbook on Injectable Drugs'],
      lastReviewed: new Date().toISOString()
    });
    setIsDrawerOpen(true);
  };

  // Drawer Save
  const handleSaveDrug = (e) => {
    e.preventDefault();
    if (!editingDrug || !editingDrug.name.trim()) return;

    const updatedDrug = {
      ...editingDrug,
      cernerCodes: extractCernerCodes(editingDrug.product)
    };

    const exists = drugs.some(d => d.id === updatedDrug.id);
    let newDrugs;
    if (exists) {
      newDrugs = drugs.map(d => d.id === updatedDrug.id ? updatedDrug : d);
      showToast(`Updated ${updatedDrug.name}`, 'check');
    } else {
      newDrugs = [updatedDrug, ...drugs];
      showToast(`Added ${updatedDrug.name}`, 'check');
    }
    saveDrugsToStorage(newDrugs);
    setIsDrawerOpen(false);
    if (selectedDrugId === updatedDrug.id) {
      setSelectedDrugId(updatedDrug.id);
    }
  };

  // Drawer Delete
  const handleDeleteDrug = () => {
    if (!editingDrug) return;
    if (confirm(`Delete ${editingDrug.name} from monographs?`)) {
      const newDrugs = drugs.filter(d => d.id !== editingDrug.id);
      saveDrugsToStorage(newDrugs);
      setIsDrawerOpen(false);
      showToast(`Deleted ${editingDrug.name}`, 'trash2');
      if (selectedDrugId === editingDrug.id) {
        handleBackToList();
      }
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (confirm('Reset all Admixa monographs to default bundled list? Any custom edits will be reverted.')) {
      localStorage.removeItem('admixa_custom_drugs');
      setDrugs(INITIAL_ADMIXA_DRUGS);
      showToast('Reset to 66 default monographs', 'refresh');
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(drugs, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `admixa_monographs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Exported monograph JSON', 'floppy');
  };

  // Class counts for sidebar
  const classCounts = useMemo(() => {
    const map = {};
    drugs.forEach(d => {
      map[d.drugClass] = (map[d.drugClass] || 0) + 1;
    });
    return map;
  }, [drugs]);

  const highAlertCount = useMemo(() => drugs.filter(d => d.highAlert).length, [drugs]);

  return (
    <div className="admixa-page">
      <div className="shell">
        
        {/* Left Side Navigation */}
        <aside className="side">
          <button className="logo" onClick={() => { setSelectedDrugId(null); setView('home'); }}>
            <span className="logo-mark">
              {getIcon('syringe')}
            </span>
            <span>
              <b className="gtext">Admixa</b>
              <small>IV &amp; injectable guide</small>
            </span>
          </button>

          <div className="nav-l">Browse</div>
          <div id="sideNav">
            <button 
              className="nv" 
              aria-current={view === 'home' && selectedFilter === 'All'}
              onClick={() => { setSelectedFilter('All'); setView('home'); setSelectedDrugId(null); }}
            >
              {getIcon('syringe')}
              All medicines
              <span className="n">{drugs.length}</span>
            </button>

            <button 
              className="nv" 
              aria-current={view === 'home' && selectedFilter === 'High alert'}
              onClick={() => { setSelectedFilter('High alert'); setView('home'); setSelectedDrugId(null); }}
            >
              {getIcon('warning')}
              High alert
              <span className="n">{highAlertCount}</span>
            </button>

            {CLASS_NAMES.filter(c => classCounts[c]).map(c => {
              const meta = getClassMeta(c);
              return (
                <button
                  key={c}
                  className="nv"
                  aria-current={view === 'home' && selectedFilter === c}
                  onClick={() => { setSelectedFilter(c); setView('home'); setSelectedDrugId(null); }}
                >
                  {getIcon(meta.e)}
                  {c}
                  <span className="n">{classCounts[c]}</span>
                </button>
              );
            })}
          </div>

          <div className="side-foot">
            Monographs compiled by Sayyid Muhammed. Checked against FDA labels, UK SmPCs and ASHP.
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main">
          
          {/* Topbar */}
          <header className="topbar">
            <button className="mlogo" onClick={handleBackToList}>
              <span className="logo-mark">{getIcon('syringe')}</span>
              <span className="gtext">Admixa</span>
            </button>

            <button className="qbtn" onClick={() => setIsPaletteOpen(true)}>
              {getIcon('search')}
              <span>Find a medicine</span>
              <kbd>Ctrl K</kbd>
            </button>

            <span className="sp"></span>

            <span id="topActions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <a 
                href="/admixa/index.html" 
                target="_blank" 
                rel="noreferrer" 
                className="pillbtn sm" 
                title="Open standalone web version in a new tab"
              >
                {getIcon('desktop')}
                <span>Standalone</span>
              </a>

              {isAdmin && (
                <>
                  <button 
                    className="pillbtn sm" 
                    onClick={handleStartAdd} 
                    title="Add a new IV monograph"
                  >
                    {getIcon('pill')}
                    <span>Add medicine</span>
                  </button>

                  <button 
                    className="pillbtn sm" 
                    onClick={handleExportJSON} 
                    title="Export JSON backup"
                  >
                    {getIcon('floppy')}
                    <span>Export</span>
                  </button>

                  <button 
                    className={`pillbtn sm ${canEdit ? 'on' : ''}`} 
                    onClick={() => { setCanEdit(!canEdit); showToast(canEdit ? 'Edit mode disabled' : 'Edit mode active', 'lock'); }}
                  >
                    {getIcon('pencil')}
                    <span>{canEdit ? 'Editing ON' : 'Edit mode'}</span>
                  </button>
                </>
              )}
            </span>
          </header>

          {/* View Container */}
          <main className="content" id="app">
            
            {/* VIEW 1: HOME LIST */}
            {view === 'home' && (
              <>
                {/* Hero Section */}
                <section className="hero">
                  <div className="hero-in">
                    <div>
                      <h1>Admixa</h1>
                      <p>
                        Your IV &amp; injectable preparation guide: reconstitution, vehicles, final volumes, infusion times and stability for every injectable prepared in the IV room.
                      </p>
                      
                      {/* Search Field */}
                      <div className="field">
                        {getIcon('search')}
                        <input 
                          id="admixa-main-q"
                          type="search" 
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                          placeholder="Search vancomycin, Tazocin, KCl or 8900002009" 
                          autoComplete="off" 
                          spellCheck="false" 
                          aria-label="Search medicines"
                        />
                        <div className="end">
                          {q && (
                            <button className="clr" onClick={() => setQ('')} aria-label="Clear search">
                              ✕
                            </button>
                          )}
                          <kbd>/</kbd>
                        </div>
                      </div>

                      {/* Floating Hero Stats */}
                      <div className="hero-stats">
                        <span className="hs">
                          {getIcon('syringe')}
                          <b>{drugs.length}</b> medicines
                        </span>
                        <span className="hs">
                          {getIcon('warning')}
                          <b>{highAlertCount}</b> high alert
                        </span>
                        <span className="hs">
                          {getIcon('books')}
                          <b>{drugs.length}</b> referenced
                        </span>
                      </div>
                    </div>

                    {/* 3D Floating Art */}
                    <div className="hero-art">
                      {getIcon('syringe', 'a1')}
                      {getIcon('pill', 'a2')}
                      {getIcon('droplet', 'a3')}
                    </div>
                  </div>
                </section>

                {/* Filter Chips */}
                <div className="filters">
                  <button 
                    className="chip" 
                    aria-pressed={selectedFilter === 'All'}
                    onClick={() => setSelectedFilter('All')}
                  >
                    <span className="dot" style={{ background: 'var(--grad)' }}></span>
                    All <small>{drugs.length}</small>
                  </button>

                  <button 
                    className="chip ha" 
                    aria-pressed={selectedFilter === 'High alert'}
                    onClick={() => setSelectedFilter('High alert')}
                  >
                    <span className="dot"></span>
                    High alert <small>{highAlertCount}</small>
                  </button>

                  {CLASS_NAMES.filter(c => classCounts[c]).map(c => {
                    const meta = getClassMeta(c);
                    return (
                      <button
                        key={c}
                        className="chip"
                        aria-pressed={selectedFilter === c}
                        onClick={() => setSelectedFilter(c)}
                      >
                        <span className="dot" style={{ background: meta.g }}></span>
                        {c} <small>{classCounts[c]}</small>
                      </button>
                    );
                  })}
                </div>

                {/* Counter Label */}
                <div id="cnt" style={{ margin: '14px 4px 10px', fontSize: '13.5px', color: 'var(--ink-3)', fontWeight: 600 }}>
                  {q 
                    ? `${filteredDrugs.length} ${filteredDrugs.length === 1 ? 'match' : 'matches'} for "${q}"`
                    : `${selectedFilter === 'All' ? 'All medicines' : selectedFilter} · ${filteredDrugs.length}`}
                </div>

                {/* Medicine Cards Grid */}
                {filteredDrugs.length === 0 ? (
                  <div className="empty">
                    {getIcon('search')}
                    <h3>Nothing matches "{q}"</h3>
                    Try the generic name, a brand such as Tazocin, an abbreviation such as KCl, or a Cerner number.
                  </div>
                ) : (
                  <div className="grid" id="grid">
                    {filteredDrugs.map((d) => {
                      const L = getDrugLook(d);
                      const conc = shortFirstLine(d.maxConc);
                      const rate = shortFirstLine(d.rate);
                      const v = shortVehicles(d.diluents);

                      return (
                        <button 
                          key={d.id} 
                          className="mcard" 
                          onClick={() => handleOpenDrug(d)}
                        >
                          <span className="tile" style={{ '--g': L.g, '--gs': L.s }}>
                            {getIcon(L.e)}
                          </span>

                          <span style={{ minWidth: 0 }}>
                            <span className="mname">{d.name}</span>
                            {d.aliases && <div className="malias">{d.aliases}</div>}
                            <span className="tags">
                              {d.highAlert ? (
                                <span className="tag ha">High alert</span>
                              ) : (
                                <span className="tag">{d.drugClass}</span>
                              )}
                              {v && <span className="tag">{v}</span>}
                              {rate && rate.length < 26 && <span className="tag">{rate}</span>}
                              {conc && conc.length < 22 && <span className="tag">{conc}</span>}
                            </span>
                          </span>

                          <span className="go">
                            <svg className="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* VIEW 2: MONOGRAPH DETAIL */}
            {view === 'drug' && currentDrug && (() => {
              const d = currentDrug;
              const L = getDrugLook(d);
              const codes = (d.cernerCodes && d.cernerCodes.length) ? d.cernerCodes : extractCernerCodes(d.product);
              const oph = isOph(d);
              const lock = isLock(d);
              const vehicles = parseVehicles(d.diluents);

              // Step definitions matching app.js
              const steps = [
                {
                  key: 'reconstitution',
                  label: 'Reconstitute',
                  icon: 'syringe',
                  color: '#EDE4FF',
                  content: d.reconstitution
                },
                {
                  key: 'diluents',
                  label: 'Choose vehicle',
                  icon: 'droplet',
                  color: '#E0F2FE',
                  content: d.diluents,
                  vehicles: vehicles
                },
                {
                  key: 'dilution',
                  label: lock ? 'Prepare lock solution' : oph ? 'Dilute to final concentration' : 'Dilute to final volume',
                  icon: 'testtube',
                  color: '#FCE7F3',
                  content: d.dilution
                },
                {
                  key: 'rate',
                  label: lock ? 'Instil and dwell' : oph ? 'Administer' : 'Infuse over',
                  icon: lock ? 'lock' : oph ? 'eye' : 'stopwatch',
                  color: '#FEF3C7',
                  content: d.rate
                },
                {
                  key: 'stability',
                  label: 'Storage and beyond-use date',
                  icon: 'thermometer',
                  color: '#DCFCE7',
                  content: d.stability
                }
              ].filter(st => String(st.content || '').trim());

              // Navigation between medicines
              const currentIndex = filteredDrugs.findIndex(x => x.id === d.id);
              const prevDrug = currentIndex > 0 ? filteredDrugs[currentIndex - 1] : null;
              const nextDrug = currentIndex >= 0 && currentIndex < filteredDrugs.length - 1 ? filteredDrugs[currentIndex + 1] : null;

              return (
                <div className="mono">
                  {/* Back button */}
                  <button className="back" onClick={handleBackToList}>
                    <svg className="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                    All medicines
                  </button>

                  {/* Drug Hero Banner */}
                  <section className={`dhero ${d.highAlert && !isChemo(d) ? 'ha' : ''}`} style={{ '--g': L.g, '--gs': L.s }}>
                    <div className="dh-in">
                      <div>
                        <div className="dh-k">
                          <span>{d.drugClass}</span>
                          <span>{d.form || 'Injection'}</span>
                          {d.highAlert && (
                            <span className="warn">
                              {getIcon('warning')}
                              High-alert medicine
                            </span>
                          )}
                        </div>
                        <h1>{d.name}</h1>
                        {d.aliases && <p className="aka">Also known as {d.aliases}</p>}
                      </div>
                      <div className="dh-art">
                        {getIcon(isChemo(d) ? 'biohazard' : d.highAlert ? 'warning' : 'syringe', 'x1')}
                        {getIcon(L.e === 'syringe' ? 'droplet' : L.e, 'x2')}
                      </div>
                    </div>
                  </section>

                  {/* Quick Stat Tiles */}
                  <div className="stats">
                    <div className="stat" title={d.maxConc || ''}>
                      <span className="tile" style={{ '--g': 'linear-gradient(135deg,#C084FC,#8B5CF6)' }}>
                        {getIcon('testtube')}
                      </span>
                      <dl style={{ margin: 0, minWidth: 0 }}>
                        <dt>Max final concentration</dt>
                        <dd>{shortFirstLine(d.maxConc) || '—'}</dd>
                      </dl>
                    </div>

                    <div className="stat" title={d.rate || ''}>
                      <span className="tile" style={{ '--g': 'linear-gradient(135deg,#FCD34D,#F97316)' }}>
                        {getIcon(lock ? 'lock' : oph ? 'eye' : 'stopwatch')}
                      </span>
                      <dl style={{ margin: 0, minWidth: 0 }}>
                        <dt>{lock ? 'Dwell' : oph ? 'Administration' : 'Infuse over'}</dt>
                        <dd>{shortFirstLine(d.rate) || '—'}</dd>
                      </dl>
                    </div>

                    <div className="stat" title={d.diluents || ''}>
                      <span className="tile" style={{ '--g': 'linear-gradient(135deg,#60A5FA,#3B82F6)' }}>
                        {getIcon('droplet')}
                      </span>
                      <dl style={{ margin: 0, minWidth: 0 }}>
                        <dt>Vehicles</dt>
                        <dd>{shortVehicles(d.diluents) || 'See monograph'}</dd>
                      </dl>
                    </div>

                    <div className="stat" title={d.stability || ''}>
                      <span className="tile" style={{ '--g': 'linear-gradient(135deg,#34D399,#059669)' }}>
                        {getIcon('thermometer')}
                      </span>
                      <dl style={{ margin: 0, minWidth: 0 }}>
                        <dt>Beyond-use date</dt>
                        <dd>{shortFirstLine(d.stability) || 'See monograph'}</dd>
                      </dl>
                    </div>
                  </div>

                  {/* Monograph Two-Column Layout */}
                  <div className="layout">
                    
                    {/* Left Column: Flow & Details */}
                    <div>
                      {/* Product Formulation & Cerner Barcodes */}
                      <section className="card">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, margin: '0 0 12px' }}>
                          {getIcon('package')}
                          Item &amp; Formulation
                        </h2>
                        
                        <div style={{ whiteSpace: 'pre-line', color: 'var(--ink-2)', fontSize: '15px' }}>
                          {d.product || 'Standard injectable formulation.'}
                        </div>

                        {d.storage && (
                          <div style={{ marginTop: '12px', fontSize: '13.5px', color: 'var(--ink-3)' }}>
                            <b>Intact vial storage:</b> {d.storage}
                          </div>
                        )}

                        {/* Cerner Code 128 Barcodes */}
                        {codes.length > 0 && (
                          <div className="bcode" style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-3)' }}>
                                Cerner Barcode ({codes.length})
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Scannable Code 128</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {codes.map((code) => {
                                const barcodeData = generateBarcodeRects(code);
                                const rects = barcodeData.rects || [];
                                return (
                                  <div 
                                    key={code} 
                                    style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '14px', 
                                      padding: '10px 14px', 
                                      borderRadius: '12px', 
                                      background: 'var(--soft)',
                                      border: '1px solid var(--line)'
                                    }}
                                  >
                                    <div style={{ width: '130px', height: '44px', background: '#fff', padding: '3px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <svg viewBox={`0 0 ${barcodeData.width || 150} 50`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                                        {rects.map((r, ri) => (
                                          <rect key={ri} x={r.x} y="0" width={r.width} height="50" fill="#000" />
                                        ))}
                                      </svg>
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '16px', letterSpacing: '0.04em' }}>
                                        {code}
                                      </div>
                                      <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Bedside verification</div>
                                    </div>

                                    <button 
                                      className="pillbtn sm" 
                                      onClick={(e) => handleCopyCerner(code, e)}
                                      title="Copy Cerner code"
                                    >
                                      {copiedCode === code ? getIcon('check') : getIcon('clipboard')}
                                      <span>{copiedCode === code ? 'Copied' : 'Copy'}</span>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </section>

                      {/* 5 Preparation Steps Flow */}
                      <section className="steps">
                        {steps.map((st, idx) => (
                          <div key={st.key} className="step">
                            <div className="s-n" style={{ background: st.color }}>
                              {getIcon(st.icon)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700 }}>
                                {idx + 1}. {st.label}
                              </h3>

                              {/* Special vehicle pills rendering for choose vehicle step */}
                              {st.key === 'diluents' && vehicles && vehicles.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0 10px' }}>
                                  {vehicles.map((v, vi) => (
                                    <span key={vi} className={`vb ${v.type === 'compatible' ? 'ok' : 'no'}`}>
                                      {v.label}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div style={{ whiteSpace: 'pre-line', color: 'var(--ink-2)', fontSize: '15px' }}>
                                {st.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </section>

                      {/* Clinical Notes & Precautions */}
                      {d.comments && (
                        <section className="notes card">
                          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, margin: '0 0 12px' }}>
                            {getIcon('bulb')}
                            Clinical Notes &amp; Precautions
                          </h2>
                          <div style={{ whiteSpace: 'pre-line', color: 'var(--ink-2)', fontSize: '15px' }}>
                            {d.comments}
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Right Column: Actions & References */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      
                      {/* Action Tools */}
                      <div className="card">
                        <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700 }}>Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button className="pillbtn" onClick={() => window.print()}>
                            {getIcon('camera')}
                            <span>Print monograph</span>
                          </button>

                          {codes[0] && (
                            <button className="pillbtn" onClick={(e) => handleCopyCerner(codes[0], e)}>
                              {getIcon('clipboard')}
                              <span>Copy Cerner ({codes[0]})</span>
                            </button>
                          )}

                          {(canEdit || isAdmin) && (
                            <button className="pillbtn on" onClick={() => handleStartEdit(d)}>
                              {getIcon('pencil')}
                              <span>Edit monograph</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Safety Overview */}
                      <div className="card">
                        <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700 }}>Safety Checklist</h3>
                        <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: 'var(--ink-2)' }}>
                          {d.highAlert && (
                            <li style={{ color: 'var(--red)', fontWeight: 600 }}>
                              Requires independent double check before administration.
                            </li>
                          )}
                          {isChemo(d) && (
                            <li style={{ color: 'var(--p1)', fontWeight: 600 }}>
                              Hazardous cytotoxic medication: wear chemo PPE &amp; use closed transfer.
                            </li>
                          )}
                          <li>Check vial reconstitution clarity prior to final dilution.</li>
                          <li>Verify patient ID and Cerner barcode scan at bedside.</li>
                        </ul>
                      </div>

                      {/* References & Review */}
                      <div className="card" style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '8px' }}>
                          {getIcon('books')}
                          References
                        </div>
                        <ul style={{ margin: '0 0 12px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {(d.references || ['FDA Product Label', 'ASHP Handbook on Injectable Drugs', 'UK Electronic Medicines Compendium (SmPC)']).map((r, ri) => (
                            <li key={ri}>{r}</li>
                          ))}
                        </ul>

                        {d.lastReviewed && (
                          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--line)' }}>
                            <b>Last reviewed:</b> {new Date(d.lastReviewed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Previous / Next Pager */}
                  <div className="pager" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
                    {prevDrug ? (
                      <button className="pillbtn" onClick={() => handleOpenDrug(prevDrug)}>
                        <svg className="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        <span>{prevDrug.name}</span>
                      </button>
                    ) : <div />}

                    {nextDrug ? (
                      <button className="pillbtn" onClick={() => handleOpenDrug(nextDrug)}>
                        <span>{nextDrug.name}</span>
                        <svg className="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    ) : <div />}
                  </div>

                </div>
              );
            })()}

          </main>
        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="toast show">
          {getIcon(toastMsg.icon)}
          <span>{toastMsg.message}</span>
        </div>
      )}

      {/* SEARCH COMMAND PALETTE MODAL */}
      {isPaletteOpen && (
        <>
          <div className="pscrim" onClick={() => setIsPaletteOpen(false)}></div>
          <div className="pal" role="dialog" aria-label="Search medicines">
            <div className="field">
              {getIcon('search')}
              <input 
                id="palQ"
                type="search" 
                value={palQ}
                onChange={(e) => setPalQ(e.target.value)}
                placeholder="Name, brand, abbreviation or Cerner number" 
                autoComplete="off" 
                spellCheck="false" 
                autoFocus
              />
              <div className="end">
                <kbd className="kb-only">Esc</kbd>
                <button className="pclose" onClick={() => setIsPaletteOpen(false)}>Cancel</button>
              </div>
            </div>

            <div className="pres">
              {paletteResults.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-3)' }}>
                  No medicines match "{palQ}"
                </div>
              ) : (
                paletteResults.map((d) => {
                  const L = getDrugLook(d);
                  return (
                    <button 
                      key={d.id} 
                      className="mcard"
                      style={{ borderRadius: '12px', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                      onClick={() => {
                        setIsPaletteOpen(false);
                        handleOpenDrug(d);
                      }}
                    >
                      <span className="tile" style={{ '--g': L.g, '--gs': L.s, width: '40px', height: '40px' }}>
                        {getIcon(L.e)}
                      </span>
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span className="mname" style={{ fontSize: '15px' }}>{d.name}</span>
                        {d.aliases && <div className="malias" style={{ fontSize: '12.5px' }}>{d.aliases}</div>}
                      </span>
                      <span className="go">
                        <svg className="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="pfoot kb-only">
              <span>↑ ↓ move</span>
              <span>Enter open</span>
              <span>Esc close</span>
            </div>
          </div>
        </>
      )}

      {/* ADMIN EDIT / ADD DRAWER */}
      {isDrawerOpen && editingDrug && (
        <>
          <div className="scrim" onClick={() => setIsDrawerOpen(false)}></div>
          <aside className="drawer" aria-hidden="false">
            <div className="dr-h">
              {getIcon('pencil')}
              <div style={{ flex: 1 }}>
                <h3 id="drT">{editingDrug.id?.startsWith('custom-') ? 'Add new medicine' : 'Edit medicine'}</h3>
                <p>Change any value and save. Monographs persist in your browser and sync locally.</p>
              </div>
              <button className="ib" onClick={() => setIsDrawerOpen(false)} aria-label="Close editor">
                <svg className="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <form className="dr-b" onSubmit={handleSaveDrug}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Generic Name (Tall Man Lettering)
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={editingDrug.name} 
                    onChange={e => setEditingDrug({ ...editingDrug, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Brand Aliases / Trade Names
                  </label>
                  <input 
                    type="text" 
                    value={editingDrug.aliases || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, aliases: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                      Drug Class
                    </label>
                    <select 
                      value={editingDrug.drugClass} 
                      onChange={e => setEditingDrug({ ...editingDrug, drugClass: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                    >
                      {CLASS_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '22px' }}>
                    <input 
                      type="checkbox" 
                      id="ha_check"
                      checked={editingDrug.highAlert || false} 
                      onChange={e => setEditingDrug({ ...editingDrug, highAlert: e.target.checked })}
                      style={{ width: '20px', height: '20px', accentColor: '#8B5CF6' }}
                    />
                    <label htmlFor="ha_check" style={{ fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                      High-Alert Drug
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Product formulation &amp; Cerner Numbers
                  </label>
                  <textarea 
                    rows={3}
                    value={editingDrug.product || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, product: e.target.value })}
                    placeholder="Include 10-digit Cerner number like 8900002009..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Max Concentration
                  </label>
                  <input 
                    type="text" 
                    value={editingDrug.maxConc || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, maxConc: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Reconstitution Protocol
                  </label>
                  <textarea 
                    rows={2}
                    value={editingDrug.reconstitution || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, reconstitution: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Compatible Infusion Vehicles
                  </label>
                  <input 
                    type="text" 
                    value={editingDrug.diluents || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, diluents: e.target.value })}
                    placeholder="e.g. Compatible with NS 0.9%, D5W. Incompatible with LR."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Dilution &amp; Final Volume
                  </label>
                  <textarea 
                    rows={2}
                    value={editingDrug.dilution || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, dilution: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Infusion Rate / Administration
                  </label>
                  <textarea 
                    rows={2}
                    value={editingDrug.rate || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, rate: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Stability &amp; Storage (BUD)
                  </label>
                  <textarea 
                    rows={2}
                    value={editingDrug.stability || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, stability: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
                    Clinical Notes &amp; Precautions
                  </label>
                  <textarea 
                    rows={3}
                    value={editingDrug.comments || ''} 
                    onChange={e => setEditingDrug({ ...editingDrug, comments: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--card)' }}
                  />
                </div>
              </div>

              <div className="dr-f">
                {!editingDrug.id?.startsWith('custom-') ? (
                  <button type="button" className="pillbtn sm danger" onClick={handleDeleteDrug}>
                    {getIcon('trash2')}
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="pillbtn sm" onClick={() => setIsDrawerOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="pillbtn sm on">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </aside>
        </>
      )}

    </div>
  );
};

export default Admixa;
