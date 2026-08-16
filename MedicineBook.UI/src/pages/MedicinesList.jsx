import React, { useState, useEffect, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Upload, Search, RefreshCw, Plus, Edit, Trash2, X, Info, ClipboardList, Lightbulb } from 'lucide-react';
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

  const openInfoModal = async (medicineName) => {
    setCurrentInfoMedicine(medicineName);
    setInfoData(null);
    setInfoError('');
    setInfoLoading(true);
    setShowInfoModal(true);

    try {
      const res = await axios.get(`/api/medicines/scrape?name=${encodeURIComponent(medicineName)}`);
      setInfoData(res.data.data);
    } catch (err) {
      setInfoError(err.response?.data?.Message || 'Failed to fetch online details.');
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
                      <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-cyan-400 !border-cyan-400/30 hover:!bg-cyan-400/10" onClick={() => openInfoModal(m.category || m.name)}>
                        <Info size={14} /> AI Web Summary
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
                  <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-cyan-400 !border-cyan-400/30 hover:!bg-cyan-400/10" onClick={() => openInfoModal(m.category || m.name)}>
                    <Info size={14} /> Info
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
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center p-0 md:p-6 overflow-hidden animate-fade-in">
          <div className="glass-panel w-full max-w-2xl p-6 relative bg-white/95 dark:bg-slate-800/95 rounded-t-3xl md:rounded-2xl max-h-[95vh] overflow-y-auto animate-slide-up md:animate-scale-in">
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
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center p-0 md:p-4 overflow-hidden animate-fade-in">
          <div className="glass-panel w-full max-w-3xl p-6 relative bg-white/95 dark:bg-slate-800/95 rounded-t-3xl md:rounded-2xl max-h-[90vh] flex flex-col animate-slide-up md:animate-scale-in">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-6 md:hidden"></div>
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Info className="text-cyan-500" /> AI Knowledge Base
              </h2>
              <button onClick={() => setShowInfoModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
              {infoError && (
                <div className="bg-danger/10 text-danger p-4 rounded-xl mb-4 text-sm font-medium border border-danger/20">
                  {infoError}
                </div>
              )}
              
              {infoLoading ? (
                <div className="py-12 text-center text-slate-300 flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  Querying AI model...
                </div>
              ) : !infoData ? null : (
                <div className="flex flex-col gap-6">
                  
                  {/* OpenRouter AI Summary Section */}
                  {infoData.aiSummary ? (
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-xl p-5 border border-indigo-200 dark:border-indigo-500/30 shadow-sm">
                      <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        </div>
                        OpenRouter AI Insights
                      </h3>
                      <div className="text-sm text-indigo-900/80 dark:text-indigo-200/80 space-y-3 leading-relaxed whitespace-pre-wrap">
                        {infoData.aiSummary.content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-slate-500 italic">No AI insights generated. Please try again.</div>
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
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center p-0 md:p-4 overflow-hidden animate-fade-in" onClick={() => setShowWorkflowModal(false)}>
          <div className="glass-panel w-full max-w-4xl p-0 relative bg-slate-50 dark:bg-slate-900 rounded-t-3xl md:rounded-2xl max-h-[95vh] overflow-y-auto shadow-2xl animate-slide-up md:animate-scale-in" onClick={e => e.stopPropagation()}>
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
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center p-0 md:p-4 overflow-hidden animate-fade-in" onClick={() => setShowTipsModal(false)}>
          <div className="glass-panel w-full max-w-3xl p-6 relative bg-white/95 dark:bg-slate-800/95 rounded-t-3xl md:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up md:animate-scale-in" onClick={e => e.stopPropagation()}>
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
