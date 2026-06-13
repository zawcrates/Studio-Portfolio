'use strict';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  event_type: z.string().min(1, 'Please select an event type').max(100),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

// In-memory rate limiting configuration
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 5; // Max 5 submissions
const WINDOW = 60 * 1000; // per 1 minute window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  
  // Prune Map periodically to prevent memory leak
  if (rateLimitMap.size > 1000) {
    const expiredTime = now - WINDOW;
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.lastReset < expiredTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  const clientData = rateLimitMap.get(ip);

  if (!clientData) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - clientData.lastReset > WINDOW) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (clientData.count >= LIMIT) {
    return true;
  }

  clientData.count += 1;
  return false;
}

// Simple HTML tag stripping sanitization
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  // 1. Rate Limiting Check
  if (isRateLimited(ip)) {
    console.warn(`[Suspicious Activity] Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      { error: 'Too many requests. Please try again after a minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // 2. Validate using Zod
    const validatedData = contactSchema.parse(body);

    // 3. Sanitize inputs to prevent XSS script executions
    const sanitizedData = {
      name: sanitize(validatedData.name),
      phone: sanitize(validatedData.phone),
      email: sanitize(validatedData.email),
      event_type: sanitize(validatedData.event_type),
      event_date: sanitize(validatedData.event_date),
      message: sanitize(validatedData.message),
    };

    // 4. Initialize service role Supabase client to bypass locked-down RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[Configuration Error] SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to public client.');
      return NextResponse.json(
        { error: 'Database service unavailable. Please contact the administrator.' },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // 5. Insert Inquiry
    const { error } = await adminSupabase.from('inquiries').insert([
      {
        name: sanitizedData.name,
        phone: sanitizedData.phone,
        email: sanitizedData.email,
        event_type: sanitizedData.event_type,
        event_date: sanitizedData.event_date,
        message: sanitizedData.message,
        status: 'New',
      },
    ]);

    if (error) {
      console.error(`[Inquiry Insert Failure] Error: ${error.message}`);
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error('[Server Error] API /api/inquiries failed:', err);
    return NextResponse.json({ error: 'Server failed to process inquiry.' }, { status: 500 });
  }
}
