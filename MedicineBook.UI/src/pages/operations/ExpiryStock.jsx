import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { Search, Download, Upload, Plus, Trash2, Save, AlertCircle, Loader2, PackageOpen } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExpiryStock = () => {
  const { addToast } = useToast();
  
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);
  
  const [stocks, setStocks] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get('/api/medicines?pageSize=1000');
      setMedicines(response.data.data || []);
    } catch (err) {
      addToast('Failed to load medicines', 'error');
    }
  };

  const fetchStocks = async (medicineId) => {
    setLoadingStocks(true);
    try {
      const response = await axios.get(`/api/stock/${medicineId}`);
      setStocks(response.data || []);
    } catch (err) {
      addToast('Failed to load stock data', 'error');
    } finally {
      setLoadingStocks(false);
    }
  };

  const handleSelectMed = (med) => {
    setSelectedMed(med);
    fetchStocks(med.id);
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRow = () => {
    setStocks([
      ...stocks, 
      { id: Date.now() * -1, batchNumber: '', expiryDate: '', quantity: 0, notes: '', isNew: true }
    ]);
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...stocks];
    updated[index][field] = value;
    updated[index].isDirty = true;
    setStocks(updated);
  };

  const handleDeleteRow = (index) => {
    const updated = [...stocks];
    updated.splice(index, 1);
    setStocks(updated);
  };

  const saveChanges = async () => {
    if (!selectedMed) return;
    setSaving(true);
    
    try {
      // Validate
      for (const s of stocks) {
        if (!s.batchNumber || !s.expiryDate) {
          throw new Error('Batch Number and Expiry Date are required for all rows.');
        }
      }

      await axios.post(`/api/stock/bulk/${selectedMed.id}`, stocks);
      addToast('Stock updated successfully', 'success');
      fetchStocks(selectedMed.id);
      
      axios.post('/api/analytics/track', {
        actionType: 'StockUpdate',
        details: `Updated stock for ${selectedMed.name}`
      }).catch(() => {});
      
    } catch (err) {
      addToast(err.message || 'Failed to update stock', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- Excel Operations --- //
  
  const downloadExcel = () => {
    if (!selectedMed) return;
    
    // Prepare data
    const data = stocks.map(s => ({
      'Medicine': selectedMed.name,
      'Batch Number': s.batchNumber,
      'Expiry Date': s.expiryDate ? new Date(s.expiryDate).toISOString().split('T')[0] : '',
      'Quantity': s.quantity,
      'Notes': s.notes || ''
    }));

    // If no stock, provide a template row
    if (data.length === 0) {
      data.push({
        'Medicine': selectedMed.name,
        'Batch Number': 'BATCH-001',
        'Expiry Date': '2026-12-31',
        'Quantity': 100,
        'Notes': 'Template row - replace with actual data'
      });
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    
    XLSX.writeFile(wb, `${selectedMed.name.replace(/[^a-z0-9]/gi, '_')}_Stock.xlsx`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedMed) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          addToast('Excel file is empty', 'error');
          return;
        }

        const newStocks = data.map((row, idx) => {
          let expDate = row['Expiry Date'];
          // Handle Excel date parsing
          if (expDate instanceof Date) {
            expDate = expDate.toISOString().split('T')[0];
          } else if (typeof expDate === 'number') {
            // Excel serial date to JS date
            const date = new Date((expDate - (25567 + 2)) * 86400 * 1000);
            expDate = date.toISOString().split('T')[0];
          }

          return {
            id: Date.now() * -1 - idx,
            batchNumber: row['Batch Number']?.toString() || '',
            expiryDate: expDate || '',
            quantity: parseInt(row['Quantity']) || 0,
            notes: row['Notes']?.toString() || '',
            isNew: true,
            isDirty: true
          };
        }).filter(s => s.batchNumber && s.batchNumber !== 'BATCH-001'); // filter out empty or template

        setStocks(newStocks);
        addToast('Excel loaded! Review and click Save to apply.', 'success');
      } catch (error) {
        addToast('Failed to parse Excel file', 'error');
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset input
  };

  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const exp = new Date(dateStr);
    const now = new Date();
    const monthsDiff = (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth());
    return monthsDiff <= 6; // 6 months threshold
  };
  
  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    const exp = new Date(dateStr);
    return exp < new Date();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-stretch animate-fade-in h-[calc(100vh-140px)]">
      
      {/* Sidebar: Medicine Selection */}
      <div className="w-full md:w-1/3 xl:w-1/4 flex flex-col bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Expiry & Stock</h2>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search medicines..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full pl-10 text-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {filteredMedicines.map(med => (
            <button 
              key={med.id}
              onClick={() => handleSelectMed(med)}
              className={`w-full text-left p-3 rounded-xl mb-1 transition-all active:scale-95 flex items-center justify-between ${
                selectedMed?.id === med.id 
                ? 'bg-primary text-white shadow-md' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold truncate text-sm">{med.name}</span>
              </div>
            </button>
          ))}
          {filteredMedicines.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">No medicines found</div>
          )}
        </div>
      </div>

      {/* Main Area: Stock Management */}
      <div className="w-full md:w-2/3 xl:w-3/4 flex flex-col bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden relative">
        {!selectedMed ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <PackageOpen size={48} className="mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Select a Medicine</h3>
            <p>Choose a medicine to manage its batches, stock quantities, and expiry dates.</p>
          </div>
        ) : (
          <>
            {/* Header Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedMed.name}</h3>
                <p className="text-xs text-slate-500">Stock Optimization</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={downloadExcel}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Download size={16} /> Excel
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Upload size={16} /> Upload
                </button>
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {loadingStocks ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-semibold rounded-tl-lg">Batch Number</th>
                        <th className="px-4 py-3 font-semibold">Expiry Date</th>
                        <th className="px-4 py-3 font-semibold w-24">Quantity</th>
                        <th className="px-4 py-3 font-semibold">Notes</th>
                        <th className="px-4 py-3 font-semibold rounded-tr-lg w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {stocks.map((stock, index) => {
                        const expired = isExpired(stock.expiryDate);
                        const expiringSoon = !expired && isExpiringSoon(stock.expiryDate);
                        
                        return (
                          <tr key={stock.id} className={`${expired ? 'bg-rose-50 dark:bg-rose-900/10' : expiringSoon ? 'bg-amber-50 dark:bg-amber-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                            <td className="px-4 py-2">
                              <input 
                                type="text" 
                                value={stock.batchNumber}
                                onChange={(e) => handleUpdateRow(index, 'batchNumber', e.target.value)}
                                className="glass-input w-full text-sm px-2 py-1 bg-transparent border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800"
                                placeholder="Batch"
                              />
                            </td>
                            <td className="px-4 py-2 relative">
                              <input 
                                type="date" 
                                value={stock.expiryDate ? stock.expiryDate.split('T')[0] : ''}
                                onChange={(e) => handleUpdateRow(index, 'expiryDate', e.target.value)}
                                className={`glass-input w-full text-sm px-2 py-1 bg-transparent border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 ${expired ? 'text-rose-600 font-bold' : expiringSoon ? 'text-amber-600 font-bold' : ''}`}
                              />
                              {(expired || expiringSoon) && (
                                <AlertCircle size={14} className={`absolute right-2 top-1/2 -translate-y-1/2 ${expired ? 'text-rose-500' : 'text-amber-500'}`} title={expired ? "Expired!" : "Expiring within 6 months"} />
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <input 
                                type="number" 
                                min="0"
                                value={stock.quantity}
                                onChange={(e) => handleUpdateRow(index, 'quantity', parseInt(e.target.value) || 0)}
                                className="glass-input w-full text-sm px-2 py-1 bg-transparent border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input 
                                type="text" 
                                value={stock.notes || ''}
                                onChange={(e) => handleUpdateRow(index, 'notes', e.target.value)}
                                className="glass-input w-full text-sm px-2 py-1 bg-transparent border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800"
                                placeholder="Notes..."
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button 
                                onClick={() => handleDeleteRow(index)}
                                className="text-slate-400 hover:text-danger p-1 rounded transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {stocks.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                            No stock recorded. Click 'Add Row' or upload an Excel file.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Toolbar */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between">
              <button 
                onClick={handleAddRow}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                <Plus size={16} /> Add Row
              </button>
              
              <button 
                onClick={saveChanges}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default ExpiryStock;
