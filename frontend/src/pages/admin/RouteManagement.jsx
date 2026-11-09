import React, { useState, useEffect } from 'react';
import { routeApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import Modal from '../../components/Modal';
import { Route as RouteIcon, Plus, Edit2, Trash2, Search, ArrowRight } from 'lucide-react';

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRouteId, setCurrentRouteId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    destination: '',
    distance: '',
    duration: '',
  });

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await routeApi.getRoutes();
      const list = res.data?.routes || res.data || [];
      setRoutes(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentRouteId(null);
    setFormData({
      name: '',
      source: '',
      destination: '',
      distance: '',
      duration: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (route) => {
    setIsEditing(true);
    setCurrentRouteId(route.id || route.route_id);
    setFormData({
      name: route.name || '',
      source: route.source || '',
      destination: route.destination || '',
      distance: route.distance || '',
      duration: route.duration || '',
    });
    setModalOpen(true);
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        name: formData.name || `${formData.source} - ${formData.destination}`,
        distance: Number(formData.distance) || 0,
      };

      if (isEditing) {
        await routeApi.updateRoute(currentRouteId, payload);
        setSuccess('Route updated successfully!');
      } else {
        await routeApi.createRoute(payload);
        setSuccess('Route created successfully!');
      }
      setModalOpen(false);
      fetchRoutes();
    } catch (err) {
      setError(err.message || 'Failed to save route');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (route) => {
    setRouteToDelete(route);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!routeToDelete) return;
    setDeleting(true);
    try {
      const id = routeToDelete.id || routeToDelete.route_id;
      await routeApi.deleteRoute(id);
      setSuccess('Route deleted successfully!');
      setDeleteModalOpen(false);
      setRouteToDelete(null);
      fetchRoutes();
    } catch (err) {
      setError(err.message || 'Failed to delete route');
    } finally {
      setDeleting(false);
    }
  };

  const filteredRoutes = routes.filter((r) => {
    const q = searchQuery.toLowerCase();
    const name = (r.name || '').toLowerCase();
    const src = (r.source || '').toLowerCase();
    const dst = (r.destination || '').toLowerCase();
    return name.includes(q) || src.includes(q) || dst.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Route Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure intercity corridors, distances, and travel durations.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Route</span>
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
          placeholder="Search by source city, destination, or route name..."
          className="w-full text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading routes..." />
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="py-12 text-center text-gray-500 space-y-2">
            <RouteIcon className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm">No routes found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Route Name</th>
                  <th className="py-3 px-4">Origin / Source</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Distance (km)</th>
                  <th className="py-3 px-4">Typical Duration</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRoutes.map((route) => (
                  <tr key={route.id || route.route_id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {route.name || `${route.source} → ${route.destination}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-700">
                      {route.source}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-700">
                      {route.destination}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {route.distance ? `${route.distance} km` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {route.duration || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(route)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Route"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(route)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Route"
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

      {/* Add / Edit Route Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Route Corridor' : 'Create New Route'}
      >
        <form onSubmit={handleSaveRoute} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Route Name (Optional)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Mumbai - Pune Expressway Direct"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Source City *
              </label>
              <input
                type="text"
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g. Mumbai"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Destination City *
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. Pune"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="e.g. 150"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Typical Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 3h 30m"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60 shadow-sm"
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Route'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Route"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete route{' '}
            <strong className="text-gray-900 font-bold">
              {routeToDelete?.source} → {routeToDelete?.destination}
            </strong>
            ? This will also affect linked trips.
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
              {deleting ? 'Deleting...' : 'Delete Route'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
