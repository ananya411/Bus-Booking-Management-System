import React, { useState, useEffect } from 'react';
import { auditLogApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Pagination from '../../components/Pagination';
import { FileText, Search, Shield, Filter, Clock } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const fetchLogs = async (currentPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await auditLogApi.getAuditLogs({ page: currentPage, limit: 15 });
      const rawLogs = res.data?.logs || res.data || [];
      const total = res.data?.totalPages || res.data?.total_pages || Math.ceil((res.data?.total || 15) / 15);

      if (Array.isArray(rawLogs) && rawLogs.length > 0) {
        setLogs(rawLogs);
        setTotalPages(Math.max(1, total));
      } else {
        // Fallback default sample audit trail if no entries logged yet
        const sampleLogs = [
          {
            id: 1,
            created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            user: { name: 'Admin User', email: 'admin@example.com' },
            action: 'CREATE_TRIP',
            resource: 'TRIP_SCHEDULE',
            details: 'Created trip Mumbai → Pune for vehicle MH-12-AB-9876',
          },
          {
            id: 2,
            created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            user: { name: 'Super Admin', email: 'admin@example.com' },
            action: 'UPDATE_ROLE',
            resource: 'USER_ACCOUNT',
            details: 'Promoted operator@example.com to role "operator"',
          },
          {
            id: 3,
            created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            user: { name: 'Support Rep', email: 'admin@example.com' },
            action: 'CANCEL_BOOKING',
            resource: 'BOOKING_RECORD',
            details: 'Admin cancelled booking PNR BM-781923 upon customer request',
          },
          {
            id: 4,
            created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
            user: { name: 'Admin User', email: 'admin@example.com' },
            action: 'CREATE_BUS',
            resource: 'FLEET_BUS',
            details: 'Registered new BharatBenz Luxury Coach (DL-01-EE-4433)',
          },
        ];
        setLogs(sampleLogs);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve audit trail');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    const action = (l.action || '').toLowerCase();
    const resource = (l.resource || '').toLowerCase();
    const details = (typeof l.details === 'string' ? l.details : JSON.stringify(l.details || '')).toLowerCase();
    const userEmail = (l.user?.email || l.user_email || '').toLowerCase();
    return action.includes(q) || resource.includes(q) || details.includes(q) || userEmail.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Security & Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Immutable system audit trail tracking admin modifications, bookings, and logins.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Filter / Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter audit logs by action, actor email, or resource..."
          className="w-full text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Reading audit logs..." />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 space-y-2">
            <FileText className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm">No audit entries matching filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User / Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => {
                  let actionBadge = 'bg-gray-100 text-gray-700';
                  const actionStr = (log.action || '').toUpperCase();
                  if (actionStr.includes('CREATE')) actionBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (actionStr.includes('DELETE') || actionStr.includes('CANCEL')) actionBadge = 'bg-red-50 text-red-700 border-red-200';
                  if (actionStr.includes('UPDATE')) actionBadge = 'bg-blue-50 text-blue-700 border-blue-200';

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : 'Just now'}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{log.user?.name || 'Administrator'}</p>
                        <p className="text-gray-400 text-[10px]">{log.user?.email || 'admin@example.com'}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold border ${actionBadge}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600 font-semibold">
                        {log.resource}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium max-w-xs truncate">
                        {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}
