import React, { useState, useMemo } from 'react';
import { ClientRequest, OrderStatus, Project } from '../../types';
import {
  Inbox,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  DollarSign,
  User,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  CodeXml,
  AlertCircle
} from 'lucide-react';

interface RequestBoardProps {
  requests: ClientRequest[];
  projects: Project[];
  onNewRequest: () => void;
  onEditRequest: (req: ClientRequest) => void;
  onDeleteRequest: (requestId: string) => void;
  onConvertToProject: (req: ClientRequest) => void;
  onUpdateStatus: (requestId: string, newStatus: OrderStatus) => void;
}

export const RequestBoard: React.FC<RequestBoardProps> = ({
  requests,
  projects,
  onNewRequest,
  onEditRequest,
  onDeleteRequest,
  onConvertToProject,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (filterPayment !== 'all' && r.paymentStatus !== filterPayment) return false;
      return true;
    });
  }, [requests, filterPayment]);

  const columns: { id: OrderStatus; title: string; color: string; badge: string }[] = [
    { id: 'new', title: 'New Requests', color: 'border-amber-500/40 text-amber-300', badge: 'bg-amber-500/20 text-amber-300' },
    { id: 'in_progress', title: 'In Production', color: 'border-orange-500/40 text-orange-300', badge: 'bg-orange-500/20 text-orange-300' },
    { id: 'ready_for_preview', title: 'Preview Ready', color: 'border-sky-500/40 text-sky-300', badge: 'bg-sky-500/20 text-sky-300' },
    { id: 'delivered', title: 'Delivered', color: 'border-emerald-500/40 text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300' },
  ];

  const getPaymentBadge = (status: ClientRequest['paymentStatus']) => {
    switch (status) {
      case 'fully_paid':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Paid</span>;
      case 'deposit_paid':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">Deposit</span>;
      case 'unpaid':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Unpaid</span>;
      case 'refunded':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">Refunded</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800/80">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 font-['Outfit'] flex items-center gap-2">
            <Inbox className="w-5 h-5 text-amber-400" />
            <span>Client Orders & Inquiries Pipeline</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Convert incoming orders into full birthday websites with 1 click.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                viewMode === 'pipeline' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Table View
            </button>
          </div>

          {/* New Request Button */}
          <button
            onClick={onNewRequest}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Pipeline Kanban View */}
      {viewMode === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colRequests = filteredRequests.filter((r) => r.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-3.5 flex flex-col min-h-[300px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-['Outfit']">
                      {col.title}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${col.badge}`}>
                      {colRequests.length}
                    </span>
                  </div>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 flex-1">
                  {colRequests.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-600 italic">
                      No orders in this stage
                    </div>
                  ) : (
                    colRequests.map((req) => {
                      const linkedProject = projects.find((p) => p.id === req.connectedProjectId);

                      return (
                        <div
                          key={req.id}
                          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/90 hover:border-zinc-700 transition-all shadow-sm space-y-3"
                        >
                          {/* Top: Recipient & Price */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-bold text-zinc-100 font-['Outfit']">
                                For: {req.recipientName}
                              </div>
                              <div className="text-xs text-zinc-400 font-medium">
                                By: {req.clientName}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-amber-400 font-mono">
                                {req.budget}
                              </span>
                              <div className="mt-1">{getPaymentBadge(req.paymentStatus)}</div>
                            </div>
                          </div>

                          {/* Contact & Style */}
                          <div className="text-xs text-zinc-400 space-y-1 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/60">
                            {req.clientContact && (
                              <div className="truncate text-zinc-300">
                                💬 {req.clientContact}
                              </div>
                            )}
                            <div className="text-zinc-400 truncate">
                              🎨 {req.websiteType}
                            </div>
                            {req.dueDate && (
                              <div className="text-amber-400/90 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Due: {new Date(req.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            )}
                          </div>

                          {/* Requirements Excerpt */}
                          {req.requirements && (
                            <p className="text-[11px] text-zinc-400/90 line-clamp-2 italic">
                              &ldquo;{req.requirements}&rdquo;
                            </p>
                          )}

                          {/* Linked Project Badge or Convert Button (Requirement #9) */}
                          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                            {linkedProject ? (
                              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 truncate">
                                <CheckCircle2 className="w-3 h-3 shrink-0" />
                                <span className="truncate">Linked: {linkedProject.name}</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => onConvertToProject(req)}
                                className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
                                title="Instantly convert this order into a full website project"
                              >
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>Convert to Project</span>
                              </button>
                            )}

                            {/* Card Actions: Edit, Move Status, Delete */}
                            <div className="flex items-center gap-1 ml-auto">
                              <select
                                value={req.status}
                                onChange={(e) => onUpdateStatus(req.id, e.target.value as OrderStatus)}
                                className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 focus:outline-none cursor-pointer"
                                title="Move status"
                              >
                                <option value="new">New</option>
                                <option value="in_progress">Building</option>
                                <option value="ready_for_preview">Preview</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>

                              <button
                                onClick={() => onEditRequest(req)}
                                className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                title="Edit order"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteRequest(req.id)}
                                className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800"
                                title="Delete order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold font-['Outfit']">
              <tr>
                <th className="p-3.5">Recipient</th>
                <th className="p-3.5">Client & Contact</th>
                <th className="p-3.5">Style Type</th>
                <th className="p-3.5">Price & Status</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Project Linked</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredRequests.map((req) => {
                const linkedProject = projects.find((p) => p.id === req.connectedProjectId);

                return (
                  <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-zinc-100 font-['Outfit']">
                      {req.recipientName}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-zinc-200">{req.clientName}</div>
                      <div className="text-zinc-500 text-[11px]">{req.clientContact}</div>
                    </td>
                    <td className="p-3.5 text-zinc-300">{req.websiteType}</td>
                    <td className="p-3.5">
                      <div className="font-bold font-mono text-amber-400">{req.budget}</div>
                      <div className="mt-0.5">{getPaymentBadge(req.paymentStatus)}</div>
                    </td>
                    <td className="p-3.5 text-zinc-400">
                      {req.dueDate ? new Date(req.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3.5">
                      {linkedProject ? (
                        <span className="text-emerald-400 font-medium">{linkedProject.name}</span>
                      ) : (
                        <button
                          onClick={() => onConvertToProject(req)}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
                        >
                          + Convert
                        </button>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => onEditRequest(req)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteRequest(req.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
  );
};
