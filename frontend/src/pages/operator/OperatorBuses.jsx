import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { busApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import Modal from '../../components/Modal';
import {
  Bus,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  Calendar,
  Users,
  Wifi,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const BUS_TYPES = [
  'AC Sleeper',
  'AC Seater',
  'Non-AC Sleeper',
  'Non-AC Seater',
  'Volvo',
  'Mini',
];

const COMMON_AMENITIES = [
  'Free High-Speed Wi-Fi',
  'USB & Type-C Charging Ports',
  'Clean Blanket & Pillow',
  'Complimentary Water Bottle',
  'Emergency SOS & CCTV',
  'Reading Light',
  'GPS Live Tracking',
  'Air Conditioning',
];

export default function OperatorBuses() {
  const navigate = useNavigate();
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
    busNumber: '',
    name: '',
    type: 'AC Sleeper',
    totalSeats: 36,
    rows: 9,
    seatsPerRow: 4,
    amenities: ['Free High-Speed Wi-Fi', 'USB & Type-C Charging Ports', 'GPS Live Tracking'],
    isActive: true,
  });

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyBuses();
  }, []);

  const fetchMyBuses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await busApi.getMyBuses();
      const list = res.data?.buses || res.data || [];
      setBuses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load operator buses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentBusId(null);
    setFormData({
      busNumber: '',
      name: '',
      type: 'AC Sleeper',
      totalSeats: 36,
      rows: 9,
      seatsPerRow: 4,
      amenities: ['Free High-Speed Wi-Fi', 'USB & Type-C Charging Ports', 'GPS Live Tracking'],
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (bus) => {
    setIsEditing(true);
    setCurrentBusId(bus._id || bus.id || bus.bus_id);
    const total = bus.totalSeats || bus.total_seats || 36;
    const rows = bus.seatLayout?.rows || Math.ceil(total / 4);
    const seatsPerRow = bus.seatLayout?.seatsPerRow || 4;
    setFormData({
      busNumber: bus.busNumber || bus.bus_number || '',
      name: bus.name || bus.bus_name || '',
      type: bus.type || bus.bus_type || 'AC Sleeper',
      totalSeats: total,
      rows: rows,
      seatsPerRow: seatsPerRow,
      amenities: Array.isArray(bus.amenities) ? bus.amenities : ['GPS Live Tracking'],
      isActive: bus.isActive !== undefined ? bus.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSaveBus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const totalSeats = Number(formData.totalSeats) || 36;
      const rows = Number(formData.rows) || Math.ceil(totalSeats / 4);
      const seatsPerRow = Number(formData.seatsPerRow) || 4;

      const payload = {
        busNumber: formData.busNumber.trim().toUpperCase(),
        name: formData.name.trim(),
        type: formData.type,
        totalSeats,
        seatLayout: {
          rows,
          seatsPerRow,
          layout: [],
        },
        amenities: formData.amenities,
        isActive: formData.isActive,
      };

      if (isEditing) {
        await busApi.updateBus(currentBusId, payload);
        setSuccess('Bus details updated successfully!');
      } else {
        await busApi.createBus(payload);
        setSuccess('New bus added to your fleet successfully!');
      }
      setModalOpen(false);
      fetchMyBuses();
    } catch (err) {
      setError(err.message || 'Failed to save bus');
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
      const id = busToDelete._id || busToDelete.id || busToDelete.bus_id;
      await busApi.deleteBus(id);
      setSuccess('Bus removed from your fleet!');
      setDeleteModalOpen(false);
      setBusToDelete(null);
      fetchMyBuses();
    } catch (err) {
      setError(err.message || 'Failed to delete bus');
    } finally {
      setDeleting(false);
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const filteredBuses = buses.filter((b) => {
    const q = searchQuery.toLowerCase();
    const num = (b.busNumber || b.bus_number || '').toLowerCase();
    const name = (b.name || b.bus_name || '').toLowerCase();
    const type = (b.type || b.bus_type || '').toLowerCase();
    return num.includes(q) || name.includes(q) || type.includes(q);
  });

  const totalCapacity = buses.reduce((acc, b) => acc + (b.totalSeats || b.total_seats || 36), 0);
  const activeCount = buses.filter((b) => b.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-brand-accent/20 text-brand-dark">
              <Bus className="w-6 h-6 text-brand-dark" />
            </span>
            <span>My Fleet &amp; Bus Management</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Register new coaches, configure seating layouts, and dispatch your fleet on active customer routes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/operator/schedule-trip"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-darker text-brand-accent font-extrabold text-sm border border-brand-border shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Add Bus to Route</span>
          </Link>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-accent text-brand-dark font-extrabold text-sm shadow-md shadow-brand-accent/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bus</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-brand-accent/15 rounded-xl text-brand-dark">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Fleet Buses</p>
            <p className="text-2xl font-black text-gray-900">{buses.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active In-Service</p>
            <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Seat Capacity</p>
            <p className="text-2xl font-black text-gray-900">{totalCapacity} Berths</p>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Search & Counter Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by registration number, coach name, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-gray-900"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">{filteredBuses.length}</span> of {buses.length} buses
        </div>
      </div>

      {/* Buses Fleet Grid / Cards */}
      {loading ? (
        <div className="py-20 flex justify-center bg-white rounded-2xl border border-gray-100">
          <LoadingSpinner message="Loading your operator fleet..." />
        </div>
      ) : filteredBuses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
          <Bus className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Buses Registered Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No buses match your search criteria. Try a different query.'
              : 'Add your first coach to your fleet to begin scheduling routes and selling tickets.'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-brand-accent text-brand-dark font-extrabold text-xs shadow-md shadow-brand-accent/20 hover:brightness-105 transition-all"
            >
              Add Your First Bus
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBuses.map((bus) => {
            const busId = bus._id || bus.id || bus.bus_id;
            const busNumber = bus.busNumber || bus.bus_number;
            const name = bus.name || bus.bus_name || 'Express Coach';
            const type = bus.type || bus.bus_type || 'AC Sleeper';
            const total = bus.totalSeats || bus.total_seats || 36;
            const amenities = Array.isArray(bus.amenities) ? bus.amenities : [];
            const isActive = bus.isActive !== false;

            return (
              <div
                key={busId}
                className="bg-white rounded-2xl border border-gray-200 hover:border-brand-accent/60 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-brand-accent/15 text-brand-dark border border-brand-accent/30">
                      {busNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {isActive ? 'In Service' : 'Maintenance'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900 mt-1">{name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{type}</p>

                  <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Berths</span>
                      <span className="font-bold text-gray-900">{total} Seats</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Seating Deck</span>
                      <span className="font-bold text-gray-900">2×1 Luxury Deck</span>
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  {amenities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {amenities.slice(0, 3).map((a, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 truncate"
                        >
                          {a}
                        </span>
                      ))}
                      {amenities.length > 3 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                          +{amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <Link
                    to={`/operator/schedule-trip?busId=${busId}`}
                    className="w-full py-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark text-xs font-extrabold rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule on New Route</span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(bus)}
                      className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                      <span>Edit Bus</span>
                    </button>
                    <button
                      onClick={() => handleOpenDelete(bus)}
                      className="p-1.5 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete Bus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Bus Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Coach Specifications' : 'Add New Bus to Operator Fleet'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveBus} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Bus Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MH-14-GH-9988"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Coach / Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Scania Metrolink HD"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Bus Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900 font-medium"
              >
                {BUS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Total Seat Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="10"
                max="65"
                required
                value={formData.totalSeats}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    totalSeats: val,
                    rows: Math.ceil(val / 4),
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900"
              />
            </div>
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Onboard Amenities
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
              {COMMON_AMENITIES.map((amenity) => {
                const checked = formData.amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      checked ? 'bg-brand-accent/20 text-brand-dark font-bold' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded text-brand-accent focus:ring-brand-accent w-4 h-4"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded text-brand-accent focus:ring-brand-accent w-4 h-4"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-gray-700 cursor-pointer">
              Bus is active and ready for scheduled customer routes
            </label>
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
              {saving ? 'Saving...' : isEditing ? 'Update Bus' : 'Add to Fleet'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Bus from Fleet"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to remove bus{' '}
            <strong className="text-gray-900 font-mono font-bold">
              {busToDelete?.busNumber || busToDelete?.bus_number}
            </strong>{' '}
            ({busToDelete?.name || 'Coach'}) from your fleet?
          </p>
          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Keep Bus
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="px-5 py-2 rounded-xl bg-red-600 text-white font-extrabold text-sm shadow-md hover:bg-red-700 active:scale-95 disabled:opacity-50 transition-all"
            >
              {deleting ? 'Removing...' : 'Delete Bus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

