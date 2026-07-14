import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { UserPlus, Edit, Trash2, X } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Form states
  const [formData, setFormData] = useState({ id: '', username: '', fullName: '', password: '', role: 'Staff' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: '', username: '', fullName: '', password: '', role: 'Staff' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setFormData({ 
      id: user.id, 
      username: user.username, 
      fullName: user.fullName || '', 
      password: '', // Leave blank to not update password
      role: user.roles[0] || 'Staff' 
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete user '${username}'?`)) return;
    
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.Message || 'Failed to delete user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (modalMode === 'add') {
        await axios.post('/api/users', {
          username: formData.username,
          fullName: formData.fullName,
          password: formData.password,
          role: formData.role
        });
      } else {
        await axios.put(`/api/users/${formData.id}`, {
          fullName: formData.fullName,
          password: formData.password, // Only sent if user typed a new one
          role: formData.role
        });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.Message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl mb-2 text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage system users and their roles</p>
        </div>
        <button className="glass-button justify-center" onClick={openAddModal}>
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {loading ? (
        <div className="glass-panel p-8 text-center text-slate-600 dark:text-slate-300">Loading users...</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block glass-panel overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="glass-table w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Username</th>
                  <th className="whitespace-nowrap">Full Name</th>
                  <th className="whitespace-nowrap">Roles</th>
                  <th className="whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <td className="p-4 font-medium">{u.username}</td>
                    <td className="p-4">{u.fullName || '-'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.roles.includes('Admin') ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                        {u.roles.join(', ')}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1" onClick={() => openEditModal(u)}>
                        <Edit size={14} /> Edit
                      </button>
                      <button className="glass-button secondary py-1 px-3 text-sm flex items-center gap-1 !text-danger !border-danger/30 hover:!bg-danger/10" onClick={() => handleDelete(u.id, u.username)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {users.map(u => (
              <div key={u.id} className="glass-panel p-4 flex flex-col gap-2 relative">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-mono text-primary mb-1">@{u.username}</div>
                    <div className="font-semibold text-slate-900 dark:text-white leading-tight break-words">{u.fullName || '-'}</div>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${u.roles.includes('Admin') ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                    {u.roles.join(', ')}
                  </span>
                </div>

                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                  <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5" onClick={() => openEditModal(u)}>
                    <Edit size={14} /> Edit
                  </button>
                  <button className="glass-button secondary py-1.5 px-4 text-sm flex items-center gap-1.5 !text-danger !border-danger/30 hover:!bg-danger/10" onClick={() => handleDelete(u.id, u.username)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 relative bg-white/95 dark:bg-slate-800/95">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              {modalMode === 'add' ? 'Add New User' : 'Edit User'}
            </h2>

            {formError && (
              <div className="bg-danger/10 text-danger p-3 rounded-lg mb-4 text-sm font-medium border border-danger/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {modalMode === 'add' && (
                <div>
                  <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Username <span className="text-danger">*</span></label>
                  <input type="text" className="glass-input py-2" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
              )}
              
              <div>
                <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Full Name</label>
                <input type="text" className="glass-input py-2" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Password {modalMode === 'add' ? <span className="text-danger">*</span> : <span className="text-xs text-slate-500 dark:text-slate-400 font-normal ml-2">(Leave blank to keep unchanged)</span>}
                </label>
                <input type="password" className="glass-input py-2" required={modalMode === 'add'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-700 dark:text-slate-300 font-medium">Role <span className="text-danger">*</span></label>
                <select className="glass-input py-2 bg-slate-50 dark:bg-slate-800" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" className="glass-button secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="glass-button flex-1" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UsersList;
