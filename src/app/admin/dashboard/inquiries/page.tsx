'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageSquare, Phone, Mail, Clock, Calendar, CheckCircle2, ChevronRight, User, Trash2 } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  created_at: string;
}

export default function AdminInquiriesPage() {
  const supabase = createClient();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err: any) {
      console.error('Error fetching inquiries:', err);
      setErrorMsg(err.message || 'Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchInquiries();
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Failed to update inquiry status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;

    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchInquiries();
    } catch (err: any) {
      console.error('Error deleting inquiry:', err);
      alert('Failed to delete inquiry: ' + err.message);
    }
  };

  const filteredInquiries = statusFilter === 'all'
    ? inquiries
    : inquiries.filter(inq => inq.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-light">Client Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1.5 font-light">
            Review session bookings, change inquiry statuses, and contact leads.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#0e0e11] p-1.5 rounded-xl border border-white/5 shrink-0 self-stretch sm:self-auto justify-center">
          {['all', 'New', 'Contacted', 'Closed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === tab
                  ? 'bg-gold text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-200 rounded-xl text-xs">
          {errorMsg}
        </div>
      )}

      {/* Inquiry List */}
      <div className="flex flex-col gap-6">
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map((inq) => {
            // Clean phone number for WhatsApp URL
            const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
            const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
            const waFollowUpMsg = `Hi ${inq.name}! This is Ananya from Aura Studio. I received your inquiry for the ${inq.event_type} on ${new Date(inq.event_date).toLocaleDateString()}. Let's coordinate details!`;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waFollowUpMsg)}`;

            return (
              <div
                key={inq.id}
                className="glass p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col gap-5 relative"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-white font-light">{inq.name}</h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                        Received: {new Date(inq.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                    {/* Status Select dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase text-gray-500 font-semibold font-mono">Status:</span>
                      <select
                        value={inq.status}
                        disabled={updatingId === inq.id}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer focus:outline-none ${
                          inq.status === 'New'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : inq.status === 'Contacted'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}
                      >
                        <option value="New" className="bg-card text-white">New</option>
                        <option value="Contacted" className="bg-card text-white">Contacted</option>
                        <option value="Closed" className="bg-card text-white">Closed</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="p-2.5 rounded-lg border border-white/5 hover:border-red-500 hover:text-red-400 text-gray-500 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm font-light">
                  {/* Event type & date */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold font-mono">Event details</span>
                    <p className="text-white font-medium">{inq.event_type}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-4 h-4 text-gold" /> {new Date(inq.event_date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold font-mono">Contact Details</span>
                    <a href={`tel:${inq.phone}`} className="text-white hover:text-gold flex items-center gap-1.5 font-medium transition-colors">
                      <Phone className="w-4 h-4 text-gold" /> {inq.phone}
                    </a>
                    <a href={`mailto:${inq.email}`} className="text-xs text-gray-400 hover:text-gold flex items-center gap-1.5 mt-1 transition-colors">
                      <Mail className="w-4 h-4 text-gold" /> {inq.email}
                    </a>
                  </div>

                  {/* Follow Up */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold font-mono">Follow Up Action</span>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors self-start"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Follow Up WhatsApp
                    </a>
                  </div>
                </div>

                {/* Client Message */}
                <div className="bg-[#0e0e11] p-5 rounded-xl border border-white/5 flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold font-mono">Client Message:</span>
                  <p className="text-xs text-gray-300 leading-relaxed font-light mt-1 whitespace-pre-wrap">
                    "{inq.message}"
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-gray-500 font-serif font-light glass rounded-2xl border border-white/5">
            No inquiries match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
