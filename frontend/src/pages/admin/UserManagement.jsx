import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import Modal from '../../components/Modal';
import { Users, Search, Shield, ShieldCheck, UserCheck, Edit3 } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Role Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('customer');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userApi.getAllUsers();
      const list = res.data?.users || res.data || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users list');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'customer');
    setModalOpen(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUpdating(true);
    setError('');
    try {
      const userId = selectedUser.id || selectedUser.user_id;
      await userApi.updateUserRole(userId, newRole);
      setSuccess(`Role updated to "${newRole}" for ${selectedUser.name || selectedUser.email}`);
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user role');
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const role = (u.role || '').toLowerCase();
    return name.includes(q) || email.includes(q) || role.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage accounts, customer profiles, and assign operator / administrator privileges.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter users by name, email, or role..."
          className="w-full text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading users..." />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-gray-500 space-y-2">
            <Users className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm">No registered users found matching query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user, uIdx) => {
                  const role = user.role || 'customer';
                  const userId = user._id || user.id || user.user_id || `user-${uIdx}`;
                  let roleColor = 'bg-gray-100 text-gray-800';
                  if (role === 'admin') roleColor = 'bg-red-50 text-red-700 border-red-200';
                  if (role === 'operator') roleColor = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (role === 'customer') roleColor = 'bg-brand-accent/20 text-brand-dark border-brand-accent/40';

                  return (
                    <tr key={userId} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-brand-dark text-brand-accent flex items-center justify-center font-bold text-xs uppercase">
                            {user.name ? user.name[0] : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.name || 'Anonymous'}</p>
                            <p className="text-[10px] text-gray-400">ID: #{String(userId).slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-700">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {user.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${roleColor}`}>
                          {role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-medium">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-brand-accent/20 hover:text-brand-dark text-gray-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center space-x-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Change Role</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Assignment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Update User Access Role"
      >
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <p className="text-sm text-gray-600">
            Select a security role for{' '}
            <strong className="text-gray-900">{selectedUser?.name || selectedUser?.email}</strong>:
          </p>

          <div className="space-y-2">
            {[
              { id: 'customer', title: 'Customer (Passenger)', desc: 'Standard booking, ticket cancellation, and trip search privileges.' },
              { id: 'operator', title: 'Bus Operator', desc: 'Can manage assigned bus fleet and export passenger manifests.' },
              { id: 'admin', title: 'System Administrator', desc: 'Full administrative access across buses, routes, trips, and accounts.' },
            ].map((option) => (
              <label
                key={option.id}
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                  newRole === option.id
                    ? 'border-brand-dark bg-brand-accent/10 ring-2 ring-brand-accent/30'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value={option.id}
                  checked={newRole === option.id}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="mt-1 accent-[#6DCE05]"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900">{option.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm rounded-xl disabled:opacity-60 shadow-sm"
            >
              {updating ? 'Saving Role...' : 'Save Role'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
