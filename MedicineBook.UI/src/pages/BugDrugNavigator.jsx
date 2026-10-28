import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Pill, 
  Grid, 
  ClipboardList, 
  History, 
  BookOpen, 
  Search, 
  AlertTriangle, 
  Info, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  Filter,
  Activity,
  Layers,
  HelpCircle,
  Bug,
  Dna,
  FileText,
  AlertOctagon,
  Clock,
  ChevronRight
} from 'lucide-react';
import {
  FAMILIES,
  FAMILY_ORDER,
  ORGANISMS_BASE,
  ORGANISMS_2026_ADDITIONS,
  ORGANISMS_BY_ID,
  SHORT_NAMES,
  DRUGS_BASE,
  DRUGS_2026,
  GROUPS,
  GROUP_ORDER,
  SOURCES,
  CHANGES_2026,
  NEW_DRUGS_2026,
  EXTRA_2026,
  ORG_NOTES_2026,
  KEY_POINTS,
  REFERENCES,
  REF_NUMBERS,
  AWARE_MAP,
  PHARMACIST_NOTES,
  KEY_GAPS,
  TOOLKIT_DATA,
  getOrganisms,
  getDrugs,
  getFamilyOrder,
  getOrganismName,
  getOrganismSubtitle,
  getShortName,
  getDrugsForOrganism,
  getCoverageValue,
  getCoverageText,
  getPharmacistNotes,
  getGapsForDrug
} from '../data/bugDrugData';

const GROUP_ICONS = {
  bac: ShieldAlert,
  fun: Sparkles,
  vir: Activity,
  myc: FileText,
  par: Bug
};

const BugDrugNavigator = () => {
  // Active anti-infective group: 'bac', 'fun', 'vir', 'myc', 'par'
  const [selectedGroup, setSelectedGroup] = useState('bac');
  
  // Antibacterial version: '2026' or '2019'
  const [version, setVersion] = useState('2026');
  
  // Active view tab: 'bug', 'drug', 'map', 'tk', 'chg', 'ref'
  const [activeTab, setActiveTab] = useState('bug');

  // Track selected organism and drug per group so user choices persist when toggling groups
  const [selectionsByGroup, setSelectionsByGroup] = useState({
    bac: { orgId: 'space', drugName: 'Meropenem/imipenem/doripenem' },
    fun: { orgId: 'calb', drugName: 'Caspofungin / micafungin / anidulafungin' },
    vir: { orgId: 'cmv', drugName: 'Ganciclovir / valganciclovir' },
    myc: { orgId: 'tbds', drugName: 'Rifampicin (R)' },
    par: { orgId: 'pfu', drugName: 'Artemether-lumefantrine' }
  });

  // Search queries
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [changeSearchQuery, setChangeSearchQuery] = useState('');
  const [glossarySearchQuery, setGlossarySearchQuery] = useState('');

  // Matrix cell tooltip state
  const [hoveredMatrixCell, setHoveredMatrixCell] = useState(null);

  // Group metadata
  const currentGroupConfig = GROUPS[selectedGroup] || GROUPS.bac;
  const isBac = selectedGroup === 'bac';

  // Current selections for active group
  const currentOrgId = selectionsByGroup[selectedGroup]?.orgId || (isBac ? 'space' : currentGroupConfig.first?.org);
  const currentDrugName = selectionsByGroup[selectedGroup]?.drugName || (isBac ? 'Meropenem/imipenem/doripenem' : currentGroupConfig.first?.drug);

  // Switch organism selection
  const handleSelectOrg = (orgId) => {
    setSelectionsByGroup(prev => ({
      ...prev,
      [selectedGroup]: {
        ...prev[selectedGroup],
        orgId
      }
    }));
  };

  // Switch drug selection
  const handleSelectDrug = (drugName) => {
    setSelectionsByGroup(prev => ({
      ...prev,
      [selectedGroup]: {
        ...prev[selectedGroup],
        drugName
      }
    }));
  };

  // Switch anti-infective group
  const handleSelectGroup = (groupId) => {
    if (groupId === selectedGroup) return;
    setSelectedGroup(groupId);
    setDrugSearchQuery('');
    setHoveredMatrixCell(null);
  };

  // Active dataset for current group and version
  const currentOrganisms = useMemo(() => getOrganisms(selectedGroup, version), [selectedGroup, version]);
  const currentDrugs = useMemo(() => getDrugs(selectedGroup, version), [selectedGroup, version]);
  const orgById = useMemo(() => Object.fromEntries(currentOrganisms.map(o => [o.id, o])), [currentOrganisms]);

  // Selected organism object
  const currentOrg = orgById[currentOrgId] || currentOrganisms[0];

  // Active drugs for current organism
  const drugsForSelectedOrg = useMemo(() => {
    if (!currentOrg) return [];
    return currentDrugs.filter(d => d.cov && d.cov[currentOrg.id]);
  }, [currentDrugs, currentOrg]);

  // Group drugs for current organism by class
  const drugsGroupedByClass = useMemo(() => {
    const groups = {};
    drugsForSelectedOrg.forEach(d => {
      if (!groups[d.c]) groups[d.c] = [];
      groups[d.c].push(d);
    });
    return groups;
  }, [drugsForSelectedOrg]);

  // Removed drugs for selected organism in 2026 antibacterial update
  const removedDrugsForOrg = useMemo(() => {
    if (!isBac || version !== '2026' || !currentOrg) return [];
    return DRUGS_2026.filter(d => d.chg && d.chg[currentOrg.id] && d.chg[currentOrg.id].act === 'remove');
  }, [isBac, version, currentOrg]);

  // Selected drug object
  const currentDrug = useMemo(() => {
    const found = currentDrugs.find(d => d.n === currentDrugName);
    return found || currentDrugs[0];
  }, [currentDrugs, currentDrugName]);

  // Filtered drug list for Tab 2
  const filteredDrugs = useMemo(() => {
    const q = drugSearchQuery.trim().toLowerCase();
    if (!q) return currentDrugs;
    return currentDrugs.filter(d => 
      d.n.toLowerCase().includes(q) || 
      d.c.toLowerCase().includes(q)
    );
  }, [currentDrugs, drugSearchQuery]);

  // Group filtered drugs by class for sidebar
  const filteredDrugsByClass = useMemo(() => {
    const grouped = {};
    filteredDrugs.forEach(d => {
      if (!grouped[d.c]) grouped[d.c] = [];
      grouped[d.c].push(d);
    });
    return grouped;
  }, [filteredDrugs]);

  // Filtered changes for Tab 5
  const filteredChanges = useMemo(() => {
    const q = changeSearchQuery.trim().toLowerCase();
    return CHANGES_2026.filter(([dn, o, act, t]) => 
      !q || dn.toLowerCase().includes(q) || (SHORT_NAMES[o] || '').toLowerCase().includes(q) || t.toLowerCase().includes(q)
    );
  }, [changeSearchQuery]);

  // Filtered key current guidance points for Tab 5
  const filteredKeyPoints = useMemo(() => {
    const q = changeSearchQuery.trim().toLowerCase();
    return KEY_POINTS.filter(([sec, topic, text]) => 
      !q || sec.toLowerCase().includes(q) || topic.toLowerCase().includes(q) || text.toLowerCase().includes(q)
    );
  }, [changeSearchQuery]);

  // Filtered glossary for Tab 4
  const filteredGlossary = useMemo(() => {
    const q = glossarySearchQuery.trim().toLowerCase();
    return TOOLKIT_DATA.glossary.filter(([term, def]) => 
      !q || term.toLowerCase().includes(q) || def.toLowerCase().includes(q)
    );
  }, [glossarySearchQuery]);

  // Active family order for current group
  const activeFamilyOrder = useMemo(() => getFamilyOrder(selectedGroup), [selectedGroup]);

  // Helper to render reference citation badge with link to references tab
  const renderCite = (key) => {
    const num = REF_NUMBERS[key];
    if (!num) return null;
    const ref = REFERENCES[num - 1];
    return (
      <button 
        key={key} 
        type="button"
        onClick={() => {
          setActiveTab('ref');
          setTimeout(() => {
            const el = document.getElementById(`ref-item-${key}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }}
        title={ref ? ref[1] : key}
        className="inline-flex items-center ml-1 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-950/70 hover:bg-violet-200 dark:hover:bg-violet-900 border border-violet-200 dark:border-violet-800 rounded transition-colors"
      >
        [{num}]
      </button>
    );
  };

  const renderCites = (keys) => {
    if (!keys) return null;
    if (!Array.isArray(keys)) return renderCite(keys);
    return keys.map(k => renderCite(k));
  };

  // Helper for coverage badges on drug items
  const renderCoverageBadges = (covVal, tag) => {
    if (!covVal && !tag) return null;
    const isPreferred = typeof covVal === 'object' && covVal.p;
    const isQual = typeof covVal === 'object' && covVal.q;
    const cites = typeof covVal === 'object' && covVal.r;

    return (
      <div className="flex flex-wrap items-center gap-1.5 mt-1">
        {isPreferred && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {covVal.p}
          </span>
        )}
        {(isQual || tag) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            {isQual ? covVal.q : tag}
          </span>
        )}
        {cites && renderCites(cites)}
      </div>
    );
  };

  // Pharmacist clinical notes for current drug
  const drugNotes = useMemo(() => {
    if (!currentDrug) return {};
    return getPharmacistNotes(currentDrug.n, selectedGroup);
  }, [currentDrug, selectedGroup]);

  // Uncovered gaps for current drug
  const uncoveredGaps = useMemo(() => {
    if (!currentDrug) return [];
    return getGapsForDrug(currentDrug, selectedGroup, version);
  }, [currentDrug, selectedGroup, version]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16">
      
      {/* Top Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-violet-600 via-indigo-600 to-rose-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                  Spectra
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Clinical Navigator
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Comprehensive Antimicrobial & Anti-Infective Decision Support Tool
                </p>
              </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-3xl text-sm leading-relaxed">
              {currentGroupConfig.intro}
            </p>
          </div>

          {/* Right Action: Antibacterial Version Switcher */}
          {isBac && (
            <div className="flex flex-col items-end gap-1.5 shrink-0 self-stretch sm:self-auto">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pl-2 pr-1">Version:</span>
                <button
                  type="button"
                  onClick={() => setVersion('2026')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    version === '2026'
                      ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-sm border border-slate-200 dark:border-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  2026 update
                </button>
                <button
                  type="button"
                  onClick={() => setVersion('2019')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    version === '2019'
                      ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Original 2019
                </button>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 text-right">
                {version === '2026' ? 'IDSA 2026 · CDC · AHFS verified' : 'McCormack & Lalji (UBC 2019)'}
              </span>
            </div>
          )}
        </div>

        {/* Drug Group Selector Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Drug Group:
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {GROUP_ORDER.map(gKey => {
              const grp = GROUPS[gKey];
              const isSelected = selectedGroup === gKey;
              const IconComponent = GROUP_ICONS[gKey] || Pill;
              return (
                <button
                  key={gKey}
                  type="button"
                  onClick={() => handleSelectGroup(gKey)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                      : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  <IconComponent size={16} className={isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                  <span>{grp.label}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {gKey === 'bac' ? (version === '2026' ? '28' : '20') : grp.orgs.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Color Legend */}
        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/5 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Spectrum Legend:</span>
          {isBac ? (
            <>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3.5 h-3.5 rounded-full bg-violet-600 dark:bg-violet-400 inline-block"></span>
                <span>Gram-positive</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 dark:bg-rose-400 inline-block"></span>
                <span>Gram-negative</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-600 dark:bg-amber-400 inline-block"></span>
                <span>Anaerobes</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3.5 h-3.5 rounded-full bg-teal-600 dark:bg-teal-400 inline-block"></span>
                <span>Atypicals / Spirochaetes</span>
              </div>
              {version === '2026' && (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500 text-white">2026</span>
                  <span>Updated against current guidelines</span>
                </div>
              )}
            </>
          ) : (
            <>
              {currentGroupConfig.fams.map(fKey => {
                const fam = FAMILIES[fKey];
                return (
                  <div key={fKey} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className={`w-3.5 h-3.5 rounded-full ${fam?.theme?.dot || 'bg-slate-500'} inline-block`}></span>
                    <span>{fam?.name || fKey}</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  First line
                </span>
                <span>Preferred</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Limit
                </span>
                <span>Limitation / specific use</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* View Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-white/10 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('bug')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'bug'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bug size={17} />
          <span>{currentGroupConfig.pick}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drug')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'drug'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Pill size={17} />
          <span>{currentGroupConfig.pickd}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'map'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Grid size={17} />
          <span>Full coverage map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'tk'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ClipboardList size={17} />
          <span>Pharmacist toolkit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chg')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'chg'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History size={17} />
          <span>What changed</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ref')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'ref'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen size={17} />
          <span>References ({REFERENCES.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PICK A PATHOGEN / ORGANISM
         ========================================================================= */}
      {activeTab === 'bug' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Pathogen Selector Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-4 shadow-sm max-h-[820px] overflow-y-auto">
            {activeFamilyOrder.map(famKey => {
              const fam = FAMILIES[famKey];
              const orgsInFam = currentOrganisms.filter(o => o.f === famKey);
              if (!orgsInFam.length) return null;

              return (
                <div key={famKey} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className={`w-2.5 h-2.5 rounded-full ${fam?.theme?.dot || 'bg-slate-400'}`}></span>
                    <span>{fam?.name || famKey}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {orgsInFam.map(org => {
                      const isSelected = org.id === currentOrgId;
                      const activeDrugCount = getDrugsForOrganism(org.id, selectedGroup, version).length;
                      const has2026Upd = isBac && version === '2026' && ORG_NOTES_2026[org.id];

                      return (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => handleSelectOrg(org.id)}
                          className={`flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                            isSelected
                              ? `${fam?.theme?.activeBg || 'bg-primary/10'} ${fam?.theme?.text || 'text-primary'} border-2 ${fam?.theme?.activeBorder || 'border-primary'} shadow-sm`
                              : 'bg-white/60 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/5'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-sm font-bold flex items-center gap-1.5 flex-wrap">
                              <span>{getOrganismName(org, version)}</span>
                              {has2026Upd && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500 text-white shrink-0">
                                  2026
                                </span>
                              )}
                            </div>
                            {getOrganismSubtitle(org, version) && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {getOrganismSubtitle(org, version)}
                              </div>
                            )}
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isSelected
                              ? 'bg-white dark:bg-slate-900 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                          }`}>
                            {activeDrugCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Pathogen Detail View */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {currentOrg ? (
              <>
                {/* Organism Hero Card */}
                <div className={`p-6 rounded-3xl border ${FAMILIES[currentOrg.f]?.theme?.bg || 'bg-slate-50'} ${FAMILIES[currentOrg.f]?.theme?.border || 'border-slate-200'} shadow-sm`}>
                  <div className="flex flex-col gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${FAMILIES[currentOrg.f]?.theme?.text || 'text-slate-700'}`}>
                      {FAMILIES[currentOrg.f]?.name}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {getOrganismName(currentOrg, version)}
                    </h2>
                    {getOrganismSubtitle(currentOrg, version) && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {getOrganismSubtitle(currentOrg, version)}
                      </p>
                    )}
                    {currentOrg.site && (
                      <div className="mt-2 text-xs md:text-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/60 dark:border-white/10">
                        <strong className="font-bold">Common clinical sites:</strong> {currentOrg.site}
                      </div>
                    )}
                  </div>

                  {/* Standard Note */}
                  {currentOrg.note && !(isBac && version === '2026' && currentOrg.id === 'space') && (
                    <div className="mt-3 text-xs md:text-sm text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-white/5 leading-relaxed">
                      {currentOrg.note}
                      {currentOrg.r && renderCites(currentOrg.r)}
                    </div>
                  )}

                  {/* 2026 Guidance Update Alert */}
                  {isBac && version === '2026' && ORG_NOTES_2026[currentOrg.id] && (
                    <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs md:text-sm leading-relaxed">
                      <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-800 dark:text-amber-300">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500 text-white">2026</span>
                        <span>Current Guidance Summary:</span>
                      </div>
                      <p>
                        {Array.isArray(ORG_NOTES_2026[currentOrg.id])
                          ? ORG_NOTES_2026[currentOrg.id][0]
                          : ORG_NOTES_2026[currentOrg.id]}
                      </p>
                      {Array.isArray(ORG_NOTES_2026[currentOrg.id]) && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-xs font-semibold">Sources:</span>
                          {renderCites(ORG_NOTES_2026[currentOrg.id][1])}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Active Drugs Section */}
                <div className="flex flex-col gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Pill size={20} className="text-primary" />
                      Active {currentGroupConfig.noun}s ({drugsForSelectedOrg.length})
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Grouped by pharmacologic class
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {Object.entries(drugsGroupedByClass).map(([className, drugs]) => (
                      <div key={className} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {className}
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          {drugs.map(drug => {
                            const covVal = drug.cov[currentOrg.id];
                            const hasChg = isBac && version === '2026' && drug.chg && drug.chg[currentOrg.id];
                            return (
                              <button
                                key={drug.n}
                                type="button"
                                onClick={() => {
                                  handleSelectDrug(drug.n);
                                  setActiveTab('drug');
                                }}
                                className="group flex flex-col items-start p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 hover:border-primary dark:hover:border-primary shadow-sm hover:shadow transition-all text-left"
                              >
                                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                  <span>{drug.n}</span>
                                  {hasChg && (
                                    <span 
                                      title={SOURCES[drug.chg[currentOrg.id].src]} 
                                      className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500 text-white"
                                    >
                                      2026
                                    </span>
                                  )}
                                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                </div>
                                {renderCoverageBadges(covVal, drug.tag)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Removed Drugs Card (Antibacterial 2026 update) */}
                  {removedDrugsForOrg.length > 0 && (
                    <div className="mt-2 p-5 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20">
                      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm mb-3">
                        <AlertOctagon size={18} />
                        <span>Removed in the 2026 Guidance Update ({removedDrugsForOrg.length})</span>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {removedDrugsForOrg.map(d => (
                          <div key={d.n} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-rose-200 dark:border-rose-900/40">
                            <span className="line-through text-sm font-semibold text-slate-500 dark:text-slate-400">
                              {d.n}
                            </span>
                            <span className="text-xs text-rose-800 dark:text-rose-300 font-medium">
                              {d.chg[currentOrg.id].t} · <strong className="font-semibold">{SOURCES[d.chg[currentOrg.id].src]}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500">Select an organism to view coverage details.</div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PICK AN ANTI-INFECTIVE DRUG & PHARMACIST VIEW
         ========================================================================= */}
      {activeTab === 'drug' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Drug Selector Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-4 shadow-sm max-h-[820px] overflow-y-auto">
            {/* Search Box */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={drugSearchQuery}
                onChange={e => setDrugSearchQuery(e.target.value)}
                placeholder={`Find ${currentGroupConfig.noun} (e.g. ${currentGroupConfig.ph})...`}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Drug List grouped by class */}
            <div className="flex flex-col gap-4">
              {Object.keys(filteredDrugsByClass).length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No {currentGroupConfig.noun} matches "{drugSearchQuery}". Try search by class like "{currentGroupConfig.hint}".
                </div>
              ) : (
                Object.entries(filteredDrugsByClass).map(([className, drugs]) => (
                  <div key={className} className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">
                      {className}
                    </span>
                    {drugs.map(drug => {
                      const isSelected = drug.n === currentDrugName;
                      const covCount = Object.keys(drug.cov || {}).length;
                      const hasUpd = isBac && version === '2026' && drug.chg && Object.keys(drug.chg).length > 0;
                      return (
                        <button
                          key={drug.n}
                          type="button"
                          onClick={() => handleSelectDrug(drug.n)}
                          className={`flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                            isSelected
                              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]'
                              : 'bg-white/60 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/5'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-sm font-bold flex items-center gap-1.5 flex-wrap">
                              <span>{drug.n}</span>
                              {hasUpd && (
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
                                }`}>
                                  {drug.isNew ? 'new' : '2026'}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                          }`}>
                            {covCount}/{currentOrganisms.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Drug Detail & Pharmacist Panel */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {currentDrug ? (
              <>
                {/* Drug Header Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {currentDrug.c}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {currentDrug.n}
                      </h2>
                      {currentDrug.tag && (
                        <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          {currentDrug.tag}
                        </div>
                      )}
                      {currentDrug.isNew && currentDrug.src && (
                        <div className="text-xs text-slate-500 mt-2">
                          Guideline source: <strong>{SOURCES[currentDrug.src]}</strong>
                        </div>
                      )}
                    </div>

                    <div className="text-left sm:text-right p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/10 shrink-0">
                      <div className="text-2xl font-black text-primary">
                        {Object.keys(currentDrug.cov || {}).length}
                        <span className="text-sm font-semibold text-slate-400"> / {currentOrganisms.length}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {currentGroupConfig.unit} covered
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pharmacist Clinical Notes Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles size={20} className="text-amber-500" />
                      Pharmacist Clinical Points
                    </h3>

                    {/* Quick Badges: AWaRe & IV to PO */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* WHO AWaRe Classification */}
                      {isBac && (
                        <div className="flex items-center gap-1">
                          {drugNotes.aw ? (
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${AWARE_MAP[drugNotes.aw]?.color}`}>
                              WHO AWaRe: {drugNotes.awx || AWARE_MAP[drugNotes.aw]?.name}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                              AWaRe: Not confirmed
                            </span>
                          )}
                          {renderCite("WHO")}
                        </div>
                      )}

                      {/* Bioavailability Badge */}
                      {drugNotes.po && (
                        <div className="flex items-center gap-1">
                          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            {isBac ? 'IV→PO: ' : 'Oral: '}{drugNotes.po[0]}
                          </span>
                          {renderCites(drugNotes.po[1])}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pharmacist Grid Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Boxed Warnings */}
                    {drugNotes.warn && (
                      <div className="md:col-span-2 p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200">
                        <div className="flex items-center gap-2 font-bold text-sm text-rose-700 dark:text-rose-300 mb-2">
                          <AlertTriangle size={17} />
                          <span>Boxed Warning / Clinical Safety Alert</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                          {drugNotes.warn.map(([warnText, refKeys], i) => (
                            <li key={i}>
                              <span>{warnText}</span>
                              {renderCites(refKeys)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Monitoring */}
                    {drugNotes.mon && (
                      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-950 dark:text-blue-200">
                        <div className="flex items-center gap-2 font-bold text-sm text-blue-700 dark:text-blue-300 mb-2">
                          <Activity size={17} />
                          <span>Monitoring & Target Levels</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                          {drugNotes.mon.map(([monText, refKeys], i) => (
                            <li key={i}>
                              <span>{monText}</span>
                              {renderCites(refKeys)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Drug Interactions */}
                    {drugNotes.ix && (
                      <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-purple-950 dark:text-purple-200">
                        <div className="flex items-center gap-2 font-bold text-sm text-purple-700 dark:text-purple-300 mb-2">
                          <AlertOctagon size={17} />
                          <span>Key Drug Interactions</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                          {drugNotes.ix.map(([ixText, refKeys], i) => (
                            <li key={i}>
                              <span>{ixText}</span>
                              {renderCites(refKeys)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pharmacist Guidance Points */}
                    {drugNotes.note && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">
                          <Info size={17} />
                          <span>Clinical Guidance Points</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                          {drugNotes.note.map(([noteText, refKeys], i) => (
                            <li key={i}>
                              <span>{noteText}</span>
                              {renderCites(refKeys)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Spectrum Gaps */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200">
                      <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300 mb-2">
                        <X size={17} />
                        <span>Not active against / Not used for</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {uncoveredGaps.length > 0 ? (
                          uncoveredGaps.map((gap, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-100/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              {gap}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">None of the key benchmark pathogens</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Removed Coverage Note Alert */}
                {isBac && version === '2026' && currentDrug.chg && (
                  (() => {
                    const removedItems = Object.entries(currentDrug.chg).filter(([o, c]) => c.act === 'remove');
                    if (!removedItems.length) return null;
                    return (
                      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs md:text-sm text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                        <AlertOctagon size={18} className="text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">2026 Removed Indications: </strong>
                          {removedItems.map(([o, c]) => `${SHORT_NAMES[o] || o} (${c.t.replace(/^Removed: /, '')})`).join('; ')}
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* Spectrum Ribbon Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Grid size={20} className="text-primary" />
                      Comprehensive Spectrum Profile
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Activity across all pathogen families
                    </span>
                  </div>

                  <div className="flex flex-col gap-6">
                    {activeFamilyOrder.map(famKey => {
                      const fam = FAMILIES[famKey];
                      const orgsInFam = currentOrganisms.filter(o => o.f === famKey);
                      if (!orgsInFam.length) return null;

                      return (
                        <div key={famKey} className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <span className={`w-2.5 h-2.5 rounded-full ${fam?.theme?.dot || 'bg-slate-400'}`}></span>
                            <span>{fam?.name || famKey}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {orgsInFam.map(org => {
                              const covVal = currentDrug.cov[org.id];
                              const isCovered = Boolean(covVal);
                              const hasChg = isBac && version === '2026' && currentDrug.chg && currentDrug.chg[org.id];

                              return (
                                <div
                                  key={org.id}
                                  className={`p-3 rounded-2xl border transition-all ${
                                    isCovered
                                      ? `${fam?.theme?.bg || 'bg-slate-50'} ${fam?.theme?.border || 'border-slate-200'} shadow-sm`
                                      : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200/50 dark:border-white/5 opacity-60'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1.5 font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                                    <span className="truncate">{getOrganismName(org, version)}</span>
                                    {hasChg && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500 text-white shrink-0">
                                        2026
                                      </span>
                                    )}
                                  </div>

                                  {isCovered ? (
                                    renderCoverageBadges(covVal, currentDrug.tag)
                                  ) : (
                                    <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                      Not covered
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500">Select a drug to view spectrum details.</div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FULL COVERAGE MAP (MATRIX)
         ========================================================================= */}
      {activeTab === 'map' && (
        <div className="flex flex-col gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Grid size={20} className="text-primary" />
                {currentGroupConfig.label} Coverage Matrix ({currentDrugs.length} drugs × {currentOrganisms.length} pathogens)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBac 
                  ? 'Filled dot = Active. Ring = Active with limitation. × = Removed in 2026. Orange corner = Updated cell (hover for details).'
                  : 'Filled dot = Active (including first-line). Ring = Limited or specific use. Hover any cell for clinical detail.'}
              </p>
            </div>
            
            {/* Interactive Tooltip Card */}
            {hoveredMatrixCell && (
              <div className="px-3.5 py-2 rounded-2xl bg-slate-900 text-white text-xs max-w-sm shadow-xl border border-white/10 animate-fade-in">
                <strong>{hoveredMatrixCell.drug}:</strong> {hoveredMatrixCell.text}
              </div>
            )}
          </div>

          {/* Matrix Scroll Table */}
          <div className="overflow-x-auto max-h-[720px] overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="p-3 font-bold text-slate-700 dark:text-slate-200 sticky left-0 bg-slate-100 dark:bg-slate-800 z-30 min-w-[220px]">
                    {currentGroupConfig.Noun}
                  </th>
                  {currentOrganisms.map(org => {
                    const fam = FAMILIES[org.f];
                    return (
                      <th
                        key={org.id}
                        title={`${getOrganismName(org, version)}${getOrganismSubtitle(org, version) ? ' – ' + getOrganismSubtitle(org, version) : ''}`}
                        className="p-2 font-bold text-center min-w-[44px] max-w-[56px] select-none"
                      >
                        <span className={`block truncate ${fam?.theme?.text || 'text-slate-700'}`}>
                          {getShortName(org.id)}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
                {(() => {
                  let lastClass = null;
                  return currentDrugs.map(drug => {
                    const isNewClass = drug.c !== lastClass;
                    lastClass = drug.c;

                    return (
                      <React.Fragment key={drug.n}>
                        {isNewClass && (
                          <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-600 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                            <td colSpan={currentOrganisms.length + 1} className="py-2 px-3 sticky left-0">
                              {drug.c}
                            </td>
                          </tr>
                        )}
                        <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white sticky left-0 bg-white/95 dark:bg-slate-900/95 z-10 border-r border-slate-200/60 dark:border-white/5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectDrug(drug.n);
                                setActiveTab('drug');
                              }}
                              className="hover:text-primary transition-colors text-left"
                            >
                              {drug.n}
                            </button>
                          </td>

                          {currentOrganisms.map(org => {
                            const cov = drug.cov[org.id];
                            const fam = FAMILIES[org.f];
                            const hasChg = isBac && version === '2026' && drug.chg && drug.chg[org.id];
                            const isRemoved = hasChg && drug.chg[org.id].act === 'remove';
                            const isQual = cov && (cov.q || drug.tag);
                            const covText = getCoverageText(cov);

                            let tooltipMsg = `${getOrganismName(org, version)}`;
                            if (covText) tooltipMsg += `: ${covText}`;
                            if (hasChg) tooltipMsg += ` — 2026: ${drug.chg[org.id].t} (${SOURCES[drug.chg[org.id].src]})`;

                            return (
                              <td
                                key={org.id}
                                onMouseEnter={() => setHoveredMatrixCell({ drug: drug.n, text: tooltipMsg })}
                                onMouseLeave={() => setHoveredMatrixCell(null)}
                                className="p-2 text-center relative border-r border-slate-100 dark:border-white/5"
                              >
                                {cov ? (
                                  isQual ? (
                                    <span
                                      className={`inline-block w-3.5 h-3.5 rounded-full border-2 ${fam?.theme?.ring || 'border-primary'} mx-auto`}
                                      aria-label="Active with limitation"
                                    />
                                  ) : (
                                    <span
                                      className={`inline-block w-3.5 h-3.5 rounded-full ${fam?.theme?.dot || 'bg-primary'} mx-auto`}
                                      aria-label="Active"
                                    />
                                  )
                                ) : isRemoved ? (
                                  <span className="text-rose-600 font-extrabold text-xs select-none">×</span>
                                ) : null}

                                {/* 2026 Update Corner Marker */}
                                {hasChg && (
                                  <span
                                    className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500"
                                    aria-hidden="true"
                                  />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      </React.Fragment>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PHARMACIST TOOLKIT
         ========================================================================= */}
      {activeTab === 'tk' && (
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Beta-Lactam Allergy Quick Guide */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <ShieldAlert className="text-violet-600" size={22} />
              β-Lactam Allergy Quick Clinical Guide
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Verified against AAAAI/ACAAI Drug Allergy Practice Parameter (2022 Update)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOOLKIT_DATA.betaLactamAllergy.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 flex flex-col gap-1.5">
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{item.rule}</span>
                    {renderCite(item.ref)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
              <strong>Clinical Practice Point:</strong> Always consult the institutional allergy/ID pathway for severe delayed cutaneous reactions (such as SJS/TEN or DRESS).
            </div>
          </div>

          {/* Section 2: IV to Oral Switch Bioavailability */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <ArrowRight className="text-teal-600" size={22} />
              Intravenous to Oral Switch (IVOS) & Bioavailability
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Direct pharmacokinetic bioavailability comparison based on FDA prescribing information and AHFS monographs.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 mb-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Antimicrobial Agent</th>
                    <th className="p-3">Oral Bioavailability & Pharmacokinetics</th>
                    <th className="p-3 text-right">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {TOOLKIT_DATA.ivToOralBioavailability.map(([drug, bio, refKey], i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{drug}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{bio}</td>
                      <td className="p-3 text-right">{renderCite(refKey)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 text-xs text-teal-950 dark:text-teal-200 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-bold text-teal-800 dark:text-teal-300">
                <Clock size={16} />
                <span>UKHSA National IVOS Switch Criteria {renderCite("IVOS")}</span>
              </div>
              <p className="leading-relaxed">
                {TOOLKIT_DATA.ivosCriteria}
              </p>
            </div>
          </div>

          {/* Section 3: Antifungal TDM Targets & Azole Interactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* TDM Targets */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="text-blue-600" size={20} />
                Antifungal Therapeutic Drug Monitoring (TDM)
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-2.5">Drug</th>
                      <th className="p-2.5">Target Range</th>
                      <th className="p-2.5 text-right">Guideline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {TOOLKIT_DATA.antifungalTdmTargets.map(([drug, target, refKey], i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{drug}</td>
                        <td className="p-2.5 text-slate-700 dark:text-slate-300">{target}</td>
                        <td className="p-2.5 text-right">{renderCite(refKey)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Azole Interactions */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} />
                Azole CYP Interactions Quick Check
              </h3>
              <div className="flex flex-col gap-2">
                {TOOLKIT_DATA.azoleInteractions.map((item, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/5 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{item.drug}</span>
                      {renderCite(item.ref)}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: NIOSH Hazardous Anti-Infectives */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <AlertOctagon className="text-rose-600" size={20} />
              Hazardous Anti-Infective Medications (NIOSH 2024 List) {renderCite("NIOSH")}
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Drugs Listed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {TOOLKIT_DATA.hazardousDrugs.map(([tbl, drugs], i) => (
                    <tr key={i}>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{tbl}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{drugs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Glossary */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="text-primary" size={22} />
                  Clinical Antimicrobial Glossary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Definitions and guideline criteria for resistance mechanisms and terminology.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={glossarySearchQuery}
                  onChange={e => setGlossarySearchQuery(e.target.value)}
                  placeholder="Search glossary terms..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredGlossary.map(([term, def, refKey], i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-white/5 flex flex-col justify-between gap-1.5">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{term}</span>
                      {renderCite(refKey)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {def}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: WHAT CHANGED
         ========================================================================= */}
      {activeTab === 'chg' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="text-amber-500" size={22} />
                  Changes from the 2019 Original Chart & October 2026 Audit
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Every modification re-verified against IDSA AMR Guidance (2026), CDC STI (2021), IDSA/SIS (2010), FDA labels, and AHFS monographs.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={changeSearchQuery}
                  onChange={e => setChangeSearchQuery(e.target.value)}
                  placeholder="Filter changes..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Antibacterial Changes Table */}
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
              Antibacterial Chart: Verified Modifications ({filteredChanges.length})
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Antibiotic</th>
                    <th className="p-3">Pathogen</th>
                    <th className="p-3">Clinical Change Description</th>
                    <th className="p-3 text-right">Guideline Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {filteredChanges.map(([drug, orgKey, act, desc, srcKey], i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{drug}</td>
                      <td className="p-3 font-medium text-slate-600 dark:text-slate-300">
                        {SHORT_NAMES[orgKey] || orgKey}
                      </td>
                      <td className="p-3">
                        <span className={`inline-block mr-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          act === 'remove'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}>
                          {act === 'remove' ? 'Removed' : 'Updated'}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200">{desc}</span>
                      </td>
                      <td className="p-3 text-right text-slate-500 font-semibold">{SOURCES[srcKey] || srcKey}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Key Guidance Points for Newly Added Sections */}
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-6">
              New Sections Added October 2026: Key Clinical Points ({filteredKeyPoints.length})
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Section</th>
                    <th className="p-3">Topic / Organism</th>
                    <th className="p-3">Current Accredited Guidance</th>
                    <th className="p-3 text-right">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {filteredKeyPoints.map(([sec, topic, text, refKey], i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-primary">{sec}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{topic}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-200">{text}</td>
                      <td className="p-3 text-right">{renderCite(refKey)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: REFERENCES (ALL 59 CITED SOURCES)
         ========================================================================= */}
      {activeTab === 'ref' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="text-primary" size={22} />
              Accredited Clinical Practice Guidelines & Primary References ({REFERENCES.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-4xl leading-relaxed">
              Every statement in Spectra has been verified against primary guidelines, FDA prescribing information, or AHFS monographs. Unconfirmed secondary claims have been removed. Click on any source to open official documentation.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-slate-200/70 dark:divide-white/5">
            {REFERENCES.map(([key, text, url], idx) => {
              const num = idx + 1;
              return (
                <div 
                  key={key} 
                  id={`ref-item-${key}`}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-extrabold text-primary shrink-0">
                      [{num}]
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {text}
                    </span>
                  </div>

                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline text-[11px] font-semibold shrink-0 ml-6 sm:ml-0"
                    >
                      <span>Official Link</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>Clinical Disclaimer:</strong> Spectra is an antimicrobial stewardship educational reference tool. It does not replace local antimicrobial guidelines, patient-specific culture & susceptibility data, clinical pharmacy evaluation, or ID consultation.
          </div>
        </div>
      )}

    </div>
  );
};

export default BugDrugNavigator;
