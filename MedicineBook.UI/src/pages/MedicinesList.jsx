import React, { useState, useEffect, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Upload, Search, RefreshCw, Plus, Edit, Trash2, X, Info, ClipboardList, Lightbulb, Sparkles, RotateCw, Database, Check, CheckCircle2, Activity, AlertTriangle, Pill, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import WorkflowCard from '../components/WorkflowCard';
import WorkflowBuilder from '../components/WorkflowBuilder';
import MedicineFilesModal from '../components/MedicineFilesModal';

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 50;
  
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Info Modal states
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoData, setInfoData] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState('');
  const [currentInfoMedicine, setCurrentInfoMedicine] = useState('');
  const [currentInfoMedicineObj, setCurrentInfoMedicineObj] = useState(null);
  const [infoMetadata, setInfoMetadata] = useState({ isCached: false, generatedAt: null });
  
  // Workflow Card Modal states
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [workflowData, setWorkflowData] = useState(null);
  
  // Files Modal states
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [currentFileMedicine, setCurrentFileMedicine] = useState({ id: null, name: '' });
  
  // Tips Modal states
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [currentTipsMedicine, setCurrentTipsMedicine] = useState('');
  const [currentTipsData, setCurrentTipsData] = useState('');

  // Form states
  const [formData, setFormData] = useState({ id: '', code: '', name: '', quantity: 0, batchNumber: '', expiryDate: '', workflowData: '', tipsAndTricks: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/medicines?search=${search}&page=${page}&pageSize=${pageSize}`);
      setMedicines(res.data.data);
      setTotalItems(res.data.totalItems);
      setTotalPages(Math.ceil(res.data.totalItems / pageSize) || 1);

      if (search.length >= 3) {
        axios.post('/api/analytics/track', {
          actionType: 'Search',
          details: `Searched for: ${search}`
        }).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMedicines();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Form submit handler can just prevent default since real-time search handles fetching
  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await axios.post('/api/medicines/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Upload successful!', 'success');
      fetchMedicines();
    } catch (err) {
      addToast(err.response?.data?.Message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: '', code: '', name: '', quantity: 0, batchNumber: '', expiryDate: '', workflowData: '', tipsAndTricks: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleShowWorkflow = async (medicine) => {
    setWorkflowData(medicine.workflowData ? JSON.parse(medicine.workflowData) : null);
    setCurrentInfoMedicine(medicine.category || medicine.name);
    setShowWorkflowModal(true);
    
    // Track action
    try {
      await axios.post('/api/analytics/track', {
        actionType: 'View_Medicine',
        details: `Viewed workflow for ${medicine.name}`
      });
    } catch (e) { /* ignore */ }
  };

  const openInfoModal = async (medicine, forceRefresh = false) => {
    const medObj = typeof medicine === 'object' ? medicine : medicines.find(m => m.name === medicine || m.category === medicine) || { name: medicine };
    const medName = medObj.category || medObj.name;
    
    setCurrentInfoMedicine(medName);
    setCurrentInfoMedicineObj(medObj);
    setInfoError('');
    setShowInfoModal(true);

    // If cached in DB and not forcing a reload, display instantly!
    if (!forceRefresh && medObj.aiOverview) {
      setInfoData({ aiSummary: { content: medObj.aiOverview } });
      setInfoMetadata({ isCached: true, generatedAt: medObj.aiOverviewGeneratedAt });
      setInfoLoading(false);
      return;
    }

    setInfoLoading(true);
    if (forceRefresh) {
      setInfoData(null);
    }

    try {
      const url = medObj.id 
        ? `/api/medicines/scrape?id=${medObj.id}&name=${encodeURIComponent(medName)}&refresh=${forceRefresh}`
        : `/api/medicines/scrape?name=${encodeURIComponent(medName)}&refresh=${forceRefresh}`;

      const res = await axios.get(url);
      setInfoData(res.data.data);
      setInfoMetadata({ 
        isCached: res.data.isCached || false, 
        generatedAt: res.data.generatedAt || new Date().toISOString() 
      });

      // Update in-memory medicine list so it has the new aiOverview
      if (medObj.id && res.data.data?.aiSummary?.content) {
        setMedicines(prev => prev.map(m => m.id === medObj.id ? { 
          ...m, 
          aiOverview: res.data.data.aiSummary.content, 
          aiOverviewGeneratedAt: res.data.generatedAt || new Date().toISOString() 
        } : m));
        setCurrentInfoMedicineObj(prev => ({ 
          ...prev, 
          aiOverview: res.data.data.aiSummary.content,
          aiOverviewGeneratedAt: res.data.generatedAt || new Date().toISOString() 
        }));
      }
    } catch (err) {
      setInfoError(err.response?.data?.Message || err.message || 'Failed to generate clinical AI overview.');
    } finally {
      setInfoLoading(false);
    }
  };

  const openEditModal = (medicine) => {
    setModalMode('edit');
    setFormData({ 
      id: medicine.id, 
      code: medicine.name, // DB 'Name' maps to UI 'Code'
      name: medicine.category || '', // DB 'Category' maps to UI 'Name'
      quantity: medicine.quantity, 
      batchNumber: medicine.batchNumber || '', 
      expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : '',
      workflowData: medicine.workflowData || '',
      tipsAndTricks: medicine.tipsAndTricks || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete medicine code '${code}'?`)) return;
    
    try {
      await axios.delete(`/api/medicines/${id}`);
      addToast('Medicine deleted successfully', 'success');
      fetchMedicines();
    } catch (err) {
      addToast(err.response?.data?.Message || 'Failed to delete medicine', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    const payload = {
      name: formData.code,
      category: formData.name,
      quantity: parseInt(formData.quantity, 10),
      batchNumber: formData.batchNumber,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : new Date().toISOString(),
      price: 0, // Price is hidden in this app version
      description: '',
      supplier: '',
      workflowData: formData.workflowData,
      tipsAndTricks: formData.tipsAndTricks
    };

    try {
      if (modalMode === 'add') {
        await axios.post('/api/medicines', payload);
      } else {
        await axios.put(`/api/medicines/${formData.id}`, payload);
      }
      setShowModal(false);
      fetchMedicines();
    } catch (err) {
      setFormError(err.response?.data?.Message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const renderStructuredAiContent = (content) => {
    if (!content) return null;

    let data = null;
    try {
      data = typeof content === 'object' ? content : JSON.parse(content);
    } catch (e) {
      data = null;
    }

    // Fallback to plain text/markdown if not valid structured JSON
    if (!data || typeof data !== 'object') {
      return (
        <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-cyan-500/10 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-500/30 shadow-sm text-sm text-slate-800 dark:text-slate-200 space-y-3 leading-relaxed whitespace-pre-wrap font-sans">
          {content}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5">
        {/* Classification & Summary Hero */}
        <div className="bg-gradient-to-br from-cyan-500/10 via-primary/10 to-indigo-500/10 dark:from-cyan-950/30 dark:via-primary/20 dark:to-indigo-950/30 rounded-2xl p-5 border border-cyan-200 dark:border-cyan-800/40 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            {data.classification && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                {data.classification}
              </span>
            )}
            <span className="text-xs text-primary font-semibold flex items-center gap-1">
              <Sparkles size={14} /> AI Clinical Summary
            </span>
          </div>
          {data.summary && (
            <p className="text-slate-800 dark:text-slate-100 font-medium text-sm sm:text-base leading-relaxed mt-2">
              {data.summary}
            </p>
          )}
        </div>

        {/* Indications & Mechanism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Indications */}
          {data.indications && data.indications.length > 0 && (
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <CheckCircle2 size={16} />
                </div>
                Indications & Uses
              </h3>
              <ul className="space-y-2 flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {data.indications.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mechanism of Action */}
          {data.mechanismOfAction && (
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                  <Activity size={16} />
                </div>
                Pharmacology & Mechanism
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {data.mechanismOfAction}
              </p>
            </div>
          )}
        </div>

        {/* Dosage & Administration */}
        {data.dosageAndAdministration && data.dosageAndAdministration.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/10 text-cyan-500 rounded-lg">
                <Pill size={16} />
              </div>
              Dosage & Administration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.dosageAndAdministration.map((d, i) => (
                <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-white/5">
                  <div className="text-xs font-bold text-primary mb-1">
                    {typeof d === 'string' ? `Dosage Guideline #${i + 1}` : (d.indicationOrRoute || d.route || 'Dosage')}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {typeof d === 'string' ? d : d.dosage || d.details || JSON.stringify(d)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety & Warnings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Warnings & Precautions */}
          {data.precautionsAndWarnings && data.precautionsAndWarnings.length > 0 && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800/40 shadow-sm">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                  <AlertTriangle size={16} />
                </div>
                Precautions & Warnings
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90">
                {data.precautionsAndWarnings.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contraindications */}
          {data.contraindications && data.contraindications.length > 0 && (
            <div className="bg-rose-50/70 dark:bg-rose-950/20 rounded-2xl p-5 border border-rose-200 dark:border-rose-800/40 shadow-sm">
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-300 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
                  <ShieldAlert size={16} />
                </div>
                Contraindications
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-rose-900/90 dark:text-rose-200/90">
                {data.contraindications.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Side Effects */}
        {data.commonSideEffects && data.commonSideEffects.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5 flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg">
                <Activity size={16} />
              </div>
              Common Side Effects
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.commonSideEffects.map((se, i) => (
                <span key={i} className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-lg border border-purple-200 dark:border-purple-800/40">
                  {se}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Workflow & Dispensing Notes */}
        {data.workflowAndDispensingNotes && data.workflowAndDispensingNotes.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-50/80 via-white/80 to-cyan-50/80 dark:from-indigo-950/30 dark:via-slate-800/80 dark:to-cyan-950/30 rounded-2xl p-5 border border-indigo-200/80 dark:border-indigo-800/40 shadow-sm">
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm">
                <ClipboardList size={16} />
              </div>
              Pharmacy Workflow & Dispensing Insights
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-indigo-950/80 dark:text-indigo-200/90">
              {data.workflowAndDispensingNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl mb-2 text-slate-900 dark:text-white">Medicine Inventory</h1>
          <p className="text-slate-600 dark:text-slate-300">View and manage pharmacy items</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {user.roles.includes('Admin') && (
            <>
              <button 
                className="glass-button flex-1 md:flex-none justify-center text-sm md:text-base py-2" 
                onClick={openAddModal}
              >
                <Plus size={18} />
                Add Medicine
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv,.xlsx" 
                className="hidden"
              />
              <button 
                className="glass-button secondary flex-1 md:flex-none justify-center text-sm md:text-base py-2" 
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </>
          )}
          <button className="glass-button secondary flex-1 md:flex-none justify-center text-sm md:text-base py-2" onClick={fetchMedicines}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 md:p-6 mb-6">
        <form onSubmit={handleSearch} className="flex relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            className="glass-input flex-1 pl-11" 
            placeholder="Search by name or code..." 
            value={search}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      {loading ? (
        <div className="glass-panel p-8 text-center text-slate-600 dark:text-slate-300">Loading medicines...</div>
      ) : medicines.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-600 dark:text-slate-300">No medicines found.</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block glass-panel overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="glass-table w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Sl No.</th>
                  <th className="whitespace-nowrap">Code</th>
                  <th className="whitespace-nowrap">Name</th>
                  <th className="whitespace-nowrap">Qty</th>
                  <th className="whitespace-nowrap">Batch #</th>
                  <th className="whitespace-nowrap">Expiry Date</th>
                  <th className="whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m, index) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <td className="p-4 text-slate-500 font-medium">{(page - 1) * pageSize + index + 1}</td>
                    <td className="font-medium p-4">{m.name}</td>
                    <td className="p-4">{m.category || '-'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${m.quantity < 10 ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'}`}>
                        {m.quantity}
                      </span>
                    </td>
                    <td className="p-4">{m.batchNumber || '-'}</td>
                    <td className="p-4">{new Date(m.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-cyan-400 !border-cyan-400/30 hover:!bg-cyan-400/10" onClick={() => openInfoModal(m)}>
                        <Sparkles size={14} /> AI Overview
                      </button>
                      <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-purple-400 !border-purple-400/30 hover:!bg-purple-400/10" onClick={() => {
                        setCurrentFileMedicine({ id: m.id, name: m.category || m.name });
                        setShowFilesModal(true);
                      }}>
                        <Upload size={14} /> Files
                      </button>
                      <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-blue-400 !border-blue-400/30 hover:!bg-blue-400/10" onClick={() => {
                        setWorkflowData(m.workflowData ? JSON.parse(m.workflowData) : null);
                        setCurrentInfoMedicine(m.category || m.name);
                        setShowWorkflowModal(true);
                      }}>
                        <ClipboardList size={14} /> Workflow Card
                      </button>
                      <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-amber-400 !border-amber-400/30 hover:!bg-amber-400/10" onClick={() => {
                        setCurrentTipsData(m.tipsAndTricks || '');
                        setCurrentTipsMedicine(m.category || m.name);
                        setShowTipsModal(true);
                      }}>
                        <Lightbulb size={14} /> Tips
                      </button>
                      {user.roles.includes('Admin') && (
                        <>
                          <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1" onClick={() => openEditModal(m)}>
                            <Edit size={14} /> Edit
                          </button>
                          <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-danger !border-danger/30 hover:!bg-danger/10" onClick={() => handleDelete(m.id, m.name)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {medicines.map((m, index) => (
              <div key={m.id} className="glass-panel p-4 flex flex-col gap-2 relative">
                <div className="absolute top-0 left-0 bg-primary/10 text-primary px-2 py-1 rounded-br-lg text-[10px] font-bold">
                  #{(page - 1) * pageSize + index + 1}
                </div>
                <div className="flex justify-between items-start gap-4 pt-4">
                  <div className="flex-1">
                    <div className="text-xs font-mono text-primary mb-1">#{m.name}</div>
                    <div className="font-semibold text-slate-900 dark:text-white leading-tight break-words">{m.category || '-'}</div>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${m.quantity < 10 ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'}`}>
                    Qty: {m.quantity}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-white/10 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[0.65rem] uppercase tracking-wider mb-0.5">Batch #</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{m.batchNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[0.65rem] uppercase tracking-wider mb-0.5">Expiry</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{new Date(m.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-end flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                  <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-cyan-400 !border-cyan-400/30 hover:!bg-cyan-400/10" onClick={() => openInfoModal(m)}>
                    <Sparkles size={14} /> AI Overview
                  </button>
                  <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-purple-400 !border-purple-400/30 hover:!bg-purple-400/10" onClick={() => {
                    setCurrentFileMedicine({ id: m.id, name: m.category || m.name });
                    setShowFilesModal(true);
                  }}>
                    <Upload size={14} /> Files
                  </button>
                  <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-blue-400 !border-blue-400/30 hover:!bg-blue-400/10" onClick={() => {
                    setWorkflowData(m.workflowData ? JSON.parse(m.workflowData) : null);
                    setCurrentInfoMedicine(m.category || m.name);
                    setShowWorkflowModal(true);
                  }}>
                    <ClipboardList size={14} /> Workflow
                  </button>
                  <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-amber-400 !border-amber-400/30 hover:!bg-amber-400/10" onClick={() => {
                    setCurrentTipsData(m.tipsAndTricks || '');
                    setCurrentTipsMedicine(m.category || m.name);
                    setShowTipsModal(true);
                  }}>
                    <Lightbulb size={14} /> Tips
                  </button>
                  {user.roles.includes('Admin') && (
                    <>
                      <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5" onClick={() => openEditModal(m)}>
                        <Edit size={14} /> Edit
                      </button>
                      <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-danger !border-danger/30 hover:!bg-danger/10" onClick={() => handleDelete(m.id, m.name)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 glass-panel p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(page * pageSize, totalItems)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{totalItems}</span> medicines
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="glass-button secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center px-4 font-medium text-sm text-slate-700 dark:text-slate-300">
                  Page {page} of {totalPages}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  className="glass-button secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center items-center p-0 md:p-6 overflow-hidden animate-fade-in">
          <div className="glass-panel w-full max-w-2xl p-6 relative bg-white/95 dark:bg-slate-800/95 rounded-t-3xl md:rounded-2xl max-h-[95vh] overflow-y-auto animate-slide-up md:animate-scale-in mx-auto shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-6 md:hidden"></div>
            <button className="absolute top-4 md:top-6 right-4 md:right-6 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              {modalMode === 'add' ? 'Add New Medicine' : 'Edit Medicine'}
            </h2>

            {formError && (
              <div className="bg-danger/10 text-danger p-3 rounded-lg mb-4 text-sm font-medium border border-danger/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Code <span className="text-danger">*</span></label>
                <input type="text" className="glass-input py-2" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
              </div>
              
              <div>
                <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Name <span className="text-danger">*</span></label>
                <input type="text" className="glass-input py-2" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Quantity <span className="text-danger">*</span></label>
                  <input type="number" min="0" className="glass-input py-2" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Batch Number</label>
                  <input type="text" className="glass-input py-2" value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Expiry Date <span className="text-danger">*</span></label>
                <input type="date" className="glass-input py-2" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Tips & Tricks</label>
                <textarea 
                  className="glass-input py-2 w-full h-24 resize-none" 
                  placeholder="Enter useful tips or tricks for this medicine..."
                  value={formData.tipsAndTricks} 
                  onChange={e => setFormData({...formData, tipsAndTricks: e.target.value})} 
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" className="glass-button secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="glass-button flex-1" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Medicine'}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4">
               <WorkflowBuilder 
                 data={formData.workflowData ? JSON.parse(formData.workflowData) : null} 
                 onChange={(data) => setFormData({...formData, workflowData: JSON.stringify(data)})}
               />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Info Modal */}
      {showInfoModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center items-center p-0 md:p-4 overflow-hidden animate-fade-in">
          <div className="glass-panel w-full max-w-3xl p-6 relative bg-white/95 dark:bg-slate-800/95 rounded-t-3xl md:rounded-2xl max-h-[90vh] flex flex-col animate-slide-up md:animate-scale-in mx-auto shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-4 md:hidden"></div>
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Sparkles className="text-cyan-500" size={22} /> Clinical AI Overview
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Structured clinical insights & workflow context for <span className="font-semibold text-primary">#{currentInfoMedicine}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => openInfoModal(currentInfoMedicineObj, true)}
                  disabled={infoLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-xl text-xs font-semibold border border-cyan-500/30 transition-all active:scale-95 disabled:opacity-50"
                  title="Force refresh and regenerate AI overview with latest context"
                >
                  <RotateCw size={13} className={infoLoading ? "animate-spin" : ""} />
                  {infoLoading ? 'Regenerating...' : 'Regenerate Overview'}
                </button>
                <button 
                  onClick={() => setShowInfoModal(false)} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Status pill if cached / fresh */}
            {infoData && !infoLoading && (
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {infoMetadata.isCached ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 font-medium">
                      <Database size={12} /> Saved in Database (Instant Load)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-300 font-medium">
                      <Sparkles size={12} /> Freshly Generated & Saved
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-white/5">
              {infoError && (
                <div className="bg-danger/10 text-danger p-4 rounded-xl mb-4 text-sm font-medium border border-danger/20">
                  {infoError}
                </div>
              )}
              
              {/* Clinical AI Warning Banner */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs leading-relaxed mb-4">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-bold">Clinical Disclaimer:</span> AI-generated insights are for reference and pharmacy workflow assistance only. Always verify with official formularies, medical guidelines, and clinical judgement before dispensing.
                </div>
              </div>

              {infoLoading ? (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Consulting AI Model...</p>
                  <p className="text-xs text-slate-500 mt-1">Analyzing medicine data, workflow cards, and clinical tips.</p>
                </div>
              ) : !infoData ? null : (
                <div className="flex flex-col gap-6">
                  
                  {/* Structured AI Summary Section */}
                  {infoData.aiSummary ? (
                    renderStructuredAiContent(infoData.aiSummary.content)
                  ) : (
                    <div className="text-center p-8 text-slate-500 italic">No AI overview generated. Click 'Regenerate' to create one.</div>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Dedicated Workflow Card Modal */}
      {showWorkflowModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center items-center p-0 md:p-4 overflow-hidden animate-fade-in" onClick={() => setShowWorkflowModal(false)}>
          <div className="glass-panel w-full max-w-4xl p-0 relative bg-slate-50 dark:bg-slate-900 rounded-t-3xl md:rounded-2xl max-h-[95vh] overflow-y-auto shadow-2xl animate-slide-up md:animate-scale-in mx-auto" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-4 mb-2 md:hidden"></div>
            <button 
              className="absolute top-4 right-4 z-10 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full text-slate-600 dark:text-white hover:bg-white dark:hover:bg-black/80 transition-all shadow-sm"
              onClick={() => setShowWorkflowModal(false)}
            >
              <X size={20} />
            </button>
            {workflowData ? (
              <WorkflowCard drugName={currentInfoMedicine} data={workflowData} />
            ) : (
              <div className="glass-panel p-8 text-center bg-white/90 dark:bg-slate-800/90 w-full rounded-2xl shadow-xl">
                <ClipboardList className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={48} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Workflow Card</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No pharmacy workflow card has been authored for #{currentInfoMedicine} yet. Admin can create one by editing the medicine.
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Tips & Tricks Modal */}
      {showTipsModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center items-center p-0 md:p-4 overflow-hidden animate-fade-in" onClick={() => setShowTipsModal(false)}>
          <div className="glass-panel w-full max-w-3xl p-6 relative bg-white/95 dark:bg-slate-800/95 rounded-t-3xl md:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up md:animate-scale-in mx-auto" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-6 md:hidden"></div>
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-500 rounded-xl">
                  <Lightbulb size={24} />
                </div>
                Tips & Tricks for {currentTipsMedicine}
              </h2>
              <button onClick={() => setShowTipsModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
              
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-white/10 min-h-[100px]">
              {currentTipsData ? currentTipsData : <span className="italic text-slate-400">No tips and tricks have been added for this medicine yet.</span>}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Files Modal */}
      {showFilesModal && (
        <MedicineFilesModal 
          medicineId={currentFileMedicine.id} 
          medicineName={currentFileMedicine.name} 
          onClose={() => setShowFilesModal(false)} 
        />
      )}
    </div>
  );
};

export default MedicinesList;
