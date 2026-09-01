import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Bell, Trash2, Plus, Megaphone, Loader2, Paperclip, Download } from 'lucide-react';

const Announcements = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const isAdmin = user?.roles?.includes('Admin');

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      addToast('Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) {
      addToast('Title and content are required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', newAnnouncement.title);
      formData.append('content', newAnnouncement.content);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      await axios.post('/api/announcements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Announcement created successfully', 'success');
      setShowModal(false);
      setNewAnnouncement({ title: '', content: '' });
      setAttachment(null);
      fetchAnnouncements();
    } catch (err) {
      addToast('Failed to create announcement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      addToast('Announcement deleted', 'success');
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (err) {
      addToast('Failed to delete announcement', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white/60 dark:bg-slate-800/60 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-200">
            <Megaphone size={28} className="text-primary" />
            Announcements
          </h2>
          <p className="text-sm text-slate-500 mt-1">Stay updated with the latest news and notices.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={18} /> New Announcement
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center p-12 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-white/5">
            <Bell size={48} className="mx-auto text-slate-400 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">No Announcements</h3>
            <p className="text-slate-500 text-sm mt-2">There are currently no announcements to display.</p>
          </div>
        ) : (
          announcements.map(announcement => (
            <div key={announcement.id} className="bg-white/80 dark:bg-surface p-6 rounded-2xl shadow-md border border-slate-200 dark:border-white/10 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{announcement.title}</h3>
                  <div className="text-xs text-slate-500 mb-4 font-medium">
                    Posted by <span className="text-primary">{announcement.createdBy || 'Admin'}</span> on {new Date(announcement.createdAt).toLocaleDateString()} at {new Date(announcement.createdAt).toLocaleTimeString()}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{announcement.content}</p>
                  
                  {announcement.attachmentPath && (
                    <div className="mt-4">
                      <a 
                        href={announcement.attachmentPath} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-white/5"
                      >
                        <Paperclip size={14} />
                        <span className="truncate max-w-[200px]">{announcement.attachmentName}</span>
                        <Download size={14} className="ml-1 opacity-50" />
                      </a>
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 text-slate-400 hover:text-danger rounded-lg transition-colors bg-slate-100 hover:bg-rose-50 dark:bg-white/5 dark:hover:bg-rose-500/10"
                    title="Delete Announcement"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-white/10 animate-slide-up">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Create Announcement</h3>
            </div>
            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newAnnouncement.title}
                  onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                  placeholder="Announcement Title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea 
                  value={newAnnouncement.content}
                  onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  className="w-full h-32 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white resize-none"
                  placeholder="Write your announcement here..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Attachment (Optional)</label>
                <input 
                  type="file"
                  onChange={e => setAttachment(e.target.files[0])}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
