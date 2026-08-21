import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { Search, UploadCloud, FileText, Image as ImageIcon, Trash2, Loader2, Eye } from 'lucide-react';
import DocumentViewer from './DocumentViewer';

const OperationsDocumentManager = ({ title, description, category }) => {
  const { addToast } = useToast();
  
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      // Fetch all medicines. In a real app with thousands, you'd debounce the search
      const response = await axios.get('/api/medicines?pageSize=1000');
      setMedicines(response.data.data || []);
    } catch (err) {
      addToast('Failed to load medicines', 'error');
    }
  };

  const fetchFiles = async (medicineId) => {
    setLoadingFiles(true);
    try {
      const response = await axios.get(`/api/medicines/${medicineId}/files?category=${category}`);
      setFiles(response.data.data || []);
    } catch (err) {
      addToast('Failed to load files', 'error');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleSelectMed = (med) => {
    setSelectedMed(med);
    fetchFiles(med.id);
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    (m.category && m.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (selectedFiles) => {
    if (!selectedMed) return;
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('category', category);

    setUploading(true);
    try {
      await axios.post(`/api/medicines/${selectedMed.id}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast(`Successfully uploaded ${selectedFiles.length} file(s)`, 'success');
      fetchFiles(selectedMed.id);
      
      axios.post('/api/analytics/track', {
        actionType: category,
        details: `Uploaded file for ${selectedMed.name}`
      }).catch(() => {});
      
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload files', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-stretch animate-fade-in h-[calc(100vh-140px)]">
      
      {/* Sidebar: Medicine Selection */}
      <div className="w-full md:w-1/3 flex flex-col bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search medicines..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full pl-10"
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
                <span className="font-bold truncate">{med.name}</span>
                {med.category && <span className={`text-xs opacity-80 truncate`}>{med.category}</span>}
              </div>
            </button>
          ))}
          {filteredMedicines.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">No medicines found</div>
          )}
        </div>
      </div>

      {/* Main Area: Document Management */}
      <div className="w-full md:w-2/3 flex flex-col bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden relative">
        {!selectedMed ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <FileText size={48} className="mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Select a Medicine</h3>
            <p>Choose a medicine from the list to view or upload {category} documents.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedMed.name}</h3>
                <p className="text-sm text-slate-500">Managing {title}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  isDragging 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-slate-300 dark:border-white/20 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <UploadCloud size={48} className={`mx-auto mb-4 ${isDragging ? 'text-primary animate-bounce-subtle' : 'text-slate-400'}`} />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Drag & Drop Files Here
                </h3>
                <p className="text-sm text-slate-500 mb-4">or click to browse files (PDF, Images, Word, Excel)</p>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {uploading ? 'Uploading...' : 'Select Files'}
                </button>
              </div>

              {/* Files List */}
              <div>
                <h4 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-200 dark:border-white/10 pb-2">
                  Uploaded Documents
                </h4>
                
                {loadingFiles ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                ) : files.length === 0 ? (
                  <div className="text-center p-8 text-slate-400 text-sm bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                    No documents found for this medicine.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {files.map(file => {
                      const isImg = file.contentType.startsWith('image/');
                      return (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl hover:shadow-md transition-all group">
                          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setViewingFile(file)}>
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                              {isImg ? <ImageIcon size={20} /> : <FileText size={20} />}
                            </div>
                            <div className="flex flex-col truncate">
                              <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate">{file.fileName}</span>
                              <span className="text-xs text-slate-400">{(file.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => setViewingFile(file)}
                            className="p-2 text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                            title="View Document"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>

      {viewingFile && (
        <DocumentViewer file={viewingFile} onClose={() => setViewingFile(null)} />
      )}
    </div>
  );
};

export default OperationsDocumentManager;
