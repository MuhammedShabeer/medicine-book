import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import PdfBookReader from '../../components/PdfBookReader';
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  Sparkles, 
  FileUp, 
  Layers, 
  FolderOpen,
  Calendar,
  HardDrive
} from 'lucide-react';

const ExtemporaneousPrep = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const isAdmin = user?.roles?.includes('Admin');

  const [activePdfUrl, setActivePdfUrl] = useState('');
  const [activePdfName, setActivePdfName] = useState('Extemporaneous Preparations Book');
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Local File preview
  const localFileRef = useRef(null);

  useEffect(() => {
    fetchActiveBookAndList();
  }, []);

  const fetchActiveBookAndList = async () => {
    setLoading(true);
    try {
      // 1. Fetch active book
      const activeRes = await axios.get('/api/preparations/active');
      if (activeRes.data?.activePdfPath) {
        setActivePdfUrl(activeRes.data.activePdfPath);
        setActivePdfName(activeRes.data.activePdfName || 'Extemporaneous Preparations Book');
      }

      // 2. Fetch list of available documents
      const listRes = await axios.get('/api/preparations/list');
      if (Array.isArray(listRes.data)) {
        setDocumentList(listRes.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load preparation documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      addToast('Please select a PDF file to upload', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle || uploadFile.name);

    try {
      const res = await axios.post('/api/preparations/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      addToast('Book PDF uploaded successfully!', 'success');
      setActivePdfUrl(res.data.activePdfPath);
      setActivePdfName(res.data.activePdfName);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle('');
      fetchActiveBookAndList();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload PDF', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectBook = async (doc) => {
    setActivePdfUrl(doc.path);
    setActivePdfName(doc.fileName);

    if (isAdmin) {
      try {
        await axios.post('/api/preparations/set-active', {
          path: doc.path,
          name: doc.fileName
        });
      } catch (e) {}
    }
    addToast(`Opened "${doc.fileName}" as active book`, 'info');
  };

  const handleDeleteBook = async (doc) => {
    if (!window.confirm(`Are you sure you want to delete "${doc.fileName}"?`)) return;

    try {
      await axios.delete(`/api/preparations/${doc.fileName}`);
      addToast('Document deleted successfully', 'success');
      if (activePdfUrl === doc.path) {
        setActivePdfUrl('');
      }
      fetchActiveBookAndList();
    } catch (err) {
      addToast('Failed to delete document', 'error');
    }
  };

  const handleOpenLocalPdf = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setActivePdfUrl(fileUrl);
      setActivePdfName(file.name);
      addToast(`Opened local file: ${file.name}`, 'success');
    } else {
      addToast('Please select a valid PDF file', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <BookOpen className="text-primary" size={36} />
            Extemporaneous Preparations
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Pharmacy compounding formulas, standard recipes, and preparation manuals in interactive 2-page book format.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Open local PDF file */}
          <input
            type="file"
            ref={localFileRef}
            onChange={handleOpenLocalPdf}
            accept=".pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => localFileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-all"
            title="Open a local PDF file from your device to view as an open book"
          >
            <FolderOpen size={16} /> Open Local PDF
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-95"
            >
              <Upload size={16} /> Upload Book PDF
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Book Reader Component */}
      <PdfBookReader 
        pdfUrl={activePdfUrl} 
        title={activePdfName}
        onUploadClick={() => setShowUploadModal(true)}
        isAdmin={isAdmin}
        documentList={documentList}
        onSelectDocument={(path) => {
          const doc = documentList.find(d => d.path === path);
          if (doc) handleSelectBook(doc);
        }}
      />

      {/* Library of Uploaded Preparation Manuals */}
      {documentList.length > 0 && (
        <div className="bg-white/70 dark:bg-surface/80 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-lg mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="text-primary" size={20} />
              Preparation Manuals Library ({documentList.length})
            </h3>
            <span className="text-xs text-slate-500">Click any document to load it into the book viewer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentList.map((doc, idx) => {
              const isActive = activePdfUrl === doc.path;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectBook(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-primary/10 border-primary/40 shadow-md ring-2 ring-primary/30'
                      : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate" title={doc.fileName}>
                        {doc.fileName}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>{(doc.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/5">
                    {isActive ? (
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Check size={14} /> Currently Reading
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 hover:text-primary">
                        Read as Book →
                      </span>
                    )}

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBook(doc);
                        }}
                        className="p-1.5 text-slate-400 hover:text-danger rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload PDF Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-white/10 animate-slide-up">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                Upload Preparation Book PDF
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Book / Formulary Title (Optional)
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Standard Extemporaneous Compounding Manual 2026"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Select PDF File <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  required
                />
              </div>

              {uploadFile && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <FileText size={16} className="text-primary shrink-0" />
                  <span className="truncate font-mono">{uploadFile.name}</span>
                  <span className="shrink-0 text-slate-400">({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  {uploading ? 'Uploading...' : 'Upload & Set as Active'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtemporaneousPrep;
