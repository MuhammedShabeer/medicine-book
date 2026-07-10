import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Upload, Search, RefreshCw } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

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
    fetchMedicines();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMedicines();
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

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Medicine Inventory</h1>
          <p>View and manage pharmacy items</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {user.roles.includes('Admin') && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv,.xlsx" 
                style={{ display: 'none' }} 
              />
              <button 
                className="glass-button secondary" 
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Upload List'}
              </button>
            </>
          )}
          <button className="glass-button" onClick={fetchMedicines}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Search by name or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="glass-button">
            <Search size={18} />
            Search
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ overflow: 'x-auto' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>Loading medicines...</div>
        ) : medicines.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>No medicines found.</div>
        ) : (
          <table className="glass-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Batch #</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td>{m.category || '-'}</td>
                  <td>${m.price.toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 12px', 
                      background: m.quantity < 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
                      color: m.quantity < 10 ? 'var(--danger-color)' : 'var(--secondary-color)',
                      borderRadius: '12px', 
                      fontSize: '0.85rem' 
                    }}>
                      {m.quantity}
                    </span>
                  </td>
                  <td>{m.batchNumber || '-'}</td>
                  <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MedicinesList;
