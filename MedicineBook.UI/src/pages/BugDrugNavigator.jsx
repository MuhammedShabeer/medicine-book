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
  HelpCircle
} from 'lucide-react';
import {
  FAMILIES,
  FAMILY_ORDER,
  ORGANISMS_BASE,
  ORGANISMS_2026_ADDITIONS,
  SHORT_NAMES,
  DRUGS_BASE,
  DRUGS_2026,
  SOURCES,
  CHANGES_2026,
  NEW_DRUGS_2026,
  EXTRA_2026,
  ORG_NOTES_2026,
  REFERENCES,
  REF_NUMBERS,
  PHARMACIST_NOTES,
  TOOLKIT_DATA,
  KEY_GAPS,
  getOrganisms,
  getDrugs,
  getOrganismName,
  getOrganismSubtitle,
  getDrugsForOrganism
} from '../data/bugDrugData';

const BugDrugNavigator = () => {
  const [version, setVersion] = useState('2026'); // '2026' or '2019'
  const [activeTab, setActiveTab] = useState('bug'); // 'bug', 'drug', 'map', 'tk', 'chg', 'ref'
  const [selectedOrgId, setSelectedOrgId] = useState('space');
  const [selectedDrugName, setSelectedDrugName] = useState('Meropenem/imipenem/doripenem');
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [changeSearchQuery, setChangeSearchQuery] = useState('');

  // Active dataset for current version
  const currentOrganisms = useMemo(() => getOrganisms(version), [version]);
  const currentDrugs = useMemo(() => getDrugs(version), [version]);
  const orgById = useMemo(() => Object.fromEntries(currentOrganisms.map(o => [o.id, o])), [currentOrganisms]);

  // Selected organism object
  const currentOrg = orgById[selectedOrgId] || currentOrganisms[0];

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

  // Removed drugs for selected organism in 2026
  const removedDrugsForOrg = useMemo(() => {
    if (version !== '2026' || !currentOrg) return [];
    return DRUGS_2026.filter(d => d.chg && d.chg[currentOrg.id] && d.chg[currentOrg.id].act === 'remove');
  }, [version, currentOrg]);

  // Selected drug object
  const currentDrug = useMemo(() => {
    const found = currentDrugs.find(d => d.n === selectedDrugName);
    return found || currentDrugs[0];
  }, [currentDrugs, selectedDrugName]);

  // Filtered drug list for Tab 2
  const filteredDrugs = useMemo(() => {
    const q = drugSearchQuery.trim().toLowerCase();
    if (!q) return currentDrugs;
    return currentDrugs.filter(d => 
      d.n.toLowerCase().includes(q) || 
      d.c.toLowerCase().includes(q)
    );
  }, [currentDrugs, drugSearchQuery]);

  // Filtered changes for Tab 5
  const filteredChanges = useMemo(() => {
    const q = changeSearchQuery.trim().toLowerCase();
    return CHANGES_2026.filter(([dn, o, act, t]) => 
      !q || dn.toLowerCase().includes(q) || (SHORT_NAMES[o] || '').toLowerCase().includes(q) || t.toLowerCase().includes(q)
    );
  }, [changeSearchQuery]);

  // Helper to render reference citation pill
  const renderCite = (key) => {
    const num = REF_NUMBERS[key];
    if (!num) return null;
    const ref = REFERENCES[num - 1];
    return (
      <sup 
        key={key} 
        title={ref ? ref[1] : key}
        className="ml-0.5 px-1 py-0.2 text-[10px] font-bold text-primary bg-primary/10 rounded cursor-help select-none hover:bg-primary/20 transition-colors"
      >
        [{num}]
      </sup>
    );
  };

  const renderCites = (keys) => {
    if (!Array.isArray(keys)) return renderCite(keys);
    return keys.map(k => renderCite(k));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-rose-500 text-white rounded-2xl shadow-lg shadow-violet-500/20">
              <ShieldAlert size={28} />
            </div>
            Spectra
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1 max-w-3xl text-sm leading-relaxed">
            Antimicrobial Spectrum & Bug–Drug Navigator. Tap any bacterium to inspect active antibiotics, or pick a drug to evaluate its bacterial coverage, AWaRe classification, and key clinical gaps.
          </p>
        </div>

        {/* Version Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-white/10 shrink-0 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-2 pr-1">Version:</span>
          <button
            type="button"
            onClick={() => setVersion('2026')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              version === '2026'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            2026 Update
          </button>
          <button
            type="button"
            onClick={() => setVersion('2019')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              version === '2019'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Original 2019
          </button>
        </div>
      </div>

      {/* Gram Stain Legend */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-4 py-2.5 glass-panel text-xs text-slate-600 dark:text-slate-300">
        <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-violet-600"></span>
          <span>Gram-positive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-600"></span>
          <span>Gram-negative</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-600"></span>
          <span>Anaerobes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-teal-600"></span>
          <span>Atypicals</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white">2026</span>
          <span className="text-[11px] text-slate-500">Updated against current IDSA/EUCAST/CDC guidance</span>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-white/10">
        {[
          { id: 'bug', label: 'Pick a Bacterium', icon: ShieldAlert },
          { id: 'drug', label: 'Pick an Antibiotic', icon: Pill },
          { id: 'map', label: 'Full Coverage Map', icon: Grid },
          { id: 'tk', label: 'Pharmacist Toolkit', icon: ClipboardList },
          { id: 'chg', label: 'What Changed (2026)', icon: History },
          { id: 'ref', label: 'References', icon: BookOpen }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all active:scale-95 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PICK A BACTERIUM                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'bug' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Organisms Grouped by Family */}
          <div className="lg:col-span-4 flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-1">
            {FAMILY_ORDER.map(famId => {
              const fam = FAMILIES[famId];
              const orgsInFam = currentOrganisms.filter(o => o.f === famId);
              if (!orgsInFam.length) return null;

              return (
                <div key={famId} className="glass-panel p-3">
                  <div className={`flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider ${fam.theme.text}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${fam.theme.dot}`}></span>
                    {fam.name}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {orgsInFam.map(org => {
                      const isSelected = org.id === currentOrg.id;
                      const has2026Update = version === '2026' && ORG_NOTES_2026[org.id];
                      const drugCount = getDrugsForOrganism(org.id, version).length;

                      return (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => setSelectedOrgId(org.id)}
                          className={`text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 border ${
                            isSelected
                              ? `${fam.theme.activeBg} ${fam.theme.activeBorder} shadow-sm ring-1 ring-primary/30 font-bold`
                              : 'bg-white/40 dark:bg-white/5 border-transparent hover:border-slate-300 dark:hover:border-white/10 hover:bg-white/80 dark:hover:bg-white/10'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                {getOrganismName(org, version)}
                              </span>
                              {has2026Update && (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-orange-600 text-white rounded">
                                  2026
                                </span>
                              )}
                            </div>
                            {getOrganismSubtitle(org, version) && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {getOrganismSubtitle(org, version)}
                              </p>
                            )}
                          </div>

                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full shrink-0 ${fam.theme.pill}`}>
                            {drugCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Organism Details & Active Antibiotics */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {currentOrg && (
              <>
                {/* Organism Hero Card */}
                {(() => {
                  const fam = FAMILIES[currentOrg.f];
                  const note26 = version === '2026' ? ORG_NOTES_2026[currentOrg.id] : null;

                  return (
                    <div className={`p-6 rounded-3xl border transition-all ${fam.theme.bg} ${fam.theme.border} shadow-lg shadow-black/5`}>
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${fam.theme.text}`}>
                          {fam.name}
                        </span>
                        <span className="text-xs font-mono font-bold bg-white/60 dark:bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                          {drugsForSelectedOrg.length} Active Antibiotics
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                        {getOrganismName(currentOrg, version)}
                      </h2>

                      {getOrganismSubtitle(currentOrg, version) && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {getOrganismSubtitle(currentOrg, version)}
                        </p>
                      )}

                      {/* Common Infection Sites */}
                      {currentOrg.site && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-900/80 rounded-xl text-xs text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-sm">
                          <span className="font-bold text-slate-900 dark:text-white">Common infection sites:</span>
                          <span>{currentOrg.site}</span>
                        </div>
                      )}

                      {/* Original Clinical Note */}
                      {currentOrg.note && !(version === '2026' && currentOrg.id === 'space') && (
                        <div className="mt-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                          <strong>Note:</strong> {currentOrg.note}
                        </div>
                      )}

                      {/* 2026 Guideline Update Note */}
                      {note26 && (
                        <div className="mt-3 p-3.5 bg-slate-900 dark:bg-slate-950 text-white rounded-xl text-xs border border-orange-500/40 shadow-sm leading-relaxed">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white mr-2">
                            2026 UPDATE
                          </span>
                          {Array.isArray(note26) ? (
                            <>
                              <span>{note26[0]}</span>
                              {renderCites(note26[1])}
                            </>
                          ) : (
                            <span>{note26}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Active Antibiotics Grouped by Class */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Pill size={18} className="text-primary" />
                    Covering Antibiotics ({drugsForSelectedOrg.length} options, grouped by class)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {Object.entries(drugsGroupedByClass).map(([className, drugList]) => (
                      <div key={className} className="glass-panel p-4 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-white/5">
                            {className}
                          </h4>
                          <div className="divide-y divide-slate-100 dark:divide-white/5 mt-1">
                            {drugList.map(drug => {
                              const covVal = drug.cov[currentOrg.id];
                              const qual = (covVal && covVal.q) || drug.tag;
                              const hasUpdate = version === '2026' && drug.chg && drug.chg[currentOrg.id];

                              return (
                                <div key={drug.n} className="py-2 flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                      {drug.n}
                                    </span>
                                    {hasUpdate && (
                                      <span 
                                        className="ml-1.5 px-1 py-0.2 text-[9px] font-bold bg-orange-600 text-white rounded"
                                        title={SOURCES[drug.chg[currentOrg.id].src]}
                                      >
                                        2026
                                      </span>
                                    )}
                                    {qual && (
                                      <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/40 mt-1 inline-block">
                                        {qual}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Removed in 2026 Update */}
                {removedDrugsForOrg.length > 0 && (
                  <div className="p-4 rounded-2xl border border-dashed border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20">
                    <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <X size={15} />
                      Removed in the 2026 Update
                    </h4>
                    <div className="space-y-2">
                      {removedDrugsForOrg.map(drug => {
                        const chg = drug.chg[currentOrg.id];
                        return (
                          <div key={drug.n} className="text-xs">
                            <span className="line-through font-bold text-slate-500 dark:text-slate-400 mr-2">
                              {drug.n}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300">
                              {chg.t} • <span className="font-semibold text-slate-800 dark:text-slate-200">{SOURCES[chg.src]}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PICK AN ANTIBIOTIC                                                */}
      {/* ========================================================================= */}
      {activeTab === 'drug' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Drug Search & List */}
          <div className="lg:col-span-4 flex flex-col gap-3 max-h-[800px] overflow-hidden">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={drugSearchQuery}
                onChange={e => setDrugSearchQuery(e.target.value)}
                placeholder="Find an antibiotic (e.g. Meropenem, Vancomycin)..."
                className="glass-input pl-10 text-xs sm:text-sm"
              />
              {drugSearchQuery && (
                <button
                  type="button"
                  onClick={() => setDrugSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1 flex flex-col gap-1 pr-1">
              {filteredDrugs.length > 0 ? (
                filteredDrugs.map(drug => {
                  const isSelected = drug.n === currentDrug.n;
                  const coveredCount = Object.keys(drug.cov || {}).length;
                  const has2026 = version === '2026' && drug.chg && Object.keys(drug.chg).length > 0;

                  return (
                    <button
                      key={drug.n}
                      type="button"
                      onClick={() => setSelectedDrugName(drug.n)}
                      className={`text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 border ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 font-bold'
                          : 'bg-white/40 dark:bg-white/5 border-transparent hover:border-slate-300 dark:hover:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm truncate">
                            {drug.n}
                          </span>
                          {has2026 && (
                            <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${isSelected ? 'bg-white text-primary' : 'bg-orange-600 text-white'}`}>
                              {drug.isNew ? 'NEW' : '2026'}
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] block truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          {drug.c}
                        </span>
                      </div>

                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                      }`}>
                        {coveredCount}/{currentOrganisms.length}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No antibiotic matching "{drugSearchQuery}". Try searching by drug class (e.g., "Carbapenem").
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Antibiotic Details */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {currentDrug && (
              <>
                {/* Antibiotic Header Card */}
                <div className="glass-panel p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {currentDrug.c}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {currentDrug.n}
                    </h2>
                    {currentDrug.tag && (
                      <span className="inline-block mt-2 px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 rounded-lg border border-amber-300 dark:border-amber-800">
                        {currentDrug.tag}
                      </span>
                    )}
                    {currentDrug.isNew && (
                      <span className="block text-xs text-slate-500 mt-1">
                        Source: {SOURCES[currentDrug.src]}
                      </span>
                    )}
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      {Object.keys(currentDrug.cov || {}).length}
                      <span className="text-base text-slate-400 font-normal"> / {currentOrganisms.length}</span>
                    </div>
                    <span className="text-xs text-slate-500">Bacterial groups covered</span>
                  </div>
                </div>

                {/* Pharmacist Notes Card */}
                {(() => {
                  const pn = PHARMACIST_NOTES[currentDrug.n] || {};
                  const keyGaps = KEY_GAPS.filter(o => 
                    orgById[o] && currentOrganisms.some(x => x.id === o) && !currentDrug.cov[o]
                  ).map(o => SHORT_NAMES[o]);

                  const awCls = pn.aw === 'A' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : pn.aw === 'W'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    : pn.aw === 'R'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700';

                  const awLabel = pn.awx || (pn.aw === 'A' ? 'Access' : pn.aw === 'W' ? 'Watch' : pn.aw === 'R' ? 'Reserve' : 'Not confirmed');

                  return (
                    <div className="glass-panel p-6 flex flex-col gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <ClipboardList size={18} className="text-primary" />
                          Pharmacist Clinical Notes
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* WHO AWaRe Badge */}
                          <span className={`px-3 py-1 rounded-xl font-bold border ${awCls}`}>
                            WHO AWaRe: {awLabel}
                          </span>
                          {renderCite(pn.aw === "R" && ["Ceftolozane-tazobactam","Colistin/polymyxin B","Linezolid/tedizolid","Ceftazidime-avibactam","Meropenem-vaborbactam","Cefiderocol"].includes(currentDrug.n) ? "EML" : "WHO")}

                          {/* IV to PO Switch Bioavailability */}
                          {pn.po && (
                            <span className="px-3 py-1 rounded-xl font-bold bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                              IV→PO: {pn.po[0]} {renderCites(pn.po[1])}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Clinical Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        
                        {/* Boxed Warnings */}
                        {pn.warn && (
                          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-900 dark:text-rose-200 md:col-span-2">
                            <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                              <AlertTriangle size={14} /> Boxed Warning
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                              {pn.warn.map(([t, r], i) => (
                                <li key={i}>{t} {renderCites(r)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Monitoring Requirements */}
                        {pn.mon && (
                          <div className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                              Therapeutic Drug Monitoring
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                              {pn.mon.map(([t, r], i) => (
                                <li key={i}>{t} {renderCites(r)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Key Drug Interactions */}
                        {pn.ix && (
                          <div className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                              Key Interactions
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                              {pn.ix.map(([t, r], i) => (
                                <li key={i}>{t} {renderCites(r)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Pharmacist Points */}
                        {pn.note && (
                          <div className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:col-span-2">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                              Pharmacist Points
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                              {pn.note.map(([t, r], i) => (
                                <li key={i}>{t} {renderCites(r)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Key Coverage Gaps */}
                        <div className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:col-span-2">
                          <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                            Notable Gaps (Not active against in this chart)
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 font-medium">
                            {keyGaps.length ? keyGaps.join(', ') : 'None of the key benchmark resistant groups'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Removed Indications in 2026 */}
                {(() => {
                  if (version !== '2026' || !currentDrug.chg) return null;
                  const removed = Object.entries(currentDrug.chg).filter(([o, c]) => c.act === 'remove');
                  if (!removed.length) return null;

                  return (
                    <div className="p-4 rounded-2xl border border-dashed border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-xs">
                      <span className="font-bold text-rose-700 dark:text-rose-400 mr-2 uppercase tracking-wider">
                        2026 Removed Indications:
                      </span>
                      {removed.map(([o, c]) => `${SHORT_NAMES[o]} — ${c.t.replace(/^Removed: /, '')}`).join('; ')}
                    </div>
                  );
                })()}

                {/* Bacterial Spectrum Ribbon */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Grid size={18} className="text-primary" />
                    Bacterial Coverage Spectrum
                  </h3>

                  <div className="space-y-4">
                    {FAMILY_ORDER.filter(famId => currentOrganisms.some(o => o.f === famId)).map(famId => {
                      const fam = FAMILIES[famId];
                      const orgsInFam = currentOrganisms.filter(o => o.f === famId);

                      return (
                        <div key={famId} className="glass-panel p-4">
                          <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${fam.theme.text}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${fam.theme.dot}`}></span>
                            {fam.name}
                          </h4>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                            {orgsInFam.map(org => {
                              const covVal = currentDrug.cov[org.id];
                              const isCovered = !!covVal;
                              const qual = covVal && covVal.q;
                              const hasUpdate = version === '2026' && currentDrug.chg && currentDrug.chg[org.id];

                              return (
                                <div
                                  key={org.id}
                                  className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                                    isCovered
                                      ? `${fam.theme.activeBg} ${fam.theme.activeBorder} text-slate-900 dark:text-white font-bold`
                                      : 'bg-slate-100/60 dark:bg-white/5 border-dashed border-slate-200 dark:border-white/5 text-slate-400'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="truncate">{getOrganismName(org, version)}</span>
                                      {hasUpdate && (
                                        <span className="px-1 py-0.2 text-[8px] font-bold bg-orange-600 text-white rounded">
                                          2026
                                        </span>
                                      )}
                                    </div>
                                    {qual && (
                                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block mt-1">
                                        {qual}
                                      </span>
                                    )}
                                  </div>

                                  <span className={`text-[10px] font-semibold mt-2 block ${isCovered ? 'text-primary' : 'text-slate-400'}`}>
                                    {isCovered ? '✓ Covered' : '✕ Not covered'}
                                  </span>
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
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FULL COVERAGE MAP (MATRIX HEATMAP)                                */}
      {/* ========================================================================= */}
      {activeTab === 'map' && (
        <div className="glass-panel p-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-200 dark:border-white/10 pb-3">
            <p>
              Filled dot (<span className="inline-block w-2.5 h-2.5 rounded-full bg-primary mx-1"></span>) = active. 
              Ring (<span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-primary mx-1"></span>) = active with qualification. 
              Corner mark (<span className="text-orange-500 font-bold">▲</span>) = 2026 update. 
              <span className="text-rose-600 font-bold mx-1">×</span> = removed in 2026.
            </p>
            <span className="text-[11px] italic">Scroll horizontally to inspect all bacteria</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <th className="sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 p-3 text-left font-bold text-slate-900 dark:text-white border-b border-r border-slate-200 dark:border-white/10 min-w-[200px]">
                    Antibiotic
                  </th>
                  {currentOrganisms.map(org => {
                    const fam = FAMILIES[org.f];
                    return (
                      <th
                        key={org.id}
                        className="p-2 border-b border-slate-200 dark:border-white/10 text-center font-bold min-w-[70px] whitespace-nowrap"
                        title={`${getOrganismName(org, version)} (${fam.name})`}
                      >
                        <span className={`block transform -rotate-45 origin-bottom-left text-[11px] ${fam.theme.text}`}>
                          {SHORT_NAMES[org.id] || org.n}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {(() => {
                  let lastClass = "";
                  return currentDrugs.map(drug => {
                    const isNewClass = drug.c !== lastClass;
                    lastClass = drug.c;

                    return (
                      <React.Fragment key={drug.n}>
                        {isNewClass && (
                          <tr className="bg-slate-50 dark:bg-white/5">
                            <td 
                              colSpan={currentOrganisms.length + 1} 
                              className="sticky left-0 p-2 pl-3 font-bold text-xs text-primary uppercase tracking-wider bg-slate-50 dark:bg-slate-900"
                            >
                              {drug.c}
                            </td>
                          </tr>
                        )}
                        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 p-2.5 font-bold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-white/10">
                            {drug.n}
                          </td>
                          {currentOrganisms.map(org => {
                            const fam = FAMILIES[org.f];
                            const covVal = drug.cov[org.id];
                            const isCovered = !!covVal;
                            const isQualified = isCovered && typeof covVal === 'object' && covVal.q;
                            const chg = version === '2026' && drug.chg && drug.chg[org.id];
                            const isRemoved = chg && chg.act === 'remove';

                            const tooltip = [
                              `${drug.n} → ${getOrganismName(org, version)}`,
                              isQualified ? `Limitation: ${covVal.q}` : '',
                              chg ? `2026 Update: ${chg.t} (${SOURCES[chg.src] || chg.src})` : ''
                            ].filter(Boolean).join('\n');

                            return (
                              <td 
                                key={org.id} 
                                title={tooltip}
                                className="p-2 text-center relative border-r border-slate-100 dark:border-white/5"
                              >
                                {isCovered ? (
                                  isQualified ? (
                                    <span className={`inline-block w-3.5 h-3.5 rounded-full border-2 ${fam.theme.ring}`}></span>
                                  ) : (
                                    <span className={`inline-block w-3.5 h-3.5 rounded-full ${fam.theme.dot}`}></span>
                                  )
                                ) : isRemoved ? (
                                  <span className="text-orange-600 font-bold text-sm">×</span>
                                ) : (
                                  <span className="text-slate-300 dark:text-slate-700">•</span>
                                )}

                                {chg && !isRemoved && (
                                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-600" title="2026 Update"></span>
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

      {/* ========================================================================= */}
      {/* TAB 4: PHARMACIST TOOLKIT                                                */}
      {/* ========================================================================= */}
      {activeTab === 'tk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: β-Lactam Allergy Quick Guide */}
          <div className="glass-panel p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <ShieldAlert className="text-primary" size={20} />
              β-Lactam Allergy Decision Guide
            </h3>

            <ol className="space-y-3 text-xs leading-relaxed list-decimal list-inside text-slate-700 dark:text-slate-300">
              {TOOLKIT_DATA.allergyGuide.map((item, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <strong className="text-slate-900 dark:text-white">{item.title}: </strong>
                  <span>{item.desc}</span>
                  {renderCite(item.ref)}
                </li>
              ))}
            </ol>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
              <strong>Clinical Pathway:</strong> Always consult the hospital β-lactam allergy pathway and involve Infectious Diseases / Allergy teams for severe delayed reactions (e.g. SJS/TEN, DRESS).
            </div>
          </div>

          {/* Card 2: IV to Oral Switch Bioavailability */}
          <div className="glass-panel p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <Activity className="text-primary" size={20} />
              IV → Oral Switch Bioavailability
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <th className="p-2.5 text-left font-bold">Antibiotic</th>
                    <th className="p-2.5 text-left font-bold">Oral Bioavailability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {TOOLKIT_DATA.bioavailability.map((row, idx) => (
                    <tr key={idx} className={row.warn ? 'bg-rose-50/60 dark:bg-rose-950/20' : ''}>
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                        {row.drug}
                      </td>
                      <td className={`p-2.5 ${row.warn ? 'text-rose-700 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                        {row.val} {renderCite(row.ref)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200">
              <strong>COMS Switch Criteria:</strong> Clinical improvement & afebrile 24–48h • Oral route feasible • Markers improving • Specific infections requiring prolonged IV excluded (endocarditis, meningitis, S. aureus bacteraemia, osteomyelitis).
            </div>
          </div>

          {/* Card 3: Clinical Microbiology Glossary */}
          <div className="glass-panel p-6 lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <HelpCircle className="text-primary" size={20} />
              Antimicrobial Resistance & Clinical Glossary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {TOOLKIT_DATA.glossary.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-primary mb-1">
                      {item.term}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.def}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-400">
                    Source: {item.ref} {renderCite(item.ref)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: WHAT CHANGED (2026 GUIDANCE UPDATE)                               */}
      {/* ========================================================================= */}
      {activeTab === 'chg' && (
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="text-primary" size={20} />
                2026 Evidence & Guideline Updates
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Every change made to the classic UBC 2019 baseline, evaluated against current IDSA, EUCAST, and CDC guidance.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={changeSearchQuery}
                onChange={e => setChangeSearchQuery(e.target.value)}
                placeholder="Filter changes..."
                className="glass-input pl-9 py-1.5 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <th className="p-3 text-left font-bold">Antibiotic</th>
                  <th className="p-3 text-left font-bold">Bacteria</th>
                  <th className="p-3 text-left font-bold">Type</th>
                  <th className="p-3 text-left font-bold">Update Details</th>
                  <th className="p-3 text-left font-bold">Guideline Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredChanges.map(([dn, o, act, t, src], idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {dn}
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {SHORT_NAMES[o] || o}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        act === 'remove' 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {act === 'remove' ? 'Removed' : 'Modified'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      {t.replace(/^Removed: /, '')}
                    </td>
                    <td className="p-3 text-slate-500 font-medium">
                      {SOURCES[src] || src}
                    </td>
                  </tr>
                ))}

                {/* Additional 2026 Agents */}
                {NEW_DRUGS_2026.map((nd, idx) => (
                  <tr key={`new-${idx}`} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors bg-teal-50/40 dark:bg-teal-950/10">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {nd.n}
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {Object.keys(nd.cov).map(o => SHORT_NAMES[o] || o).join(', ')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                        New Agent
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      {Object.values(nd.cov).map(v => v.q).filter(Boolean).join('; ') || 'Newer antimicrobial agent'}
                    </td>
                    <td className="p-3 text-slate-500 font-medium">
                      {SOURCES[nd.src] || nd.src}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: REFERENCES                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'ref' && (
        <div className="glass-panel p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <BookOpen className="text-primary" size={20} />
            Academic Guidelines & References
          </h3>

          <ol className="space-y-3 text-xs leading-relaxed list-decimal list-inside text-slate-700 dark:text-slate-300">
            {REFERENCES.map(([key, text, url], idx) => (
              <li key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="font-semibold text-slate-900 dark:text-white">{text}</span>
                {url && (
                  <div className="mt-1">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      {url.replace(/^https?:\/\//, '').slice(0, 75)}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Clinical Disclaimer Footer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 leading-relaxed">
        <strong>Source & Clinical Disclaimer:</strong> Based on <em>"The 'Best' Antibiotic Sensitivity Chart Ever"</em> (James McCormack PharmD, Fawziah Lalji PharmD, Tim Lau, Faculty of Pharmaceutical Sciences, University of British Columbia, Nov 2019). Updated in September 2026 against IDSA AMR Guidance (2026), EUCAST Expected Resistant Phenotypes, IDSA/SHEA C. difficile Guidelines, and CDC STI Guidelines. This tool reflects general spectrum activity; always consult local institutional antibiograms, patient-specific cultures, and hospital antimicrobial stewardship guidelines before selecting therapy.
      </div>
    </div>
  );
};

export default BugDrugNavigator;
