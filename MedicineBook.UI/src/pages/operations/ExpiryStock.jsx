import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { Download, Upload, Plus, Trash2, Save, AlertCircle, Loader2, PackageOpen } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExpiryStock = () => {
  const { addToast } = useToast();
  
  const [stocks, setStocks] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoadingStocks(true);
    try {
      const response = await axios.get(`/api/stock`);
      setStocks(response.data || []);
    } catch (err) {
      addToast('Failed to load stock data', 'error');
    } finally {
      setLoadingStocks(false);
    }
  };

  const handleAddRow = () => {
    setStocks([
      ...stocks, 
      { id: Date.now() * -1, medicineName: '', batchNumber: '', expiryDate: '', quantity: 0, branch: '', notes: '', isNew: true }
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
    setSaving(true);
    
    try {
      // Validate
      const validStocks = [];
      for (const s of stocks) {
        if (!s.medicineName || !s.medicineName.trim()) continue; // Skip empty rows silently
        if (!s.batchNumber || !s.expiryDate) {
          throw new Error(`Batch Number and Expiry Date are required for ${s.medicineName}.`);
        }
        validStocks.push({
          ...s,
          id: s.id < 0 ? 0 : s.id
        });
      }

      await axios.post(`/api/stock/bulk-all`, validStocks);
      addToast('Stock updated successfully', 'success');
      fetchStocks();
      
    } catch (err) {
      addToast(err.message || 'Failed to update stock', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- Excel Operations --- //
  
  const downloadExcel = () => {
    // Prepare data
    const data = stocks.map(s => ({
      'Medicine Name': s.medicineName,
      'Batch Number': s.batchNumber,
      'Expiry Date': s.expiryDate ? new Date(s.expiryDate).toISOString().split('T')[0] : '',
      'Quantity': s.quantity,
      'Branch': s.branch || '',
      'Notes': s.notes || ''
    }));

    // If no stock, provide a template row
    if (data.length === 0) {
      data.push({
        'Medicine Name': 'Paracetamol 500mg',
        'Batch Number': 'BATCH-001',
        'Expiry Date': '2026-12-31',
        'Quantity': 100,
        'Branch': 'Main Pharmacy',
        'Notes': 'Template row - replace with actual data'
      });
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    
    XLSX.writeFile(wb, `Global_Medicine_Stock.xlsx`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
            medicineName: row['Medicine Name']?.toString() || '',
            batchNumber: row['Batch Number']?.toString() || '',
            expiryDate: expDate || '',
            quantity: parseInt(row['Quantity']) || 0,
            branch: row['Branch']?.toString() || '',
            notes: row['Notes']?.toString() || '',
            isNew: true,
            isDirty: true
          };
        }).filter(s => s.medicineName && s.medicineName !== 'Paracetamol 500mg' && s.batchNumber !== 'BATCH-001');

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
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-140px)]">
      
      {/* Main Area: Standalone Stock Management */}
      <div className="w-full flex flex-col bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden h-full">
        {/* Header Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <PackageOpen size={24} className="text-primary" />
              Global Stock Tracker
            </h3>
            <p className="text-xs text-slate-500">Standalone stock management. Download Excel, update, and upload.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={downloadExcel}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
            >
              <Download size={16} /> Download
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
            <div className="overflow-x-auto pb-16">
              <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
                <thead className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-lg min-w-[200px]">Medicine Name</th>
                    <th className="px-4 py-3 font-semibold">Batch Number</th>
                    <th className="px-4 py-3 font-semibold">Expiry Date</th>
                    <th className="px-4 py-3 font-semibold w-24">Quantity</th>
                    <th className="px-4 py-3 font-semibold min-w-[120px]">Branch</th>
                    <th className="px-4 py-3 font-semibold min-w-[150px]">Notes</th>
                    <th className="px-4 py-3 font-semibold rounded-tr-lg w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {stocks.map((stock, index) => {
                    const hasExpiry = !!stock.expiryDate;
                    const expired = hasExpiry && isExpired(stock.expiryDate);
                    const expiringSoon = hasExpiry && !expired && isExpiringSoon(stock.expiryDate);
                    const safe = hasExpiry && !expired && !expiringSoon;
                    
                    return (
                      <tr key={stock.id} className={`${expired ? 'bg-rose-50 dark:bg-rose-900/10' : expiringSoon ? 'bg-amber-50 dark:bg-amber-900/10' : safe ? 'bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={stock.medicineName || ''}
                            onChange={(e) => handleUpdateRow(index, 'medicineName', e.target.value)}
                            className="glass-input w-full text-sm px-2 py-1 bg-transparent border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800"
                            placeholder="Medicine Name"
                          />
                        </td>
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
                            className={`glass-input w-full text-sm px-2 py-1 bg-transparent border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 pr-8 ${expired ? 'text-rose-600 font-bold' : expiringSoon ? 'text-amber-600 font-bold' : safe ? 'text-emerald-600 font-bold' : ''}`}
                          />
                          {(expired || expiringSoon) && (
                            <AlertCircle size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 ${expired ? 'text-rose-500' : 'text-amber-500'}`} title={expired ? "Expired!" : "Expiring within 6 months"} />
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
                            value={stock.branch || ''}
                            onChange={(e) => handleUpdateRow(index, 'branch', e.target.value)}
                            className="glass-input w-full text-sm px-2 py-1 bg-transparent border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800"
                            placeholder="Branch"
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
                        <td className="px-4 py-2 text-center">
                          <button 
                            onClick={() => handleDeleteRow(index)}
                            className="text-slate-400 hover:text-danger p-1 rounded transition-colors inline-flex"
                            title="Remove Row"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {stocks.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                        <PackageOpen size={48} className="mx-auto mb-4 opacity-50 text-slate-400" />
                        <p className="font-semibold text-lg">No stock records found.</p>
                        <p className="text-sm">Click 'Add Row' or upload an Excel file to get started.</p>
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
      </div>
    </div>
  );
};

export default ExpiryStock;
