'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Camera, Lock, Mail, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Query the admins table to check if user is authorized as an administrator
          const { data: adminData, error: adminErr } = await supabase
            .from('admins')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (adminData && !adminErr) {
            router.push('/admin/dashboard');
          } else {
            // Non-admin session exists: sign out to prevent infinite redirect loops
            console.warn('Non-admin session detected at login page, signing out.');
            await supabase.auth.signOut();
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Check auth error:', err);
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, supabase]);

  const onSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.session) {
        // Double-check if the authenticated user is registered as an admin in public.admins
        const { data: adminData, error: adminErr } = await supabase
          .from('admins')
          .select('id')
          .eq('id', authData.session.user.id)
          .maybeSingle();

        if (adminErr || !adminData) {
          // Log out immediately as they are not authorized
          await supabase.auth.signOut();
          throw new Error('Access denied. You do not have administrator privileges.');
        }
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMsg(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md glass p-8 sm:p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10 flex flex-col gap-8">
        {/* Branding header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-serif tracking-widest text-white"
          >
            <Camera className="w-6 h-6 text-gold" />
            <span className="font-semibold uppercase">AURA</span>
            <span className="font-light text-gold">STUDIO</span>
          </Link>
          <h1 className="font-serif text-2xl text-white font-light tracking-wide mt-2">
            Administrator Access
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Sign in to manage portfolio content and inquiries
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {errorMsg && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-200 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gold" /> Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@aurastudio.in"
              {...register('email')}
              className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-gray-700"
            />
            {errors.email && (
              <span className="text-xs text-red-400 font-light mt-0.5">{errors.email.message}</span>
            )}
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold" /> Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-gray-700"
            />
            {errors.password && (
              <span className="text-xs text-red-400 font-light mt-0.5">{errors.password.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 rounded-xl bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <Link
        href="/"
        className="mt-8 text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-medium"
      >
        Back to Website
      </Link>
    </div>
  );
}
