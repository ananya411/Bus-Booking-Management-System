import React, { useState, useEffect } from 'react';
import { stopApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import Modal from '../../components/Modal';
import { MapPin, Plus, Search, Building2, Navigation, Layers } from 'lucide-react';

export default function StopManagement() {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await stopApi.getStops(search ? { search } : {});
      const list = res.data?.stops || res.data || [];
      setStops(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch stops');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      city: '',
      state: '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.city.trim() || !formData.state.trim()) {
      setError('Please provide stop name, city, and state.');
      return;
    }

    setSaving(true);
    try {
      await stopApi.createStop({
        name: formData.name.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
      });
      setSuccess('Bus stop created successfully!');
      setModalOpen(false);
      fetchStops();
    } catch (err) {
      setError(err.message || 'Failed to save bus stop');
    } finally {
      setSaving(false);
    }
  };

  const filteredStops = stops.filter((stop) => {
    const q = searchQuery.toLowerCase();
    const name = (stop.name || '').toLowerCase();
    const city = (stop.city || '').toLowerCase();
    const state = (stop.state || '').toLowerCase();
    return name.includes(q) || city.includes(q) || state.includes(q);
  });

  const uniqueCities = new Set(stops.map((s) => s.city?.trim()).filter(Boolean)).size;
  const uniqueStates = new Set(stops.map((s) => s.state?.trim()).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-brand-accent/20 text-brand-dark">
              <MapPin className="w-6 h-6 text-brand-dark" />
            </span>
            <span>Bus Stop & Transit Hub Management</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure boarding terminals, intermediate bus stops, and destination transit hubs.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-accent text-brand-dark font-extrabold shadow-md shadow-brand-accent/20 hover:brightness-105 active:scale-95 transition-all text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stop</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-dark">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Stops</p>
            <p className="text-xl font-black text-gray-900">{stops.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Cities</p>
            <p className="text-xl font-black text-gray-900">{uniqueCities}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Covered States</p>
            <p className="text-xl font-black text-gray-900">{uniqueStates}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stops by name, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-gray-900"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">{filteredStops.length}</span> of {stops.length} stops
        </div>
      </div>

      {/* Stops Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner message="Loading bus stops..." />
          </div>
        ) : filteredStops.length === 0 ? (
          <div className="py-16 text-center">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Bus Stops Found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
              {searchQuery ? 'Try adjusting your search query.' : 'Add your first transit stop to enable route connections.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="mt-4 px-4 py-2 bg-brand-accent text-brand-dark rounded-xl text-xs font-bold hover:brightness-105 transition-all shadow"
              >
                Create Stop
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Stop / Terminal Name</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Terminal ID</th>
                  <th className="py-3 px-4 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredStops.map((stop) => (
                  <tr key={stop._id || stop.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-accent/15 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-brand-dark" />
                      </div>
                      <span className="truncate">{stop.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        {stop.city}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {stop.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-400">
                      {(stop._id || stop.id || '').substring(0, 8)}...
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-gray-500">
                      {stop.createdAt ? new Date(stop.createdAt).toLocaleDateString() : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Stop Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Bus Stop / Terminal">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Stop / Terminal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anand Vihar ISBT, Platform 4"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Delhi"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Delhi NCR"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-brand-accent text-brand-dark font-extrabold text-sm shadow-md shadow-brand-accent/20 hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all"
            >
              {saving ? 'Creating...' : 'Create Stop'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

