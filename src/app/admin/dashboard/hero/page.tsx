'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Trash2, Plus, ArrowUp, ArrowDown, ExternalLink, Upload, 
  Check, X, AlertTriangle, AlertCircle, Info, Loader2, GripVertical 
} from 'lucide-react';
import Image from 'next/image';
import { revalidateHome } from '@/app/actions';

interface HeroImage {
  id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMsg?: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export default function AdminHeroPage() {
  const supabase = createClient();
  const [heroes, setHeroes] = useState<HeroImage[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Enhancements State
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Drag and drop reordering state & refs
  const draggedIdxRef = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const activeXHRsRef = useRef<Map<string, XMLHttpRequest>>(new Map());

  // Toast Helper
  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const fetchHeroes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('id, image_url, display_order, created_at')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setHeroes(data || []);
    } catch (err: any) {
      console.error('Error fetching hero images:', err);
      setErrorMsg(err.message || 'Failed to fetch hero images.');
      showToast('Failed to fetch hero images.', 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase, showToast]);

  useEffect(() => {
    fetchHeroes();
    
    const activeXHRs = activeXHRsRef.current;
    // Cleanup active XHR requests on unmount
    return () => {
      activeXHRs.forEach((xhr) => xhr.abort());
    };
  }, [fetchHeroes]);

  // Handle URL additions
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
      showToast('Hero image added by URL.', 'success');
      await fetchHeroes();
      await revalidateHome();
    } catch (err: any) {
      console.error('Error adding hero image:', err);
      setErrorMsg(err.message || 'Failed to add hero image.');
      showToast('Failed to add hero image.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Single Image Deletion
  const handleDeleteHero = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    setActionLoading(true);
    setErrorMsg(null);

    try {
      let fileName = '';
      if (imageUrl.includes('/storage/v1/object/public/hero-images/')) {
        fileName = imageUrl.split('/').pop() || '';
      }

      if (fileName) {
        const res = await fetch(`/api/upload?bucket=hero-images&filename=${encodeURIComponent(fileName)}`, {
          method: 'DELETE',
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to delete file from storage.');
        }
      }

      const { error: dbError } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      showToast('Hero image deleted.', 'success');
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      await fetchHeroes();
      await revalidateHome();
    } catch (err: any) {
      console.error('Error deleting hero image:', err);
      showToast(err.message || 'Failed to delete hero image.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // File selection handler supporting multiple files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    addFilesToQueue(Array.from(files));
    e.target.value = '';
  };

  // Multi-Image Upload Queue & Drag-and-Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const filesArray = Array.from(e.dataTransfer.files).filter((f) =>
        allowedTypes.includes(f.type)
      );

      if (filesArray.length === 0) {
        showToast('Only JPG, PNG, and WEBP images are supported.', 'error');
        return;
      }
      addFilesToQueue(filesArray);
    }
  };

  const addFilesToQueue = (files: File[]) => {
    const newItems = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    setUploadQueue((prev) => [...prev, ...newItems]);
  };

  const startUploads = useCallback(async (itemsToUpload: UploadItem[]) => {
    if (itemsToUpload.length === 0) return;

    setActionLoading(true);

    // Update statuses to uploading
    setUploadQueue((prev) =>
      prev.map((item) =>
        itemsToUpload.some((x) => x.id === item.id)
          ? { ...item, status: 'uploading' }
          : item
      )
    );

    const uploadPromises = itemsToUpload.map(async (item) => {
      try {
        const url = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          activeXHRsRef.current.set(item.id, xhr);

          xhr.open('POST', '/api/upload');

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadQueue((prev) =>
                prev.map((q) => (q.id === item.id ? { ...q, progress: percent } : q))
              );
            }
          };

          xhr.onload = () => {
            activeXHRsRef.current.delete(item.id);
            if (xhr.status === 201) {
              try {
                const res = JSON.parse(xhr.responseText);
                resolve(res.url);
              } catch {
                reject(new Error('Invalid upload response'));
              }
            } else {
              try {
                const res = JSON.parse(xhr.responseText);
                reject(new Error(res.error || `Upload failed (${xhr.status})`));
              } catch {
                reject(new Error(`Upload failed (${xhr.status})`));
              }
            }
          };

          xhr.onerror = () => {
            activeXHRsRef.current.delete(item.id);
            reject(new Error('Network connection error'));
          };

          xhr.onabort = () => {
            activeXHRsRef.current.delete(item.id);
            reject(new Error('Upload cancelled'));
          };

          const formData = new FormData();
          formData.append('file', item.file);
          formData.append('bucket', 'hero-images');
          xhr.send(formData);
        });

        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'success', progress: 100 } : q))
        );
        return url;
      } catch (err: any) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', errorMsg: err.message || 'Upload failed' }
              : q
          )
        );
        throw err;
      }
    });

    const results = await Promise.allSettled(uploadPromises);
    const successfulUrls = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
      .map((r) => r.value);

    if (successfulUrls.length > 0) {
      try {
        const nextOrderStart = heroes.length > 0 ? Math.max(...heroes.map(h => h.display_order)) + 1 : 1;
        const newRecords = successfulUrls.map((url, idx) => ({
          image_url: url,
          display_order: nextOrderStart + idx,
        }));

        const { error } = await supabase.from('hero_images').insert(newRecords);
        if (error) throw error;

        showToast(`Uploaded ${successfulUrls.length} image(s) successfully.`, 'success');
        await fetchHeroes();
        await revalidateHome();
      } catch (dbErr: any) {
        console.error('Database save error:', dbErr);
        showToast(dbErr.message || 'Failed to save uploaded files in database.', 'error');
      }
    }

    const failedCount = results.filter((r) => r.status === 'rejected').length;
    if (failedCount > 0) {
      showToast(`${failedCount} file upload(s) failed.`, 'error');
    }

    setActionLoading(false);
  }, [heroes, supabase, fetchHeroes, showToast]);

  // Trigger uploads for pending files
  useEffect(() => {
    const pendingItems = uploadQueue.filter((item) => item.status === 'pending');
    if (pendingItems.length > 0) {
      startUploads(pendingItems);
    }
  }, [uploadQueue, startUploads]);

  const cancelUpload = (id: string) => {
    const xhr = activeXHRsRef.current.get(id);
    if (xhr) {
      xhr.abort();
    }
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const removeQueueItem = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompletedQueue = () => {
    setUploadQueue((prev) => prev.filter((item) => item.status !== 'success' && item.status !== 'error'));
  };

  // Reordering: native HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedIdxRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-40');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdxRef.current === index) return;
    setDragOverIdx(index);
  };

  const handleDragLeave = (index: number) => {
    if (dragOverIdx === index) {
      setDragOverIdx(null);
    }
  };

  const handleDropItem = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = draggedIdxRef.current;
    if (sourceIndex === null || sourceIndex === targetIndex) return;

    setDragOverIdx(null);
    setActionLoading(true);

    try {
      const reordered = [...heroes];
      const [draggedItem] = reordered.splice(sourceIndex, 1);
      reordered.splice(targetIndex, 0, draggedItem);
      
      const updatedHeroes = reordered.map((hero, idx) => ({
        ...hero,
        display_order: idx + 1,
      }));

      // Optimistic state update
      setHeroes(updatedHeroes);

      const updates = updatedHeroes.map(hero => ({
        id: hero.id,
        image_url: hero.image_url,
        display_order: hero.display_order,
      }));

      const { error } = await supabase.from('hero_images').upsert(updates);
      if (error) throw error;

      showToast('Image slider order updated.', 'success');
      await revalidateHome();
    } catch (err: any) {
      console.error('Drag drop order error:', err);
      showToast(err.message || 'Failed to update reorder in database.', 'error');
      await fetchHeroes();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    draggedIdxRef.current = null;
    setDragOverIdx(null);
    e.currentTarget.classList.remove('opacity-40');
  };

  // Manual Reordering Fallback (Move Up/Down Buttons)
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === heroes.length - 1) return;

    setActionLoading(true);
    setErrorMsg(null);

    try {
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      
      const reordered = [...heroes];
      const temp = reordered[index];
      reordered[index] = reordered[targetIdx];
      reordered[targetIdx] = temp;

      const updatedHeroes = reordered.map((hero, idx) => ({
        ...hero,
        display_order: idx + 1,
      }));

      setHeroes(updatedHeroes); // Optimistic UI

      const updates = updatedHeroes.map((hero) => ({
        id: hero.id,
        image_url: hero.image_url,
        display_order: hero.display_order,
      }));

      const { error } = await supabase.from('hero_images').upsert(updates);
      if (error) throw error;

      showToast('Image slider order updated.', 'success');
      await revalidateHome();
    } catch (err: any) {
      console.error('Error reordering hero images:', err);
      showToast(err.message || 'Failed to reorder hero images.', 'error');
      await fetchHeroes();
    } finally {
      setActionLoading(false);
    }
  };

  // Multi-Selection Logic
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === heroes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(heroes.map((h) => h.id)));
    }
  };

  // Bulk Deletion Execution
  const handleBulkDelete = async () => {
    setIsDeleteModalOpen(false);
    setActionLoading(true);
    
    const idsToDelete = Array.from(selectedIds);
    const itemsToDelete = heroes.filter((h) => idsToDelete.includes(h.id));
    
    try {
      // 1. Extract file names from storage URLs
      const fileNames = itemsToDelete
        .map((h) => {
          if (h.image_url.includes('/storage/v1/object/public/hero-images/')) {
            return h.image_url.split('/').pop() || '';
          }
          return '';
        })
        .filter((name) => name !== '');

      // 2. Delete from storage using API route
      if (fileNames.length > 0) {
        const params = new URLSearchParams();
        params.append('bucket', 'hero-images');
        fileNames.forEach((name) => params.append('filename', name));

        const res = await fetch(`/api/upload?${params.toString()}`, {
          method: 'DELETE',
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to delete files from storage.');
        }
      }

      // 3. Delete from Database
      const { error: dbError } = await supabase
        .from('hero_images')
        .delete()
        .in('id', idsToDelete);

      if (dbError) throw dbError;

      showToast(`Successfully deleted ${idsToDelete.length} images.`, 'success');
      setSelectedIds(new Set());
      await fetchHeroes();
      await revalidateHome();
    } catch (err: any) {
      console.error('Bulk delete error:', err);
      showToast(err.message || 'Failed to complete bulk deletion.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 relative select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-light">Hero Slider Management</h1>
          <p className="text-sm text-gray-500 mt-1.5 font-light">
            Upload, arrange, and select multiple high-resolution images displayed on the homepage slider.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-200 rounded-xl text-xs flex justify-between items-center">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-200 X h-4 w-4">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Advanced File Upload Component (Dropzone + URL forms) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dropzone Upload */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] sm:min-h-[180px] ${
              dragActive 
                ? 'border-accent bg-accent/5 shadow-[0_0_20px_rgba(212,175,55,0.05)]' 
                : 'border-border/10 hover:border-accent/30 bg-background/[0.01]'
            } ${actionLoading ? 'pointer-events-none opacity-50' : ''}`}
            onClick={() => document.getElementById('file-picker')?.click()}
          >
            <input
              id="file-picker"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={actionLoading}
              className="hidden"
            />
            {actionLoading ? (
              <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
            ) : (
              <Upload className="w-10 h-10 text-accent/60 mb-4 group-hover:text-accent" />
            )}
            <p className="text-sm text-foreground font-medium">
              Drag & Drop files here, or <span className="text-accent underline underline-offset-2 hover:text-accent-hover">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports JPEG, PNG, and WEBP (Max 5MB each)
            </p>
          </div>
        </div>

        {/* URL Addition form */}
        <div className="glass p-6 rounded-2xl border border-border/5 flex flex-col justify-center gap-4">
          <form onSubmit={handleAddHero} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="newUrl" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Or Add Image by URL
              </label>
              <input
                id="newUrl"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                disabled={actionLoading}
                className="px-4 py-3 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors placeholder:text-gray-700 w-full"
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading || !newUrl.trim()}
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add URL
            </button>
          </form>
        </div>
      </div>

      {/* Upload Queue Progress Display */}
      {uploadQueue.length > 0 && (
        <div className="glass p-6 rounded-2xl border border-border/5 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border/5 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-accent flex items-center gap-2">
              Upload Progress ({uploadQueue.filter(i => i.status === 'success').length}/{uploadQueue.length})
            </h3>
            <button
              onClick={clearCompletedQueue}
              className="text-xs text-gray-500 hover:text-foreground transition-colors uppercase tracking-wider font-semibold cursor-pointer"
            >
              Clear Completed
            </button>
          </div>
          <div className="flex flex-col gap-3.5 max-h-[200px] overflow-y-auto pr-2">
            {uploadQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                <span className="text-gray-300 truncate max-w-[100px] sm:max-w-[200px] font-mono">{item.file.name}</span>
                
                <div className="flex-grow flex items-center gap-3">
                  <div className="flex-grow bg-background/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        item.status === 'error' 
                          ? 'bg-red-500' 
                          : item.status === 'success' 
                          ? 'bg-emerald-500' 
                          : 'bg-accent'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 shrink-0 w-8 text-right">
                    {item.progress}%
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'uploading' && (
                    <button 
                      onClick={() => cancelUpload(item.id)}
                      className="p-1 rounded bg-background/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 cursor-pointer"
                      title="Cancel Upload"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {item.status === 'success' && <Check className="w-4 h-4 text-emerald-500" />}
                  {item.status === 'error' && (
                    <div className="flex items-center gap-1.5">
                      <span title={item.errorMsg} className="cursor-help">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </span>
                      <button 
                        onClick={() => removeQueueItem(item.id)}
                        className="text-gray-500 hover:text-foreground cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Select Floating/Control Action Bar */}
      {selectedIds.size > 0 && (
        <div className="glass p-4 rounded-xl border border-border/10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-sm font-semibold text-foreground">
              {selectedIds.size} file(s) selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-xs uppercase tracking-wider text-accent hover:text-accent-hover font-semibold bg-background/5 px-3 py-1.5 rounded-lg border border-border/5 cursor-pointer"
            >
              {selectedIds.size === heroes.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-foreground font-semibold cursor-pointer"
            >
              Clear
            </button>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-200 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Selected
          </button>
        </div>
      )}

      {/* Hero Images Grid */}
      <div className="flex flex-col gap-4">
        {heroes.length > 0 && selectedIds.size === 0 && (
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Drag and drop cards to reorder
            </span>
            <button 
              onClick={handleSelectAll}
              className="text-xs text-accent hover:text-accent-hover uppercase tracking-widest font-semibold underline underline-offset-2"
            >
              Select Multiple
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroes.length > 0 ? (
            heroes.map((hero, index) => {
              const isSelected = selectedIds.has(hero.id);
              const isOver = dragOverIdx === index;
              return (
                <div
                  key={hero.id}
                  draggable={!actionLoading}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={() => handleDragLeave(index)}
                  onDrop={(e) => handleDropItem(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => selectedIds.size > 0 && toggleSelect(hero.id)}
                  className={`glass rounded-2xl border overflow-hidden flex flex-col relative group transition-all duration-300 ${
                    isSelected 
                      ? 'border-accent/75 bg-accent/[0.02] shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : isOver
                      ? 'border-accent/50 bg-accent/[0.01] scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                      : 'border-border/5 hover:border-border/10'
                  } ${selectedIds.size > 0 ? 'cursor-pointer' : ''}`}
                >
                  {/* Select Checkbox (visible on hover or when selection active) */}
                  <div className={`absolute top-4 left-4 z-30 transition-opacity duration-300 ${
                    selectedIds.size > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(hero.id);
                      }}
                      className="w-4 h-4 rounded border-border/20 bg-background text-accent focus:ring-0 cursor-pointer accent-gold"
                    />
                  </div>

                  {/* Drag Grip (handles reordering visual cue) */}
                  {selectedIds.size === 0 && (
                    <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1.5 rounded bg-black/60 border border-border/10 text-gray-400 hover:text-foreground transition-opacity">
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Image preview */}
                  <div className="relative h-[220px] w-full">
                    <Image
                      src={hero.image_url}
                      alt={`Hero ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 text-xs font-mono px-2.5 py-1 rounded-md glass text-foreground border border-border/10">
                      Order: {hero.display_order}
                    </span>
                  </div>

                  {/* Action Buttons / Details */}
                  <div className="p-4 flex items-center justify-between gap-4 mt-auto">
                    <span className="text-[10px] text-gray-500 font-mono">
                      {hero.created_at ? new Date(hero.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                    
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0 || actionLoading || selectedIds.size > 0}
                        className="p-2 rounded-lg border border-border/5 bg-background/[0.01] hover:border-accent hover:text-accent text-gray-400 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-border/5 transition-all"
                        aria-label="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === heroes.length - 1 || actionLoading || selectedIds.size > 0}
                        className="p-2 rounded-lg border border-border/5 bg-background/[0.01] hover:border-accent hover:text-accent text-gray-400 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-border/5 transition-all"
                        aria-label="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={hero.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border/5 bg-background/[0.01] hover:border-blue-500 hover:text-blue-400 text-gray-400 transition-all"
                        title="Open Image"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteHero(hero.id, hero.image_url)}
                        disabled={actionLoading || selectedIds.size > 0}
                        className="p-2 rounded-lg border border-border/5 bg-background/[0.01] hover:border-red-500 hover:text-red-400 text-gray-400 transition-all"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500 font-serif font-light glass rounded-2xl border border-border/5">
              No hero images uploaded. The homepage will display static defaults.
            </div>
          )}
        </div>
      </div>

      {/* Reusable Luxury Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((t) => {
          const isError = t.type === 'error';
          const isSuccess = t.type === 'success';
          const isWarning = t.type === 'warning';
          return (
            <div
              key={t.id}
              className={`p-4 rounded-xl border flex items-center gap-3.5 shadow-xl glass transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
                isError 
                  ? 'bg-rose-950/90 border-rose-500/30 text-rose-200' 
                  : isSuccess 
                  ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
                  : isWarning
                  ? 'bg-amber-950/90 border-amber-500/30 text-amber-200'
                  : 'bg-zinc-900/95 border-border/10 text-foreground'
              }`}
            >
              <div className="shrink-0">
                {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {isSuccess && <Check className="w-4 h-4 text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {t.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
              </div>
              <p className="text-xs font-medium leading-relaxed flex-grow">{t.message}</p>
            </div>
          );
        })}
      </div>

      {/* Bulk Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="glass p-6 sm:p-8 rounded-2xl border border-border/10 max-w-md w-full relative z-10 flex flex-col gap-6 shadow-2xl animate-in scale-in duration-200">
            <div className="flex gap-4">
              <div className="p-3 rounded-full bg-red-500/10 text-red-400 shrink-0 self-start">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-lg text-foreground">Delete Selected Images</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Are you sure you want to delete {selectedIds.size} selected hero image(s)? This action will remove the files from storage and database records permanently.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs uppercase tracking-widest font-semibold text-gray-400 hover:text-foreground rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading}
                className="px-5 py-2 text-xs uppercase tracking-widest font-semibold bg-red-500 hover:bg-red-600 text-foreground rounded-lg transition-colors shadow-lg shadow-red-500/10"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
