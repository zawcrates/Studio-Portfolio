'use strict';

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const ALLOWED_BUCKETS = ['hero-images', 'portfolio-images', 'service-images', 'studio-assets'];

export async function POST(request: NextRequest) {
  console.log("UPLOAD ROUTE HIT");
  try {
    // 1. Verify Authentication & Admin Role
    console.info('[Upload Trace] Step 1: Before authentication check');
    
    const serverSupabase = await createServerClient();
    const { data: { user } } = await serverSupabase.auth.getUser();

    console.info(`[Upload Trace] Step 2: After authentication check. Authenticated user: ${user?.email || 'None'}`);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aurastudio.in';
    if (!user || user.email !== adminEmail) {
      console.warn(`[Unauthorized Upload Attempt] User: ${user?.email || 'Anonymous'}`);
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = formData.get('bucket') as string || 'portfolio-images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json({ error: 'Invalid storage bucket.' }, { status: 400 });
    }

    // 3. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 5MB.' }, { status: 400 });
    }

    // 4. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WEBP images are allowed.' }, { status: 400 });
    }

    // 5. Validate File Extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json({ error: 'Invalid file extension.' }, { status: 400 });
    }

    // 6. Initialize Service Role Supabase client to upload
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[Configuration Error] Missing credentials for admin upload.');
      return NextResponse.json({ error: 'Storage credentials configuration missing.' }, { status: 500 });
    }

    console.log("SERVICE ROLE EXISTS:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // 7. Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;

    console.info(`[Upload Trace] Step 3: Before storage upload (bucket: ${bucket}, filename: ${uniqueFileName})`);

    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .upload(uniqueFileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error(`[Upload Trace] Step 4 (Failed): Supabase storage upload failed: ${error.message}`);
      return NextResponse.json({ error: 'Failed to upload image to storage.' }, { status: 500 });
    }

    console.info(`[Upload Trace] Step 4 (Success): Storage upload completed. Resolved path: ${data?.path}`);

    // 8. Generate Public URL
    const { data: { publicUrl } } = adminSupabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    console.info(`[Upload Success] File uploaded successfully to ${bucket}/${uniqueFileName} by Admin. Public URL: ${publicUrl}`);
    return NextResponse.json({ url: publicUrl }, { status: 201 });

  } catch (err) {
    console.error('[Server Error] API /api/upload failed:', err);
    return NextResponse.json({ error: 'Server failed to process file upload.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  console.log("DELETE ROUTE HIT");
  try {
    // 1. Verify Authentication & Admin Role
    const serverSupabase = await createServerClient();
    const { data: { user } } = await serverSupabase.auth.getUser();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aurastudio.in';
    if (!user || user.email !== adminEmail) {
      console.warn(`[Unauthorized Delete Attempt] User: ${user?.email || 'Anonymous'}`);
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // 2. Parse request query params
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get('bucket');
    const fileName = searchParams.get('filename');

    if (!bucket || !fileName) {
      return NextResponse.json({ error: 'Missing bucket or filename parameters.' }, { status: 400 });
    }

    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json({ error: 'Invalid storage bucket.' }, { status: 400 });
    }

    // 3. Initialize Service Role Supabase client to bypass policies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[Configuration Error] Missing credentials for admin deletion.');
      return NextResponse.json({ error: 'Storage credentials configuration missing.' }, { status: 500 });
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    console.info(`[Delete Trace] Deleting file from storage: ${bucket}/${fileName}`);

    const filename = fileName;
    const filePath = filename;

    // 4. Delete file from storage
    const { data: result, error } = await adminSupabase.storage
      .from(bucket)
      .remove([filename]);

    console.log("Deleting:", filePath);
    console.log("Delete Result:", result);
    console.log("Delete Error:", error);

    if (error) {
      console.error(`[Delete Error] Supabase storage deletion failed: ${error.message}`);
      return NextResponse.json({ error: 'Failed to delete file from storage.', details: error }, { status: 500 });
    }

    console.info(`[Delete Success] File deleted successfully from ${bucket}/${filename}`);
    return NextResponse.json({ success: true, deleted: result }, { status: 200 });

  } catch (err) {
    console.error('[Server Error] API DELETE /api/upload failed:', err);
    return NextResponse.json({ 
      error: 'Server failed to process file deletion.', 
      details: err instanceof Error ? err.stack || err.message : String(err) 
    }, { status: 500 });
  }
}

