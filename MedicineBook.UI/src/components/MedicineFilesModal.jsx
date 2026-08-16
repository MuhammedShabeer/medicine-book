import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { X, UploadCloud, File, Image as ImageIcon, Video, Trash2, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MedicineFilesModal = ({ medicineId, medicineName, onClose }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles?.includes('Admin');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, [medicineId]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/medicines/${medicineId}/files`);
      setFiles(res.data.data);
    } catch (err) {
      setError(err.response?.data?.Message || 'Failed to load files.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFiles(e.target.files);
    }
  };

  const uploadFiles = async (selectedFiles) => {
    setError('');
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      await axios.post(`/api/medicines/${medicineId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.Message || 'Upload failed. File might be too large.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`/api/medicines/files/${fileId}`);
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.Message || 'Failed to delete file.');
    }
  };

  const getFileIcon = (contentType) => {
    if (contentType.startsWith('image/')) return <ImageIcon className="text-blue-400" size={32} />;
    if (contentType.startsWith('video/')) return <Video className="text-purple-400" size={32} />;
    return <File className="text-slate-400" size={32} />;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fade-in" onClick={onClose}>
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden bg-white/95 dark:bg-slate-900/95 shadow-2xl" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200 dark:border-white/10 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              Attachments
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Files and media for <span className="font-semibold text-primary">#{medicineName}</span>
            </p>
          </div>
          <button className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 bg-slate-100 dark:bg-white/5 rounded-full" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          
          {error && (
            <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm font-medium border border-danger/20 flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Upload Area (Admin Only) */}
          {isAdmin && (
            <div 
              className={`border-2 border-dashed rounded-2xl p-4 sm:p-8 text-center cursor-pointer transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleChange} />
              
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <UploadCloud size={32} />
                </div>
                {uploading ? (
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">Uploading files...</p>
                ) : (
                  <>
                    <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">Drag & drop files here</p>
                    <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 sm:hidden">Tap here to upload files</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">or click anywhere in this box to browse from your computer</p>
                    <button type="button" className="glass-button secondary mt-2 sm:mt-4 py-1.5 px-6 pointer-events-none">
                      Browse Files
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Files Grid */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
              Uploaded Files ({files.length})
            </h3>
            
            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                No files have been attached to this medicine yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files.map(file => (
                  <div key={file.id} className="group flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all">
                    
                    {/* Preview Area */}
                    <div className="h-32 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden">
                      {file.contentType.startsWith('image/') ? (
                        <img src={encodeURI(file.filePath)} alt={file.fileName} className="w-full h-full object-cover" />
                      ) : file.contentType.startsWith('video/') ? (
                        <video src={encodeURI(file.filePath)} className="w-full h-full object-cover" />
                      ) : (
                        getFileIcon(file.contentType)
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button onClick={() => setPreviewFile(file)} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors" title="View File">
                          {file.contentType.startsWith('image/') || file.contentType.startsWith('video/') ? <ExternalLink size={18} /> : <Download size={18} />}
                        </button>
                        {isAdmin && (
                          <button onClick={() => handleDelete(file.id)} className="p-2 bg-danger/80 text-white rounded-full hover:bg-danger transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* File Info */}
                    <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title={file.fileName}>
                        {file.fileName}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{formatBytes(file.fileSize)}</span>
                        <span className="text-[10px] text-slate-500">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* File Preview Popup */}
      {previewFile && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in" onClick={() => setPreviewFile(null)}>
          <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full" onClick={() => setPreviewFile(null)}>
            <X size={24} />
          </button>
          
          <div className="w-full max-w-5xl flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
            {previewFile.contentType.startsWith('image/') ? (
              <img src={encodeURI(previewFile.filePath)} alt={previewFile.fileName} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
            ) : previewFile.contentType.startsWith('video/') ? (
              <video src={encodeURI(previewFile.filePath)} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
            ) : (
              <div className="bg-slate-800 p-8 rounded-2xl text-center shadow-2xl border border-white/10 flex flex-col items-center max-w-sm w-full">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  {getFileIcon(previewFile.contentType)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 break-all">{previewFile.fileName}</h3>
                <p className="text-slate-400 mb-6 text-sm">Preview is not available for this file type.</p>
                <a href={encodeURI(previewFile.filePath)} download target="_blank" rel="noreferrer" className="glass-button secondary w-full py-2.5 flex items-center justify-center gap-2">
                  <Download size={18} /> Download File
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineFilesModal;
