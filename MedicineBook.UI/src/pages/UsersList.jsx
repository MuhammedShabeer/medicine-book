import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>User Management</h1>
          <p>Manage system users and their roles</p>
        </div>
        <button className="glass-button">
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>Loading users...</div>
        ) : (
          <table className="glass-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.fullName || '-'}</td>
                  <td>
                    <span style={{ padding: '4px 12px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '12px', fontSize: '0.85rem' }}>
                      {u.roles.join(', ')}
                    </span>
                  </td>
                  <td>
                    <button className="glass-button secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersList;
