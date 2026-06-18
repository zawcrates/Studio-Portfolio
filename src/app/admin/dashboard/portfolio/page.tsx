'use strict';

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Trash2, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Upload,
  Edit,
  XCircle,
  CheckCircle2,
  Star,
  Link2,
  Move,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Image from 'next/image';

interface Photo {
  id: string;
  image_url: string;
  display_order?: number;
}

interface Album {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_image: string;
  description?: string;
  photos: Photo[];
  created_at?: string;
}

const CATEGORIES = [
  { id: 'weddings', name: 'Weddings' },
  { id: 'pre-weddings', name: 'Pre-Weddings' },
  { id: 'engagements', name: 'Engagements' },
  { id: 'maternity', name: 'Maternity' },
  { id: 'events', name: 'Events' },
  { id: 'corporate', name: 'Corporate' },
];

export default function AdminPortfolioPage() {
  const supabase = createClient();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states (Create Album)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');

  // Form states (Edit Album)
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');

  // Direct manual photo URL state
  const [photoUrlInput, setPhotoUrlInput] = useState<{ [albumId: string]: string }>({});

  // Bulk upload progress state
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  // Drag and drop tracking
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedAlbumId, setDraggedAlbumId] = useState<string | null>(null);

  // Expanded album details tracking
  const [expandedAlbumId, setExpandedAlbumId] = useState<string | null>(null);

  const fetchAlbums = useCallback(async () => {
    try {
      const { data: albumsData, error: albumsErr } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (albumsErr) throw albumsErr;

      const loadedAlbums = await Promise.all(
        (albumsData || []).map(async (album: any) => {
          const { data: photosData } = await supabase
            .from('photos')
            .select('id, image_url, display_order')
            .eq('album_id', album.id)
            .order('display_order', { ascending: true });

          return {
            ...album,
            photos: photosData || [],
          };
        })
      );

      setAlbums(loadedAlbums);
    } catch (err: any) {
      console.error('Error fetching albums:', err);
      setErrorMsg(err.message || 'Failed to load portfolio albums.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  // Alert timers
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newTitle.trim() || !newCategory || !newCoverUrl.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setActionLoading(true);

    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newAlbumRecord = {
      title: newTitle.trim(),
      slug,
      category: newCategory,
      cover_image: newCoverUrl.trim(),
      description: newDescription.trim(),
    };

    const tempId = crypto.randomUUID();
    const optimisticAlbum: Album = {
      id: tempId,
      ...newAlbumRecord,
      photos: [],
      created_at: new Date().toISOString()
    };
    setAlbums(prev => [optimisticAlbum, ...prev]);

    try {
      const { data, error } = await supabase
        .from('albums')
        .insert([newAlbumRecord])
        .select();

      if (error) {
        setAlbums(prev => prev.filter(a => a.id !== tempId));
        throw error;
      }

      if (data && data[0]) {
        setAlbums(prev => prev.map(a => a.id === tempId ? { ...data[0], photos: [] } : a));
      }

      setSuccessMsg('Album created successfully!');
      setNewTitle('');
      setNewCategory('');
      setNewDescription('');
      setNewCoverUrl('');
      setShowCreateForm(false);
    } catch (err: any) {
      console.error('Error creating album:', err);
      setErrorMsg(err.message || 'Failed to create album.');
      fetchAlbums();
    } finally {
      setActionLoading(false);
    }
  };

  const startEditAlbum = (album: Album) => {
    setEditingAlbumId(album.id);
    setEditTitle(album.title);
    setEditCategory(album.category);
    setEditDescription(album.description || '');
    setEditCoverUrl(album.cover_image);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleUpdateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!editingAlbumId || !editTitle.trim() || !editCategory || !editCoverUrl.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setActionLoading(true);

    const slug = editTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const updatedFields = {
      title: editTitle.trim(),
      slug,
      category: editCategory,
      cover_image: editCoverUrl.trim(),
      description: editDescription.trim(),
    };

    const previousAlbums = [...albums];
    setAlbums(prev => prev.map(a => a.id === editingAlbumId ? { ...a, ...updatedFields } : a));

    try {
      const { error } = await supabase
        .from('albums')
        .update(updatedFields)
        .eq('id', editingAlbumId);

      if (error) {
        setAlbums(previousAlbums);
        throw error;
      }

      setSuccessMsg('Album updated successfully!');
      setEditingAlbumId(null);
    } catch (err: any) {
      console.error('Error updating album:', err);
      setErrorMsg(err.message || 'Failed to update album.');
      fetchAlbums();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAlbum = async (album: Album) => {
    if (!confirm(`Are you sure you want to delete this entire album "${album.title}"? This will delete all associated photos in storage and the database.`)) return;

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const previousAlbums = [...albums];
    setAlbums(prev => prev.filter(a => a.id !== album.id));

    try {
      // 1. Retrieve associated photos
      console.info(`[Cascading Delete] Step 1: Fetching photos for album ${album.id}`);
      const { data: photos, error: fetchErr } = await supabase
        .from('photos')
        .select('id, image_url')
        .eq('album_id', album.id);

      if (fetchErr) {
        console.error('[Cascading Delete] Step 1 Error: Fetching photos failed:', fetchErr);
        throw fetchErr;
      }
      console.log(`[Cascading Delete] Step 1 Success: Fetched ${photos?.length || 0} photos:`, photos);

      // 2. Delete associated storage files (photos and cover image) from portfolio-images bucket
      const extractFilename = (url: string) => {
        try {
          const urlWithoutParams = url.split('?')[0];
          const segment = urlWithoutParams.split('/').pop();
          return segment ? decodeURIComponent(segment) : '';
        } catch {
          return '';
        }
      };

      const failedDeletions: string[] = [];
      const filesToDelete: { id?: string; fileName: string; isCover: boolean }[] = [];

      if (photos && photos.length > 0) {
        for (const photo of photos) {
          if (photo.image_url.includes('/storage/v1/object/public/portfolio-images/')) {
            const fileName = extractFilename(photo.image_url);
            if (fileName) {
              filesToDelete.push({ id: photo.id, fileName, isCover: false });
            }
          }
        }
      }

      if (album.cover_image.includes('/storage/v1/object/public/portfolio-images/')) {
        const coverFileName = extractFilename(album.cover_image);
        if (coverFileName) {
          filesToDelete.push({ fileName: coverFileName, isCover: true });
        }
      }

      if (filesToDelete.length > 0) {
        console.info(`[Cascading Delete] Step 2: Deleting ${filesToDelete.length} files from storage concurrently`);
        await Promise.all(
          filesToDelete.map(async (file) => {
            try {
              const deleteRes = await fetch(`/api/upload?bucket=portfolio-images&filename=${encodeURIComponent(file.fileName)}`, {
                method: 'DELETE',
              });
              let resData = null;
              try {
                resData = await deleteRes.json();
              } catch {
                // Ignore parse errors
              }
              console.log(`[Cascading Delete] Storage Deletion Result for ${file.isCover ? 'Cover' : 'Photo'} [${file.id || 'N/A'}] (File: ${file.fileName}):`, {
                status: deleteRes.status,
                statusText: deleteRes.statusText,
                ok: deleteRes.ok,
                responseBody: resData
              });
              if (!deleteRes.ok) {
                console.warn(`Failed to delete storage file ${file.fileName}:`, resData?.error);
                failedDeletions.push(file.fileName);
              }
            } catch (err) {
              console.error(`Error deleting storage file ${file.fileName}:`, err);
              failedDeletions.push(file.fileName);
            }
          })
        );
      }

      // 3. Delete database photo records
      if (photos && photos.length > 0) {
        console.info('[Cascading Delete] Step 3: Deleting database photos');
        const dbPhotosResult = await supabase
          .from('photos')
          .delete()
          .eq('album_id', album.id);

        console.log('[Cascading Delete] Step 3 Photo DB Deletion Result:', {
          status: dbPhotosResult.status,
          statusText: dbPhotosResult.statusText,
          error: dbPhotosResult.error,
          data: dbPhotosResult.data
        });

        if (dbPhotosResult.error) {
          console.error('[Cascading Delete] Step 3 Error: Deleting database photos failed:', dbPhotosResult.error);
          throw dbPhotosResult.error;
        }
      } else {
        console.info('[Cascading Delete] Step 3 Skip: No photos associated with this album');
      }

      // 4. Delete album record
      console.info('[Cascading Delete] Step 4: Deleting album record');
      const dbAlbumResult = await supabase
        .from('albums')
        .delete()
        .eq('id', album.id);

      console.log('[Cascading Delete] Step 4 Album DB Deletion Result:', {
        status: dbAlbumResult.status,
        statusText: dbAlbumResult.statusText,
        error: dbAlbumResult.error,
        data: dbAlbumResult.data
      });

      if (dbAlbumResult.error) {
        console.error('[Cascading Delete] Step 4 Error: Deleting album record failed:', dbAlbumResult.error);
        throw dbAlbumResult.error;
      }

      if (failedDeletions.length > 0) {
        setSuccessMsg(`Album deleted from DB, but failed to clean up ${failedDeletions.length} files from storage: ${failedDeletions.join(', ')}`);
      } else {
        setSuccessMsg('Album and all assets deleted successfully!');
      }
      if (expandedAlbumId === album.id) setExpandedAlbumId(null);
    } catch (err: any) {
      setAlbums(previousAlbums);
      console.error('[Cascading Delete] Catch Block - Album deletion failed. Full Error Object:', err);
      setErrorMsg(err.message || 'Failed to delete album.');
      fetchAlbums();
    } finally {
      setActionLoading(false);
    }
  };

  // Cover Image upload helper
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'portfolio-images');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (editingAlbumId) {
        setEditCoverUrl(data.url);
      } else {
        setNewCoverUrl(data.url);
      }
      setSuccessMsg('Cover image uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Failed to upload cover file.');
    } finally {
      setActionLoading(false);
      e.target.value = '';
    }
  };

  // Add photo manually via direct URL
  const handleAddPhoto = async (albumId: string) => {
    const url = photoUrlInput[albumId];
    if (!url || !url.trim()) return;

    setActionLoading(true);
    setErrorMsg(null);

    try {
      const targetAlbum = albums.find(a => a.id === albumId);
      const nextOrder = targetAlbum && targetAlbum.photos.length > 0 
        ? Math.max(...targetAlbum.photos.map(p => p.display_order || 0)) + 1 
        : 1;

      const { error } = await supabase
        .from('photos')
        .insert([
          {
            album_id: albumId,
            image_url: url.trim(),
            display_order: nextOrder,
          },
        ]);

      if (error) throw error;

      setPhotoUrlInput(prev => ({
        ...prev,
        [albumId]: '',
      }));

      await fetchAlbums();
      setSuccessMsg('Photo added to album.');
    } catch (err: any) {
      console.error('Error adding photo:', err);
      setErrorMsg(err.message || 'Failed to add photo.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete individual photo
  const handleDeletePhoto = async (photo: Photo) => {
    if (!confirm('Delete this photo from the album?')) return;

    setActionLoading(true);
    setErrorMsg(null);

    try {
      // 1. Delete from storage via server DELETE API (bypasses policies)
      if (photo.image_url.includes('/storage/v1/object/public/portfolio-images/')) {
        const fileName = photo.image_url.split('/').pop();
        if (fileName) {
          console.info(`[Photo Delete Flow] Deleting file from storage: ${fileName}`);
          const deleteRes = await fetch(`/api/upload?bucket=portfolio-images&filename=${encodeURIComponent(fileName)}`, {
            method: 'DELETE',
          });
          const data = await deleteRes.json();
          if (!deleteRes.ok) {
            throw new Error(data.error || 'Failed to delete file from storage.');
          }
        }
      }

      // 2. Delete database entry
      console.info('[Photo Delete Flow] Deleting record from database.');
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (error) throw error;
      
      setSuccessMsg('Photo removed successfully.');
      await fetchAlbums();
    } catch (err: any) {
      console.error('Error deleting photo:', err);
      setErrorMsg(err.message || 'Failed to delete photo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePhotoUrlChange = (albumId: string, val: string) => {
    setPhotoUrlInput(prev => ({
      ...prev,
      [albumId]: val,
    }));
  };

  // Bulk Photo Upload handler
  const handleBulkPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    albumId: string,
    albumPhotos: Photo[]
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setActionLoading(true);
    setErrorMsg(null);
    setUploadProgress({ current: 0, total: files.length });

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length });
        const file = files[i];
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'portfolio-images');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Upload failed for file ${file.name}`);
        }

        const nextOrder = albumPhotos.length > 0 
          ? Math.max(...albumPhotos.map(p => p.display_order || 0)) + i + 1 
          : i + 1;

        const { error } = await supabase.from('photos').insert([
          {
            album_id: albumId,
            image_url: data.url,
            display_order: nextOrder,
          },
        ]);

        if (error) throw error;
      }

      setSuccessMsg(`Uploaded ${files.length} photos successfully!`);
      await fetchAlbums();
    } catch (err: any) {
      console.error('Bulk upload error:', err);
      setErrorMsg(err.message || 'Failed to complete bulk photo upload.');
    } finally {
      setActionLoading(false);
      setUploadProgress(null);
      e.target.value = '';
    }
  };

  // Up/Down Sequence Swapping for Accessibility and Mobile
  const handleMovePhoto = async (album: Album, photoIndex: number, direction: 'up' | 'down') => {
    if (direction === 'up' && photoIndex === 0) return;
    if (direction === 'down' && photoIndex === album.photos.length - 1) return;

    setActionLoading(true);
    setErrorMsg(null);

    try {
      const targetIdx = direction === 'up' ? photoIndex - 1 : photoIndex + 1;
      const photoA = album.photos[photoIndex];
      const photoB = album.photos[targetIdx];

      const orderA = photoA.display_order !== undefined ? photoA.display_order : photoIndex;
      const orderB = photoB.display_order !== undefined ? photoB.display_order : targetIdx;

      const { error: errorA } = await supabase
        .from('photos')
        .update({ display_order: orderB })
        .eq('id', photoA.id);

      if (errorA) throw errorA;

      const { error: errorB } = await supabase
        .from('photos')
        .update({ display_order: orderA })
        .eq('id', photoB.id);

      if (errorB) throw errorB;

      await fetchAlbums();
    } catch (err: any) {
      console.error('Error reordering photos:', err);
      setErrorMsg(err.message || 'Failed to reorder photos.');
    } finally {
      setActionLoading(false);
    }
  };

  // Change Album Cover Image Shortcut
  const handleSetCoverImage = async (albumId: string, imageUrl: string) => {
    setActionLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('albums')
        .update({ cover_image: imageUrl })
        .eq('id', albumId);

      if (error) throw error;
      setSuccessMsg('Album cover updated.');
      await fetchAlbums();
    } catch (err: any) {
      console.error('Error setting cover image:', err);
      setErrorMsg(err.message || 'Failed to update cover image.');
    } finally {
      setActionLoading(false);
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, albumId: string, index: number) => {
    setDraggedIndex(index);
    setDraggedAlbumId(albumId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, albumId: string, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedAlbumId !== albumId || draggedIndex === targetIndex) return;

    setActionLoading(true);
    setErrorMsg(null);

    const album = albums.find(a => a.id === albumId);
    if (!album) return;

    // Build reordered list optimistically
    const reorderedPhotos = [...album.photos];
    const [draggedPhoto] = reorderedPhotos.splice(draggedIndex, 1);
    reorderedPhotos.splice(targetIndex, 0, draggedPhoto);

    // Apply Optimistic Update
    setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, photos: reorderedPhotos } : a));

    try {
      // Commit the updated sequence indices to database
      const promises = reorderedPhotos.map((photo, idx) => {
        return supabase
          .from('photos')
          .update({ display_order: idx + 1 })
          .eq('id', photo.id);
      });

      const results = await Promise.all(promises);
      const err = results.find(r => r.error);
      if (err) throw err.error;

      setSuccessMsg('Reordered photos successfully!');
      await fetchAlbums();
    } catch (err: any) {
      console.error('Failed to commit reorder:', err);
      setErrorMsg(err.message || 'Failed to persist photo sequence. Reverting UI.');
      fetchAlbums();
    } finally {
      setActionLoading(false);
      setDraggedIndex(null);
      setDraggedAlbumId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedAlbumId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-light">Portfolio Albums</h1>
          <p className="text-sm text-gray-500 mt-1.5 font-light">
            Create albums, add photo collections, and manage existing client showcases.
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingAlbumId(null);
          }}
          className="px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> {showCreateForm ? 'Cancel Form' : 'Create Album'}
        </button>
      </div>

      {/* Message Feedback Banners */}
      {successMsg && (
        <div className="p-4 bg-green-950/40 border border-green-500/20 text-green-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-200 rounded-xl text-xs flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Bulk Upload Progress Overlay */}
      {uploadProgress && (
        <div className="p-4 bg-accent/10 border border-accent/25 text-accent rounded-xl text-xs flex items-center justify-between">
          <span className="font-semibold uppercase tracking-wider">
            Bulk Uploading Photos: {uploadProgress.current} of {uploadProgress.total} completed
          </span>
          <div className="w-24 bg-background/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-accent h-full transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Create Album Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateAlbum} className="glass p-6 sm:p-8 rounded-2xl border border-border/5 flex flex-col gap-5 bg-[#0e0e11]">
          <h2 className="font-serif text-xl text-foreground font-light border-b border-border/5 pb-3">New Portfolio Album</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Album Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Priya & Vikram Pre-Wedding"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="px-4 py-3 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Category *
              </label>
              <select
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                className="px-4 py-3 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-card">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-accent" /> Upload Cover Image *
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverUpload}
                disabled={actionLoading}
                className="px-4 py-3 bg-background border border-border/10 rounded-xl text-gray-400 text-xs focus:outline-none file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-black hover:file:bg-accent-hover cursor-pointer w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cover" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Or Paste Cover Image URL *
              </label>
              <input
                id="cover"
                type="url"
                placeholder="https://..."
                value={newCoverUrl}
                onChange={(e) => setNewCoverUrl(e.target.value)}
                required
                className="px-4 py-3 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Provide context, location, and key details..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="px-4 py-3 bg-background border border-border/10 rounded-xl text-foreground text-sm focus:border-accent focus:outline-none transition-colors resize-none w-full"
            />
          </div>

          <button
            type="submit"
            disabled={actionLoading || !newCoverUrl}
            className="self-end px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold text-xs uppercase tracking-widest transition-colors duration-300 disabled:opacity-50"
          >
            Create Album
          </button>
        </form>
      )}

      {/* Album List Accordion */}
      <div className="flex flex-col gap-6">
        {albums.length > 0 ? (
          albums.map((album) => {
            const isExpanded = expandedAlbumId === album.id;
            const isEditing = editingAlbumId === album.id;
            return (
              <div key={album.id} className="glass rounded-2xl border border-border/5 overflow-hidden flex flex-col bg-[#0e0e11]">
                {/* Album Header Bar */}
                <div
                  onClick={() => setExpandedAlbumId(isExpanded ? null : album.id)}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 cursor-pointer hover:bg-background/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/10 shrink-0">
                      <Image
                        src={album.cover_image}
                        alt={album.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-base sm:text-lg text-foreground font-light truncate">{album.title}</h3>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-background/5 text-accent font-semibold">
                          {album.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs sm:max-w-lg">{album.description || 'No description provided.'}</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto shrink-0 border-t border-border/5 pt-3 sm:border-0 sm:pt-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-gray-400 font-mono sm:hidden">
                      {album.photos.length} Photos
                    </span>
                    <div className="flex items-center gap-3 ml-auto sm:ml-0">
                      <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                        {album.photos.length} Photos
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditAlbum(album);
                          setExpandedAlbumId(album.id);
                        }}
                        disabled={actionLoading}
                        className="p-2.5 rounded-lg border border-border/5 hover:border-accent hover:text-accent text-gray-400 transition-colors cursor-pointer"
                        title="Edit Album"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAlbum(album);
                        }}
                        disabled={actionLoading}
                        className="p-2.5 rounded-lg border border-border/5 hover:border-red-500 hover:text-red-400 text-gray-400 transition-colors cursor-pointer"
                        title="Delete Album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div 
                        className="text-gray-500 ml-1 cursor-pointer"
                        onClick={() => setExpandedAlbumId(isExpanded ? null : album.id)}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Photos - Album Details View */}
                {isExpanded && (
                  <div className="p-6 border-t border-border/5 bg-[#0a0a0c] flex flex-col gap-6">
                    {/* Inline Album Editor */}
                    {isEditing && (
                      <form onSubmit={handleUpdateAlbum} className="glass p-5 rounded-xl border border-accent/20 flex flex-col gap-4 bg-[#0e0e11] mb-2">
                        <div className="flex justify-between items-center border-b border-border/5 pb-2">
                          <h4 className="text-xs font-semibold text-accent uppercase tracking-widest">Edit Album Details</h4>
                          <button
                            type="button"
                            onClick={() => setEditingAlbumId(null)}
                            className="text-[10px] text-gray-400 hover:text-foreground uppercase tracking-wider"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase text-gray-500 font-semibold">Album Title *</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              required
                              className="px-3.5 py-2.5 bg-background border border-border/10 rounded-lg text-xs text-foreground focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase text-gray-500 font-semibold">Category *</label>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              required
                              className="px-3.5 py-2.5 bg-background border border-border/10 rounded-lg text-xs text-foreground focus:outline-none focus:border-accent"
                            >
                              {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase text-gray-500 font-semibold flex items-center gap-1">
                              <Upload className="w-3 h-3 text-accent" /> Upload Cover Image *
                            </label>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleCoverUpload}
                              className="px-3.5 py-2 bg-background border border-border/10 rounded-lg text-[10px] text-gray-400 file:bg-accent file:text-black file:border-0 file:rounded file:px-2 file:py-1 cursor-pointer w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase text-gray-500 font-semibold">Or Cover Image URL *</label>
                            <input
                              type="url"
                              value={editCoverUrl}
                              onChange={(e) => setEditCoverUrl(e.target.value)}
                              required
                              className="px-3.5 py-2.5 bg-background border border-border/10 rounded-lg text-xs text-foreground focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase text-gray-500 font-semibold">Description</label>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={2}
                            className="px-3.5 py-2.5 bg-background border border-border/10 rounded-lg text-xs text-foreground focus:outline-none focus:border-accent resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="self-end px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          Save Changes
                        </button>
                      </form>
                    )}

                    {/* Photo Add / Bulk Upload Forms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end bg-[#131317] p-5 rounded-xl border border-border/5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-accent" /> Upload New Photos (Bulk Supported)
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => handleBulkPhotoUpload(e, album.id, album.photos)}
                          disabled={actionLoading}
                          className="px-3.5 py-2 bg-background border border-border/10 rounded-lg text-gray-400 text-[10px] focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-accent file:text-black hover:file:bg-accent-hover cursor-pointer w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                          Or Add Photo by URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://..."
                            value={photoUrlInput[album.id] || ''}
                            onChange={(e) => handlePhotoUrlChange(album.id, e.target.value)}
                            className="px-3.5 py-2 bg-background border border-border/10 rounded-lg text-foreground text-xs focus:border-accent focus:outline-none w-full"
                          />
                          <button
                            onClick={() => handleAddPhoto(album.id)}
                            disabled={actionLoading || !photoUrlInput[album.id]?.trim()}
                            className="px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shrink-0"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Photos Grid with HTML5 Drag-and-Drop Reordering */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                        Album Photos ({album.photos.length}) <span className="text-[10px] text-gray-600 font-normal normal-case ml-2">(Drag & drop to reorder)</span>
                      </p>
                      {album.photos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                          {album.photos.map((photo, index) => (
                            <div 
                              key={photo.id} 
                              draggable={!actionLoading}
                              onDragStart={(e) => handleDragStart(e, album.id, index)}
                              onDragOver={handleDragOver}
                              onDragEnd={handleDragEnd}
                              onDrop={(e) => handleDrop(e, album.id, index)}
                              className="relative group rounded-lg overflow-hidden border border-border/5 h-28 cursor-grab active:cursor-grabbing hover:border-accent/30 transition-all bg-[#08080a]"
                            >
                              <Image
                                src={photo.image_url}
                                alt="Album item"
                                fill
                                className="object-cover pointer-events-none select-none"
                              />
                              
                              {/* Hover actions overlay */}
                              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-between p-2">
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-black/50 text-accent font-mono">
                                    #{photo.display_order || index + 1}
                                  </span>
                                  <Move className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleMovePhoto(album, index, 'up')}
                                    disabled={index === 0 || actionLoading}
                                    className="p-1.5 rounded bg-background/10 text-foreground hover:text-accent transition-colors disabled:opacity-30"
                                    title="Move Left"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleMovePhoto(album, index, 'down')}
                                    disabled={index === album.photos.length - 1 || actionLoading}
                                    className="p-1.5 rounded bg-background/10 text-foreground hover:text-accent transition-colors disabled:opacity-30"
                                    title="Move Right"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleSetCoverImage(album.id, photo.image_url)}
                                    disabled={actionLoading || album.cover_image === photo.image_url}
                                    className={`p-1.5 rounded bg-background/10 transition-colors ${
                                      album.cover_image === photo.image_url ? 'text-accent' : 'text-foreground hover:text-accent'
                                    }`}
                                    title="Set as Album Cover"
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between w-full">
                                  <a
                                    href={photo.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded bg-background/10 text-foreground hover:text-blue-400 transition-colors"
                                    title="Open Link"
                                  >
                                    <Link2 className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    onClick={() => handleDeletePhoto(photo)}
                                    disabled={actionLoading}
                                    className="p-1.5 rounded bg-background/10 text-foreground hover:text-red-400 transition-colors"
                                    title="Delete Photo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600 italic">No photos added yet. Upload files or paste a URL above.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-gray-500 font-serif font-light glass rounded-3xl border border-border/5 bg-[#0e0e11]">
            No portfolio albums created yet. Click "Create Album" above to start.
          </div>
        )}
      </div>
    </div>
  );
}
