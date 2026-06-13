'use strict';

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Plus, ArrowUp, ArrowDown, ExternalLink, Upload } from 'lucide-react';
import Image from 'next/image';

interface HeroImage {
  id: string;
  image_url: string;
  display_order: number;
}

export default function AdminHeroPage() {
  const supabase = createClient();
  const [heroes, setHeroes] = useState<HeroImage[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHeroes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setHeroes(data || []);
    } catch (err: any) {
      console.error('Error fetching hero images:', err);
      setErrorMsg(err.message || 'Failed to fetch hero images.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const handleAddHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setActionLoading(true);
    setErrorMsg(null);

    try {
      const nextOrder = heroes.length > 0 ? Math.max(...heroes.map(h => h.display_order)) + 1 : 1;

      const { error } = await supabase
        .from('hero_images')
        .insert([
          {
            image_url: newUrl.trim(),
            display_order: nextOrder,
          },
        ]);

      if (error) throw error;

      setNewUrl('');
      await fetchHeroes();
    } catch (err: any) {
      console.error('Error adding hero image:', err);
      setErrorMsg(err.message || 'Failed to add hero image.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHero = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    setActionLoading(true);
    setErrorMsg(null);

    try {
      // 1. Extract filename from URL
      let fileName = '';
      if (imageUrl.includes('/storage/v1/object/public/hero-images/')) {
        fileName = imageUrl.split('/').pop() || '';
      }

      if (!fileName) {
        throw new Error('Could not extract filename from image URL.');
      }

      // 2. Delete file from storage using the server-side API (bypasses storage policies on client)
      console.info(`[Delete Flow] Step 1: Deleting storage file: ${fileName}`);
      const res = await fetch(`/api/upload?bucket=hero-images&filename=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete file from storage.');
      }

      console.info('[Delete Flow] Step 2: Storage file deleted successfully. Deleting database entry.');

      // 3. Delete database entry
      const { error: dbError } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (dbError) {
        throw new Error(`Storage file deleted, but failed to delete database entry: ${dbError.message}`);
      }

      console.info('[Delete Flow] Step 3: Database entry deleted successfully.');

      // 4. Refresh UI
      await fetchHeroes();
    } catch (err: any) {
      console.error('Error deleting hero image:', err);
      setErrorMsg(err.message || 'Failed to delete hero image.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === heroes.length - 1) return;

    setActionLoading(true);
    setErrorMsg(null);

    try {
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      const heroA = heroes[index];
      const heroB = heroes[targetIdx];

      const orderA = heroA.display_order;
      const orderB = heroB.display_order;

      const { error: errorA } = await supabase
        .from('hero_images')
        .update({ display_order: orderB })
        .eq('id', heroA.id);

      if (errorA) throw errorA;

      const { error: errorB } = await supabase
        .from('hero_images')
        .update({ display_order: orderA })
        .eq('id', heroB.id);

      if (errorB) throw errorB;

      await fetchHeroes();
    } catch (err: any) {
      console.error('Error reordering hero images:', err);
      setErrorMsg(err.message || 'Failed to reorder hero images.');
      setActionLoading(false);
    }
  };

  // Secure File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActionLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'hero-images');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      // Insert the uploaded image directly as a new hero image
      const nextOrder = heroes.length > 0 ? Math.max(...heroes.map(h => h.display_order)) + 1 : 1;
      
      console.info(`[Upload Trace] Step 5: Before database insert (image_url: ${data.url}, display_order: ${nextOrder})`);

      const { error } = await supabase
        .from('hero_images')
        .insert([
          {
            image_url: data.url,
            display_order: nextOrder,
          },
        ]);

      if (error) throw error;

      console.info('[Upload Trace] Step 6: After database insert (Success)');
      await fetchHeroes();
    } catch (err: any) {
      console.error('[Upload Trace] Step 5/6 (Failed): DB insert failed:', err);
      setErrorMsg(err.message || 'Failed to upload hero image.');
    } finally {
      setActionLoading(false);
      e.target.value = '';
    }
  };

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
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-light">Hero Slider Management</h1>
          <p className="text-sm text-gray-500 mt-1.5 font-light">
            Upload and arrange the high-resolution images displayed on the homepage slider.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-200 rounded-xl text-xs">
          {errorMsg}
        </div>
      )}

      {/* Add New Hero Image Form */}
      <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 items-end">
        {/* File upload input */}
        <div className="flex-grow flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-gold" /> Upload New Hero Image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            disabled={actionLoading}
            className="px-4 py-3 bg-background border border-white/10 rounded-xl text-gray-400 text-xs focus:outline-none file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-hover cursor-pointer w-full"
          />
        </div>

        {/* Text input URL form */}
        <form onSubmit={handleAddHero} className="flex-grow flex flex-col sm:flex-row gap-4 items-end w-full md:w-1/2">
          <div className="flex-grow flex flex-col gap-2 w-full">
            <label htmlFor="newUrl" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Or Add Image by URL
            </label>
            <input
              id="newUrl"
              type="url"
              placeholder="https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-gray-700 w-full"
            />
          </div>
          <button
            type="submit"
            disabled={actionLoading || !newUrl.trim()}
            className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      {/* Hero Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroes.length > 0 ? (
          heroes.map((hero, index) => (
            <div
              key={hero.id}
              className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col relative group"
            >
              {/* Image preview */}
              <div className="relative h-[220px] w-full">
                <Image
                  src={hero.image_url}
                  alt={`Hero ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 text-xs font-mono px-2.5 py-1 rounded-md glass text-white border border-white/10">
                  Order: {hero.display_order}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0 || actionLoading}
                    className="p-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:border-gold hover:text-gold text-gray-400 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-white/5 transition-all"
                    aria-label="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === heroes.length - 1 || actionLoading}
                    className="p-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:border-gold hover:text-gold text-gray-400 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-white/5 transition-all"
                    aria-label="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={hero.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:border-blue-500 hover:text-blue-400 text-gray-400 transition-all"
                    title="Open Image"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteHero(hero.id, hero.image_url)}
                    disabled={actionLoading}
                    className="p-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:border-red-500 hover:text-red-400 text-gray-400 transition-all"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-gray-500 font-serif font-light glass rounded-2xl border border-white/5">
            No hero images uploaded. The homepage will display static defaults.
          </div>
        )}
      </div>
    </div>
  );
}
