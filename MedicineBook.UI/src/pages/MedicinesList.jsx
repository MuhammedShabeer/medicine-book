import React, { useState, useEffect, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Upload, Search, RefreshCw, Plus, Edit, Trash2, X, Info, ClipboardList } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import WorkflowCard from '../components/WorkflowCard';
import WorkflowBuilder from '../components/WorkflowBuilder';

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  
  const { user } = useContext(AuthContext);
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
  
  // Form states
  const [formData, setFormData] = useState({ id: '', code: '', name: '', quantity: 0, batchNumber: '', expiryDate: '', workflowData: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/medicines?search=${search}`);
      setMedicines(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount is handled because search is initially empty
    const delayDebounceFn = setTimeout(() => {
      fetchMedicines();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]); // Re-fetch whenever search string changes

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
      alert('Upload successful!');
      fetchMedicines();
    } catch (err) {
      alert(err.response?.data?.Message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: '', code: '', name: '', quantity: 0, batchNumber: '', expiryDate: '', workflowData: '' });
    setFormError('');
    setShowModal(true);
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
      workflowData: medicine.workflowData || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete medicine code '${code}'?`)) return;
    
    try {
      await axios.delete(`/api/medicines/${id}`);
      fetchMedicines();
    } catch (err) {
      alert(err.response?.data?.Message || 'Failed to delete medicine');
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
      workflowData: formData.workflowData
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
            onChange={(e) => setSearch(e.target.value)}
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
                  <th className="whitespace-nowrap">Code</th>
                  <th className="whitespace-nowrap">Name</th>
                  <th className="whitespace-nowrap">Qty</th>
                  <th className="whitespace-nowrap">Batch #</th>
                  <th className="whitespace-nowrap">Expiry Date</th>
                  {user.roles.includes('Admin') && <th className="whitespace-nowrap text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <td className="font-medium p-4">{m.name}</td>
                    <td className="p-4">{m.category || '-'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${m.quantity < 10 ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'}`}>
                        {m.quantity}
                      </span>
                    </td>
                    <td className="p-4">{m.batchNumber || '-'}</td>
                    <td className="p-4">{new Date(m.expiryDate).toLocaleDateString()}</td>
                    {user.roles.includes('Admin') && (
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-cyan-400 !border-cyan-400/30 hover:!bg-cyan-400/10" onClick={() => openInfoModal(m.category || m.name)}>
                          <Info size={14} /> AI Web Summary
                        </button>
                        <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-blue-400 !border-blue-400/30 hover:!bg-blue-400/10" onClick={() => {
                          setWorkflowData(m.workflowData ? JSON.parse(m.workflowData) : null);
                          setCurrentInfoMedicine(m.category || m.name);
                          setShowWorkflowModal(true);
                        }}>
                          <ClipboardList size={14} /> Workflow Card
                        </button>
                        <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1" onClick={() => openEditModal(m)}>
                          <Edit size={14} /> Edit
                        </button>
                        <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-danger !border-danger/30 hover:!bg-danger/10" onClick={() => handleDelete(m.id, m.name)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {medicines.map(m => (
              <div key={m.id} className="glass-panel p-4 flex flex-col gap-2 relative">
                <div className="flex justify-between items-start gap-4">
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

                {user.roles.includes('Admin') && (
                  <div className="flex justify-end flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                    <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-cyan-400 !border-cyan-400/30 hover:!bg-cyan-400/10" onClick={() => openInfoModal(m.category || m.name)}>
                      <Info size={14} /> Info
                    </button>
                    <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-blue-400 !border-blue-400/30 hover:!bg-blue-400/10" onClick={() => {
                      setWorkflowData(m.workflowData ? JSON.parse(m.workflowData) : null);
                      setCurrentInfoMedicine(m.category || m.name);
                      setShowWorkflowModal(true);
                    }}>
                      <ClipboardList size={14} /> Workflow
                    </button>
                    <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5" onClick={() => openEditModal(m)}>
                      <Edit size={14} /> Edit
                    </button>
                    <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-danger !border-danger/30 hover:!bg-danger/10" onClick={() => handleDelete(m.id, m.name)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="glass-panel w-full max-w-2xl p-6 relative my-8 bg-white/95 dark:bg-slate-800/95">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" onClick={() => setShowModal(false)}>
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
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel bg-white/95 dark:bg-slate-800/95 w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
              <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" onClick={() => setShowInfoModal(false)}>
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2 text-slate-900 dark:text-white">
                <Info className="text-cyan-500 dark:text-cyan-400" />
                Aggregated AI Mode
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Live Data Overview for <span className="font-semibold text-slate-900 dark:text-white">#{currentInfoMedicine}</span>
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
              {infoError && (
                <div className="bg-danger/10 text-danger p-4 rounded-xl mb-4 text-sm font-medium border border-danger/20">
                  {infoError}
                </div>
              )}
              
              {infoLoading ? (
                <div className="py-12 text-center text-slate-300 flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  Querying multiple sources...
                </div>
              ) : !infoData ? null : (
                <div className="flex flex-col gap-6">
                  
                  {/* DuckDuckGo Section */}
                  <div className="bg-white dark:bg-white/5 rounded-xl p-5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      Web Summary (DuckDuckGo)
                    </h3>
                    {infoData.duckDuckGo ? (
                      <>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{infoData.duckDuckGo.snippet}</p>
                        <a href={infoData.duckDuckGo.url} target="_blank" rel="noopener noreferrer" className="text-orange-400 text-sm hover:underline">View Search Results ↗</a>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No web summary found.</p>
                    )}
                  </div>

                  {/* Wikipedia Section */}
                  <div className="bg-white dark:bg-white/5 rounded-xl p-5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Wikipedia Medical Overview
                    </h3>
                    {infoData.wikipedia ? (
                      <>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{infoData.wikipedia.summary}</p>
                        <a href={infoData.wikipedia.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">Read full article ↗</a>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No Wikipedia data found.</p>
                    )}
                  </div>

                  {/* FDA Section */}
                  <div className="bg-white dark:bg-white/5 rounded-xl p-5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      US FDA Database
                    </h3>
                    {infoData.openFda ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
                        {infoData.openFda.activeIngredient && (
                           <div><strong className="text-slate-900 dark:text-slate-100 block mb-1">Active Ingredient:</strong> {infoData.openFda.activeIngredient}</div>
                        )}
                        {infoData.openFda.purpose && (
                           <div><strong className="text-slate-900 dark:text-slate-100 block mb-1">Purpose:</strong> {infoData.openFda.purpose}</div>
                        )}
                        {infoData.openFda.warnings && (
                           <div className="md:col-span-2"><strong className="text-slate-900 dark:text-slate-100 block mb-1">Warnings:</strong> <span className="line-clamp-3">{infoData.openFda.warnings}</span></div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No exact FDA match found.</p>
                    )}
                  </div>
                  


                  {/* Wellcare Section */}
                  <div className="bg-white dark:bg-white/5 rounded-xl p-5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      Local Pharmacy Pricing (Wellcare Qatar)
                    </h3>
                    {infoData.wellcare?.length > 0 ? (
                      <div className="flex flex-col gap-3 mt-4">
                        {infoData.wellcare.map((item, index) => (
                          <div key={index} className="flex gap-4 items-center bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-slate-200 dark:border-white/5">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-contain bg-white rounded p-1" />
                            ) : (
                              <div className="w-16 h-16 bg-slate-200 dark:bg-white/10 rounded flex items-center justify-center text-xs text-slate-500">No Img</div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                              <div className="text-green-500 dark:text-green-400 font-medium text-sm mt-1">{item.price}</div>
                              {item.productUrl && <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-green-400 mt-1 inline-block">View Store Page</a>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No local pricing matches found.</p>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Dedicated Workflow Card Modal */}
      {showWorkflowModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowWorkflowModal(false)}>
          <div className="relative w-full max-w-md flex justify-center" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-all p-1.5 bg-black/20 rounded-full hover:bg-black/40 backdrop-blur-md shadow-sm" onClick={() => setShowWorkflowModal(false)}>
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
    </div>
  );
};

export default MedicinesList;
