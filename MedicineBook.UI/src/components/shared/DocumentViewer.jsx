import React from 'react';
import { X, ExternalLink } from 'lucide-react';

const DocumentViewer = ({ file, onClose }) => {
  if (!file) return null;

  const isImage = file.contentType.startsWith('image/');
  const isPdf = file.contentType === 'application/pdf';
  // Use Google Docs Viewer for standard Office documents
  const isOfficeDoc = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.contentType);

  // Determine full URL. If local (starts with /), we need the origin
  const fileUrl = file.filePath.startsWith('/') ? `${window.location.origin}${file.filePath}` : file.filePath;
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-surface w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up relative border border-slate-200 dark:border-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate pr-4">{file.fileName}</h3>
          <div className="flex items-center gap-2">
            <a 
              href={file.filePath} 
              target="_blank" 
              rel="noreferrer"
              className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Open in new tab"
            >
              <ExternalLink size={20} />
            </a>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-danger transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 bg-slate-100 dark:bg-black/50 overflow-hidden relative flex items-center justify-center">
          {isImage ? (
            <img 
              src={file.filePath} 
              alt={file.fileName} 
              className="max-w-full max-h-full object-contain p-4"
            />
          ) : isPdf ? (
            <iframe 
              src={file.filePath} 
              title={file.fileName}
              className="w-full h-full border-0"
            />
          ) : isOfficeDoc ? (
            <iframe 
              src={googleViewerUrl} 
              title={file.fileName}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <p className="mb-4">This file type cannot be previewed in the browser.</p>
              <a 
                href={file.filePath} 
                download
                className="bg-primary text-white px-6 py-2 rounded-xl font-bold"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
