'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Camera, Image as ImageIcon, MessageSquare, Plus, Clock, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  albumsCount: number;
  photosCount: number;
  inquiriesCount: number;
  pendingInquiries: number;
}

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats>({
    albumsCount: 0,
    photosCount: 0,
    inquiriesCount: 0,
    pendingInquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch albums count
        const { count: albumsCount, error: albumsErr } = await supabase
          .from('albums')
          .select('*', { count: 'exact', head: true });

        // Fetch photos count
        const { count: photosCount, error: photosErr } = await supabase
          .from('photos')
          .select('*', { count: 'exact', head: true });

        // Fetch inquiries count
        const { count: inquiriesCount, error: inquiriesErr } = await supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true });

        // Fetch pending inquiries count
        const { count: pendingInquiries, error: pendingErr } = await supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'New');

        // Fetch recent inquiries
        const { data: recent, error: recentErr } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        setStats({
          albumsCount: albumsCount || 0,
          photosCount: photosCount || 0,
          inquiriesCount: inquiriesCount || 0,
          pendingInquiries: pendingInquiries || 0,
        });

        if (recent) setRecentInquiries(recent);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Albums', value: stats.albumsCount, icon: Camera, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Total Photos', value: stats.photosCount, icon: ImageIcon, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Total Inquiries', value: stats.inquiriesCount, icon: FileSpreadsheet, color: 'text-green-400', bg: 'bg-green-500/10' },
    { title: 'New Inquiries', value: stats.pendingInquiries, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-light">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1.5 font-light">
          Welcome to the administration panel. Here is a summary of your studio content.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass p-6 rounded-2xl border border-border/5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">{card.title}</span>
                <span className="text-3xl font-serif text-foreground font-light mt-1">{card.value}</span>
              </div>
              <div className={`p-3.5 rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-8 glass p-6 sm:p-8 rounded-2xl border border-border/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground font-light flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" /> Recent Client Inquiries
            </h2>
            <Link
              href="/admin/dashboard/inquiries"
              className="text-xs uppercase tracking-wider text-accent hover:text-foreground transition-colors underline underline-offset-4 font-semibold"
            >
              Manage Inquiries
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-4 rounded-xl bg-background/[0.01] hover:bg-background/[0.02] border border-border/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground font-serif">{inquiry.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/5 text-gray-400">
                        {inquiry.event_type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-light truncate max-w-full sm:max-w-md">
                      "{inquiry.message}"
                    </span>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 gap-2 sm:gap-1.5 w-full sm:w-auto border-t border-border/5 pt-3 sm:border-0 sm:pt-0">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                      inquiry.status === 'New'
                        ? 'bg-amber-500/10 text-amber-400'
                        : inquiry.status === 'Contacted'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-green-500/10 text-green-400'
                    }`}>
                      {inquiry.status}
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-6 text-center font-light">
                No inquiries received yet. Submit the public contact form to see them here.
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="lg:col-span-4 glass p-6 sm:p-8 rounded-2xl border border-border/5 flex flex-col gap-6">
          <h2 className="font-serif text-xl text-foreground font-light">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/dashboard/portfolio"
              className="w-full p-4 rounded-xl border border-border/10 bg-background/[0.02] hover:border-accent hover:text-accent transition-all duration-300 text-sm flex items-center justify-between font-medium group"
            >
              <span>Manage Albums</span>
              <Plus className="w-4 h-4 text-gray-500 group-hover:text-accent transition-colors" />
            </Link>
            <Link
              href="/admin/dashboard/hero"
              className="w-full p-4 rounded-xl border border-border/10 bg-background/[0.02] hover:border-accent hover:text-accent transition-all duration-300 text-sm flex items-center justify-between font-medium group"
            >
              <span>Manage Hero Images</span>
              <Plus className="w-4 h-4 text-gray-500 group-hover:text-accent transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
