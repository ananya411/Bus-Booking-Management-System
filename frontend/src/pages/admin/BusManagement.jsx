import React, { useState, useEffect } from 'react';
import { busApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { Bus, Plus, Edit2, Trash2, Search, Check, AlertTriangle } from 'lucide-react';

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBusId, setCurrentBusId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bus_number: '',
    name: '',
    bus_type: 'AC Sleeper (2+1)',
    total_seats: 36,
    operator_name: '',
    status: 'active',
  });

  // Delete Confirm State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await busApi.getBuses();
      const list = res.data?.buses || res.data || [];
      setBuses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentBusId(null);
    setFormData({
      bus_number: '',
      name: '',
      bus_type: 'AC Sleeper (2+1)',
      total_seats: 36,
      operator_name: '',
      status: 'active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (bus) => {
    setIsEditing(true);
    setCurrentBusId(bus.id || bus.bus_id);
    setFormData({
      bus_number: bus.bus_number || '',
      name: bus.name || bus.bus_name || '',
      bus_type: bus.bus_type || 'AC Sleeper (2+1)',
      total_seats: bus.total_seats || 36,
      operator_name: bus.operator?.name || bus.operator_name || '',
      status: bus.status || 'active',
    });
    setModalOpen(true);
  };

  const handleSaveBus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await busApi.updateBus(currentBusId, formData);
        setSuccess('Bus updated successfully!');
      } else {
        await busApi.createBus(formData);
        setSuccess('Bus created successfully!');
      }
      setModalOpen(false);
      fetchBuses();
    } catch (err) {
      setError(err.message || 'Failed to save bus details');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (bus) => {
    setBusToDelete(bus);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!busToDelete) return;
    setDeleting(true);
    try {
      const id = busToDelete.id || busToDelete.bus_id;
      await busApi.deleteBus(id);
      setSuccess('Bus deleted successfully!');
      setDeleteModalOpen(false);
      setBusToDelete(null);
      fetchBuses();
    } catch (err) {
      setError(err.message || 'Failed to delete bus');
    } finally {
      setDeleting(false);
    }
  };

  const filteredBuses = buses.filter((b) => {
    const q = searchQuery.toLowerCase();
    const num = (b.bus_number || '').toLowerCase();
    const name = (b.name || b.bus_name || '').toLowerCase();
    const type = (b.bus_type || '').toLowerCase();
    return num.includes(q) || name.includes(q) || type.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Bus Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure buses, seat layouts, and assigned operators.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm rounded-xl shadow-md shadow-brand-accent/20 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bus</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by bus number, model, or type..."
          className="w-full text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading buses..." />
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="py-12 text-center text-gray-500 space-y-2">
            <Bus className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm">No buses found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Bus Reg. No</th>
                  <th className="py-3 px-4">Bus Name / Model</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBuses.map((bus, bIdx) => (
                  <tr key={bus._id || bus.id || bus.bus_id || `bus-${bIdx}`} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {bus.bus_number}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {bus.name || bus.bus_name || 'Express Coach'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                        {bus.bus_type || 'AC Seater'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-dark">
                      {bus.total_seats || 36} seats
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {bus.operator?.name || bus.operator_name || (typeof bus.operator === 'string' ? bus.operator : 'System Managed')}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={bus.status || 'ACTIVE'} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(bus)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-brand-dark hover:bg-brand-accent/20 transition-colors"
                        title="Edit Bus"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(bus)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Bus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Bus Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Bus Information' : 'Add New Bus'}
      >
        <form onSubmit={handleSaveBus} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Vehicle Registration Number *
            </label>
            <input
              type="text"
              required
              value={formData.bus_number}
              onChange={(e) => setFormData({ ...formData, bus_number: e.target.value })}
              placeholder="e.g. MH-12-AB-9876"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Bus Display Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Royal Travels Scania Multi-Axle"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Bus Type *
              </label>
              <select
                value={formData.bus_type}
                onChange={(e) => setFormData({ ...formData, bus_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="AC Sleeper (2+1)">AC Sleeper (2+1)</option>
                <option value="AC Semi-Sleeper (2+2)">AC Semi-Sleeper (2+2)</option>
                <option value="Volvo Multi-Axle AC">Volvo Multi-Axle AC</option>
                <option value="Non-AC Seater (2+2)">Non-AC Seater (2+2)</option>
                <option value="BharatBenz Luxury Coach">BharatBenz Luxury Coach</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Total Seats *
              </label>
              <input
                type="number"
                min="10"
                max="60"
                required
                value={formData.total_seats}
                onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Assigned Operator Name
            </label>
            <input
              type="text"
              value={formData.operator_name}
              onChange={(e) => setFormData({ ...formData, operator_name: e.target.value })}
              placeholder="e.g. GreenLine Express"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Operational Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <option value="active">Active (Available for trips)</option>
              <option value="inactive">Inactive / In Maintenance</option>
            </select>
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
              disabled={saving}
              className="px-5 py-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm rounded-xl disabled:opacity-60 shadow-sm"
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Bus'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Bus"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete bus{' '}
            <strong className="text-gray-900 font-mono">{busToDelete?.bus_number}</strong> (
            {busToDelete?.name || 'Express Coach'})? This cannot be undone.
          </p>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60"
            >
              {deleting ? 'Deleting...' : 'Delete Bus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
