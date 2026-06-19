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
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-walnut font-bold">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -translate-x-1/2 blur-[100px] opacity-70" />
      <div className="absolute top-2/3 right-1/4 w-[600px] h-[600px] bg-glow-sage rounded-full pointer-events-none translate-x-1/3 blur-[120px] opacity-70" />

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-light p-8 sm:p-10 rounded-3xl border border-border/15 shadow-2xl relative z-10 flex flex-col gap-8">
        {/* Branding header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-serif tracking-widest text-walnut font-light transition-opacity hover:opacity-95"
          >
            <Camera className="w-5 h-5 text-accent" />
            <span className="font-semibold uppercase tracking-wider">AURA</span>
            <span className="font-light text-accent/80">STUDIO</span>
          </Link>
          <h1 className="font-serif text-3xl text-walnut font-light tracking-wide mt-2">
            Administrator Access
          </h1>
          <p className="text-xs text-foreground/75 font-light">
            Sign in to manage portfolio content and inquiries
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest text-walnut font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-accent" /> Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@aurastudio.in"
              {...register('email')}
              className="px-4 py-3 bg-cardbg/55 border border-border/15 rounded-xl text-foreground text-sm focus:border-accent focus:bg-white/60 focus:outline-none transition-all placeholder:text-foreground/45"
            />
            {errors.email && (
              <span className="text-xs text-red-600 font-semibold mt-0.5">{errors.email.message}</span>
            )}
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs uppercase tracking-widest text-walnut font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-accent" /> Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="px-4 py-3 bg-cardbg/55 border border-border/15 rounded-xl text-foreground text-sm focus:border-accent focus:bg-white/60 focus:outline-none transition-all placeholder:text-foreground/45"
            />
            {errors.password && (
              <span className="text-xs text-red-600 font-semibold mt-0.5">{errors.password.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md shadow-accent/10 hover:shadow-lg hover:shadow-accent/15 transition-all duration-300 disabled:opacity-50 cursor-pointer"
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
        className="mt-8 text-xs text-foreground/60 hover:text-accent uppercase tracking-widest transition-colors font-bold"
      >
        Back to Website
      </Link>
    </div>
  );
}
