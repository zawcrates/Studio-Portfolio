'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LayoutDashboard, Image as ImageIcon, MessageSquare, LogOut, Camera, User, Briefcase, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/admin/login');
          return;
        }

        // Query the admins table to check if user is authorized as an administrator
        const { data: adminData, error: adminErr } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (adminErr || !adminData) {
          console.warn('Unauthorized admin access attempt:', session.user.email);
          await supabase.auth.signOut();
          setUser(null);
          router.push('/admin/login');
          return;
        }

        setUser(session.user);
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes and verify admin status
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/admin/login');
      } else if (session) {
        try {
          const { data: adminData } = await supabase
            .from('admins')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!adminData) {
            console.warn('Auth state changed to non-admin user:', session.user.email);
            await supabase.auth.signOut();
            setUser(null);
            router.push('/admin/login');
          } else {
            setUser(session.user);
          }
        } catch (err) {
          console.error('Error verifying admin status on auth state change:', err);
          await supabase.auth.signOut();
          setUser(null);
          router.push('/admin/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Verifying Auth Session...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the admin dashboard layout
  if (!user) return null;

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hero Images', href: '/admin/dashboard/hero', icon: ImageIcon },
    { name: 'Portfolio Albums', href: '/admin/dashboard/portfolio', icon: Camera },
    { name: 'Services', href: '/admin/dashboard/services', icon: Briefcase },
    { name: 'Inquiries', href: '/admin/dashboard/inquiries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#0c0604] text-stone-200 flex flex-col md:flex-row relative overflow-hidden admin-layout-wrapper">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-glow-accent-strong rounded-full pointer-events-none blur-[120px] opacity-25" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-glow-sage rounded-full pointer-events-none blur-[100px] opacity-10" />

      {/* Mobile Sticky Header */}
      <header className="md:hidden h-16 bg-[#130a07] border-b border-[#9D6638]/15 flex items-center justify-between px-6 sticky top-0 z-40 w-full">
        <Link href="/" className="flex items-center gap-2.5 font-serif tracking-widest text-white hover:opacity-95">
          <Camera className="w-4 h-4 text-accent" />
          <span className="font-semibold uppercase tracking-wider text-sm">AURA</span>
          <span className="font-light text-[#9D6638] text-[10px]">ADMIN</span>
        </Link>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 -mr-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </header>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex w-64 border-r border-[#9D6638]/15 bg-[#130a07] shrink-0 flex-col justify-between p-6 relative z-10">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-serif tracking-widest text-white hover:opacity-95">
            <Camera className="w-5 h-5 text-[#9D6638]" />
            <span className="font-semibold uppercase tracking-wider">AURA</span>
            <span className="font-light text-[#9D6638] text-xs">ADMIN</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-col gap-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#9D6638] to-[#4E220F] text-white shadow-md shadow-[#4E220F]/20 font-semibold'
                      : 'text-stone-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="flex flex-col gap-4 border-t border-[#9D6638]/15 pt-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-accent/15 text-[#9D6638] flex items-center justify-center shrink-0 border border-[#9D6638]/20">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white font-medium truncate">{user.email}</p>
              <p className="text-[9px] text-[#9D6638] font-mono uppercase tracking-wider mt-0.5 font-semibold">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Slide-out Overlay) */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
        isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        {/* Drawer Panel */}
        <aside className={`absolute top-0 left-0 bottom-0 w-64 bg-[#130a07] border-r border-[#9D6638]/15 p-6 flex flex-col justify-between transition-transform duration-300 ease-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 font-serif tracking-widest text-white hover:opacity-95">
                <Camera className="w-5 h-5 text-[#9D6638]" />
                <span className="font-semibold uppercase tracking-wider">AURA</span>
                <span className="font-light text-[#9D6638] text-xs">ADMIN</span>
              </Link>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#9D6638] to-[#4E220F] text-white shadow-md shadow-[#4E220F]/20 font-semibold'
                        : 'text-stone-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Info & Logout */}
          <div className="flex flex-col gap-4 border-t border-[#9D6638]/15 pt-6">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-accent/15 text-[#9D6638] flex items-center justify-center shrink-0 border border-[#9D6638]/20">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white font-medium truncate">{user.email}</p>
                <p className="text-[9px] text-[#9D6638] font-mono uppercase tracking-wider mt-0.5 font-semibold">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsMobileSidebarOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Pane */}
      <main className="flex-grow p-4 sm:p-6 md:p-12 overflow-y-auto max-h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}
