import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// DEMO ONLY: This endpoint is strictly used to expose the demo mode status to the frontend client components.
// Do not use this to expose sensitive server configurations in production.
export async function GET() {
  const isDemo = process.env.DEMO_ADMIN_MODE === 'true';

  if (isDemo) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      try {
        const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false }
        });

        // 1. Check if the demo admin is already registered in public.admins
        const { data: existingAdmin, error: adminQueryErr } = await adminSupabase
          .from('admins')
          .select('id')
          .eq('email', 'demo@admin.local')
          .maybeSingle();

        if (adminQueryErr) {
          console.error('[Demo Mode Setup] Error querying admins table:', adminQueryErr);
        }

        if (!existingAdmin) {
          console.info('[Demo Mode Setup] Demo admin not found in admins table. Preparing to create/link...');

          // 2. Check if the user exists in auth.users
          const { data: { users }, error: listErr } = await adminSupabase.auth.admin.listUsers();
          
          if (listErr) {
            console.error('[Demo Mode Setup] Error listing users:', listErr);
          }

          let demoUser = users?.find(u => u.email === 'demo@admin.local');

          // 3. Create the auth user if they do not exist
          if (!demoUser) {
            console.info('[Demo Mode Setup] Creating demo admin in Supabase Auth...');
            const { data: { user: newUser }, error: createErr } = await adminSupabase.auth.admin.createUser({
              email: 'demo@admin.local',
              password: 'demo-admin-password-123',
              email_confirm: true,
              user_metadata: { name: 'Demo Admin', role: 'admin' }
            });

            if (createErr) {
              console.error('[Demo Mode Setup] Error creating auth user:', createErr);
            } else {
              demoUser = newUser || undefined;
            }
          }

          // 4. Register/link the auth user in public.admins
          if (demoUser) {
            console.info('[Demo Mode Setup] Registering demo admin in public.admins table...');
            const { error: linkErr } = await adminSupabase
              .from('admins')
              .upsert({ id: demoUser.id, email: 'demo@admin.local' });

            if (linkErr) {
              console.error('[Demo Mode Setup] Error registering demo admin in admins table:', linkErr);
            } else {
              console.info('[Demo Mode Setup] Demo admin successfully registered!');
            }
          }
        }
      } catch (err) {
        console.error('[Demo Mode Setup] Unexpected error:', err);
      }
    } else {
      console.warn('[Demo Mode Setup] Supabase credentials not found in environment.');
    }
  }

  return NextResponse.json({ enabled: isDemo });
}
