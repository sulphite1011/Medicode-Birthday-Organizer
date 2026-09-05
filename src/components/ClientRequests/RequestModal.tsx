import React, { useState, useEffect } from 'react';
import { ClientRequest, OrderStatus, PaymentStatus, Project } from '../../types';
import {
  X,
  Inbox,
  Save,
  DollarSign,
  Calendar,
  User,
  Sparkles,
  Link2
} from 'lucide-react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (req: ClientRequest) => void;
  requestToEdit?: ClientRequest | null;
  projects: Project[];
}

export const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  requestToEdit,
  projects,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [websiteType, setWebsiteType] = useState('Romantic Love Story');
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('$150');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('deposit_paid');
  const [status, setStatus] = useState<OrderStatus>('new');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [connectedProjectId, setConnectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (requestToEdit) {
      setClientName(requestToEdit.clientName);
      setClientContact(requestToEdit.clientContact || '');
      setRecipientName(requestToEdit.recipientName);
      setWebsiteType(requestToEdit.websiteType);
      setRequirements(requestToEdit.requirements || '');
      setBudget(requestToEdit.budget || '');
      setPaymentStatus(requestToEdit.paymentStatus);
      setStatus(requestToEdit.status);
      setOrderDate(requestToEdit.orderDate || new Date().toISOString().split('T')[0]);
      setDueDate(requestToEdit.dueDate || '');
      setNotes(requestToEdit.notes || '');
      setConnectedProjectId(requestToEdit.connectedProjectId || null);
    } else {
      setClientName('');
      setClientContact('');
      setRecipientName('');
      setWebsiteType('Romantic Love Story');
      setRequirements('');
      setBudget('$150');
      setPaymentStatus('unpaid');
      setStatus('new');
      setOrderDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setNotes('');
      setConnectedProjectId(null);
    }
  }, [requestToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !recipientName.trim()) return;

    const finalReq: ClientRequest = {
      id: requestToEdit ? requestToEdit.id : `req-${Date.now()}`,
      clientName: clientName.trim(),
      clientContact: clientContact.trim(),
      recipientName: recipientName.trim(),
      websiteType: websiteType.trim(),
      requirements: requirements.trim(),
      budget: budget.trim(),
      paymentStatus,
      status,
      orderDate,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
      connectedProjectId: connectedProjectId || null,
      createdAt: requestToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(finalReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 font-['Outfit']">
                {requestToEdit ? 'Edit Client Order' : 'New Website Order / Request'}
              </h2>
              <p className="text-xs text-zinc-400">
                Track client inquiries, deadlines, pricing, and project conversion.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Client & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Hamza Malik"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Recipient / Celebrant *
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ayesha"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Contact & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Client Contact / Social Handle
              </label>
              <input
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="e.g. @hamza_m (IG) / +1 555-0192"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Requested Website Style / Type
              </label>
              <input
                type="text"
                value={websiteType}
                onChange={(e) => setWebsiteType(e.target.value)}
                placeholder="e.g. Romantic Love Story, Milestone 30th"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Status & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="new">🟡 New Request</option>
                <option value="in_progress">🟠 In Production</option>
                <option value="ready_for_preview">🔵 Ready for Preview</option>
                <option value="delivered">🟢 Delivered</option>
                <option value="cancelled">⚪ Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Price / Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $150"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="unpaid">Unpaid</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="fully_paid">Fully Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Dates: Order Date & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Order Received Date
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Target Delivery / Birthday Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Client Requirements & Details
            </label>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. Needs 4 photos, custom letter with wax seal, lofi background music, romantic theme..."
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Connect to existing project */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-zinc-300 mb-1">
              <Link2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Link to Existing Website Project (Optional)</span>
            </label>
            <select
              value={connectedProjectId || ''}
              onChange={(e) => setConnectedProjectId(e.target.value || null)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="">-- None (Or convert to project later) --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.recipientName}) - {p.status}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{requestToEdit ? 'Save Order' : 'Create Order'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
