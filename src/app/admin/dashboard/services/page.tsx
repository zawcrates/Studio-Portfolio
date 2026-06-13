'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Trash2, 
  Plus, 
  Edit, 
  XCircle, 
  CheckCircle2, 
  Upload, 
  Link2, 
  Check, 
  X,
  Briefcase,
  Sparkles,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Image from 'next/image';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  cover_image: string;
  features: string[];
  created_at?: string;
}

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states (Create Service)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLongDescription, setNewLongDescription] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [newFeatures, setNewFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  // Form states (Edit Service)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLongDescription, setEditLongDescription] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [editFeatureInput, setEditFeatureInput] = useState('');

  // Expanded details tracking
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setErrorMsg(err.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Helper to extract file name from storage URL
  const extractFilename = (url: string) => {
    try {
      const urlWithoutParams = url.split('?')[0];
      const segment = urlWithoutParams.split('/').pop();
      return segment ? decodeURIComponent(segment) : '';
    } catch {
      return '';
    }
  };

  // Slug generator
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string, isEdit: boolean) => {
    if (isEdit) {
      setEditTitle(val);
      setEditSlug(slugify(val));
    } else {
      setNewTitle(val);
      setNewSlug(slugify(val));
    }
  };

  // Feature list handlers (Create)
  const handleAddFeature = (e: React.MouseEvent) => {
    e.preventDefault();
    const cleanText = featureInput.trim();
    if (cleanText && !newFeatures.includes(cleanText)) {
      setNewFeatures([...newFeatures, cleanText]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setNewFeatures(newFeatures.filter((_, i) => i !== index));
  };

  const moveFeatureUp = (index: number) => {
    if (index === 0) return;
    const updated = [...newFeatures];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setNewFeatures(updated);
  };

  const moveFeatureDown = (index: number) => {
    if (index === newFeatures.length - 1) return;
    const updated = [...newFeatures];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setNewFeatures(updated);
  };

  // Feature list handlers (Edit)
  const handleAddEditFeature = (e: React.MouseEvent) => {
    e.preventDefault();
    const cleanText = editFeatureInput.trim();
    if (cleanText && !editFeatures.includes(cleanText)) {
      setEditFeatures([...editFeatures, cleanText]);
      setEditFeatureInput('');
    }
  };

  const handleRemoveEditFeature = (index: number) => {
    setEditFeatures(editFeatures.filter((_, i) => i !== index));
  };

  const moveEditFeatureUp = (index: number) => {
    if (index === 0) return;
    const updated = [...editFeatures];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setEditFeatures(updated);
  };

  const moveEditFeatureDown = (index: number) => {
    if (index === editFeatures.length - 1) return;
    const updated = [...editFeatures];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setEditFeatures(updated);
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'service-images');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (isEdit) {
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

  // Create Service Handler
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug || !newCoverUrl || !newDescription || !newLongDescription) {
      setErrorMsg('Please fill in all required fields and upload/paste a cover image.');
      return;
    }

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Slug Uniqueness Validation
    if (services.some(s => s.slug === newSlug)) {
      setErrorMsg(`The URL slug "${newSlug}" is already in use by another service package.`);
      setActionLoading(false);
      return;
    }

    const newRecord = {
      title: newTitle,
      slug: newSlug,
      description: newDescription,
      long_description: newLongDescription,
      cover_image: newCoverUrl,
      features: newFeatures,
    };

    try {
      const { data, error } = await supabase
        .from('services')
        .insert([newRecord])
        .select();

      if (error) throw error;

      setSuccessMsg('Service created successfully!');
      // Reset Create Form
      setNewTitle('');
      setNewSlug('');
      setNewDescription('');
      setNewLongDescription('');
      setNewCoverUrl('');
      setNewFeatures([]);
      setShowCreateForm(false);
      
      // Update local state
      if (data && data[0]) {
        setServices(prev => [...prev, data[0]]);
      } else {
        fetchServices();
      }
    } catch (err: any) {
      console.error('Error creating service:', err);
      setErrorMsg(err.message || 'Failed to create service.');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Mode Initializer
  const startEditing = (service: Service) => {
    setEditingServiceId(service.id);
    setEditTitle(service.title);
    setEditSlug(service.slug);
    setEditDescription(service.description);
    setEditLongDescription(service.long_description);
    setEditCoverUrl(service.cover_image);
    setEditFeatures(service.features || []);
    setShowCreateForm(false);
    setExpandedServiceId(service.id);
  };

  // Edit Submission Handler
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceId) return;

    if (!editTitle || !editSlug || !editCoverUrl || !editDescription || !editLongDescription) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Slug Uniqueness Validation
    if (services.some(s => s.slug === editSlug && s.id !== editingServiceId)) {
      setErrorMsg(`The URL slug "${editSlug}" is already in use by another service package.`);
      setActionLoading(false);
      return;
    }

    const oldService = services.find(s => s.id === editingServiceId);
    const coverChanged = oldService && oldService.cover_image !== editCoverUrl;

    const updatedFields = {
      title: editTitle,
      slug: editSlug,
      description: editDescription,
      long_description: editLongDescription,
      cover_image: editCoverUrl,
      features: editFeatures,
    };

    // Optimistically update the UI
    const previousServices = [...services];
    setServices(prev => prev.map(s => s.id === editingServiceId ? { ...s, ...updatedFields } : s));

    try {
      // 1. Update DB
      const { error } = await supabase
        .from('services')
        .update(updatedFields)
        .eq('id', editingServiceId);

      if (error) throw error;

      // 2. Clean up old image if cover was replaced and was in storage
      if (coverChanged && oldService.cover_image.includes('/storage/v1/object/public/service-images/')) {
        const oldFileName = extractFilename(oldService.cover_image);
        if (oldFileName) {
          console.info(`[Teardown] Deleting old cover image file: ${oldFileName}`);
          const deleteRes = await fetch(`/api/upload?bucket=service-images&filename=${encodeURIComponent(oldFileName)}`, {
            method: 'DELETE',
          });
          if (!deleteRes.ok) {
            const resData = await deleteRes.json().catch(() => null);
            console.warn(`Failed to clean up old cover image ${oldFileName}:`, resData?.error);
          }
        }
      }

      setSuccessMsg('Service updated successfully!');
      setEditingServiceId(null);
    } catch (err: any) {
      console.error('Error updating service:', err);
      setErrorMsg(err.message || 'Failed to update service.');
      setServices(previousServices);
      fetchServices();
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Service Handler
  const handleDeleteService = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete the service "${service.title}"? This will delete the cover image in storage and its database record.`)) return;

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Optimistic UI updates
    const previousServices = [...services];
    setServices(prev => prev.filter(s => s.id !== service.id));

    try {
      // 1. Delete cover image from service-images storage bucket
      let storageDeleted = false;
      let storageData = null;
      let storageError = null;

      if (service.cover_image.includes('/storage/v1/object/public/service-images/')) {
        const coverFileName = extractFilename(service.cover_image);
        if (coverFileName) {
          console.info(`[Cascading Delete] Deleting cover image file from storage: ${coverFileName}`);
          try {
            const deleteRes = await fetch(`/api/upload?bucket=service-images&filename=${encodeURIComponent(coverFileName)}`, {
              method: 'DELETE',
            });
            storageDeleted = deleteRes.ok;
            storageData = await deleteRes.json().catch(() => null);
            if (!deleteRes.ok) {
              storageError = storageData?.error || 'Delete request unsuccessful';
            }
          } catch (err: any) {
            storageError = err.message || err;
          }

          console.log('[Cascading Delete] Storage Deletion Result:', {
            filename: coverFileName,
            ok: storageDeleted,
            data: storageData,
            error: storageError
          });
        }
      } else {
        console.info('[Cascading Delete] Cover image is external, skipping storage deletion');
      }

      // 2. Delete database record
      console.info('[Cascading Delete] Deleting service database record');
      const dbResult = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      console.log('[Cascading Delete] Database Deletion Result:', {
        status: dbResult.status,
        statusText: dbResult.statusText,
        error: dbResult.error,
        data: dbResult.data
      });

      if (dbResult.error) {
        console.error('[Cascading Delete] Database Error: failed to delete service record:', dbResult.error);
        throw dbResult.error;
      }

      if (storageError) {
        setSuccessMsg(`Service deleted from database, but storage cleanup had issues: ${storageError}`);
      } else {
        setSuccessMsg('Service and all assets deleted successfully!');
      }
      if (expandedServiceId === service.id) setExpandedServiceId(null);
    } catch (err: any) {
      setServices(previousServices);
      console.error('[Cascading Delete] Error during service deletion:', err);
      setErrorMsg(err.message || 'Failed to delete service.');
      fetchServices();
    } finally {
      setActionLoading(false);
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
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-light">Services Management</h1>
          <p className="text-sm text-gray-500 mt-1.5 font-light">
            Create, edit, and delete photography and cinematography service packages.
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingServiceId(null);
          }}
          className="px-5 py-3 rounded-xl bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> {showCreateForm ? 'Cancel Form' : 'Create Service'}
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

      {/* Create Service Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateService} className="glass p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col gap-5 bg-[#0e0e11]">
          <h2 className="font-serif text-xl text-white font-light border-b border-white/5 pb-3">New Service Package</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="new-title" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Service Title *
              </label>
              <input
                id="new-title"
                type="text"
                placeholder="e.g. Luxury Wedding Photography"
                value={newTitle}
                onChange={(e) => handleTitleChange(e.target.value, false)}
                required
                className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="new-slug" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                URL Slug (Auto-generated) *
              </label>
              <input
                id="new-slug"
                type="text"
                placeholder="luxury-wedding-photography"
                value={newSlug}
                onChange={(e) => setNewSlug(slugify(e.target.value))}
                required
                className={`px-4 py-3 bg-background border rounded-xl text-white text-sm focus:outline-none transition-colors w-full font-mono ${
                  services.some(s => s.slug === newSlug) ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-gold'
                }`}
              />
              {newSlug && services.some(s => s.slug === newSlug) && (
                <p className="text-[10px] text-red-400 font-light mt-0.5">This URL Slug is already in use by another service package.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="new-desc" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Short Description *
            </label>
            <input
              id="new-desc"
              type="text"
              placeholder="A brief summary shown on index cards (1-2 sentences)..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
              className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="new-longdesc" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Long Description (Detailed Markdown/Paragraph) *
            </label>
            <textarea
              id="new-longdesc"
              rows={4}
              placeholder="Detailed description of the deliverables, art direction, lighting structure, cameras used..."
              value={newLongDescription}
              onChange={(e) => setNewLongDescription(e.target.value)}
              required
              className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors resize-none w-full"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-gold" /> Upload Cover Image *
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(e, false)}
                disabled={actionLoading}
                className="px-4 py-3 bg-background border border-white/10 rounded-xl text-gray-400 text-xs focus:outline-none file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-hover cursor-pointer w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="new-cover" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Or Paste Image URL *
              </label>
              <div className="relative flex items-center">
                <input
                  id="new-cover"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newCoverUrl}
                  onChange={(e) => setNewCoverUrl(e.target.value)}
                  required
                  className="px-4 py-3 pr-10 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors w-full"
                />
                <Link2 className="w-4 h-4 text-gray-500 absolute right-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Preview uploaded image */}
          {newCoverUrl && (
            <div className="relative w-full h-40 sm:h-52 rounded-xl overflow-hidden border border-white/10">
              <Image src={newCoverUrl} alt="Cover Preview" fill className="object-cover" />
            </div>
          )}

          {/* Features array builder */}
          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Package Deliverables / Features
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 10 hours of active coverage"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature(e as any))}
                className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors flex-grow"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-3 bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase rounded-xl transition-all"
              >
                Add
              </button>
            </div>
            {newFeatures.length > 0 ? (
              <ul className="flex flex-col gap-2 mt-1 max-w-xl">
                {newFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs">
                    <span className="truncate">{feat}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        type="button" 
                        onClick={() => moveFeatureUp(idx)} 
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => moveFeatureDown(idx)} 
                        disabled={idx === newFeatures.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFeature(idx)} 
                        className="p-1 text-red-400 hover:text-red-300 ml-1 border-l border-white/10 pl-2 transition-colors"
                        title="Remove deliverable"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] text-gray-500 font-light italic">No deliverables added yet. Use the field above to add.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={actionLoading || !newCoverUrl}
            className="self-end px-8 py-3 rounded-xl bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase tracking-widest transition-colors duration-300 disabled:opacity-50"
          >
            Create Service
          </button>
        </form>
      )}

      {/* Edit Service Form */}
      {editingServiceId && (
        <form onSubmit={handleUpdateService} className="glass p-6 sm:p-8 rounded-2xl border border-gold/30 flex flex-col gap-5 bg-[#0e0e11] relative">
          <button 
            type="button" 
            onClick={() => setEditingServiceId(null)} 
            className="absolute top-6 right-6 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-serif text-xl text-gold font-light border-b border-white/5 pb-3">Edit Service</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="edit-title" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Service Title *
              </label>
              <input
                id="edit-title"
                type="text"
                value={editTitle}
                onChange={(e) => handleTitleChange(e.target.value, true)}
                required
                className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="edit-slug" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                URL Slug *
              </label>
              <input
                id="edit-slug"
                type="text"
                value={editSlug}
                onChange={(e) => setEditSlug(slugify(e.target.value))}
                required
                className={`px-4 py-3 bg-background border rounded-xl text-white text-sm focus:outline-none transition-colors w-full font-mono ${
                  services.some(s => s.slug === editSlug && s.id !== editingServiceId) ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-gold'
                }`}
              />
              {editSlug && services.some(s => s.slug === editSlug && s.id !== editingServiceId) && (
                <p className="text-[10px] text-red-400 font-light mt-0.5">This URL Slug is already in use by another service package.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="edit-desc" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Short Description *
            </label>
            <input
              id="edit-desc"
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="edit-longdesc" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Long Description *
            </label>
            <textarea
              id="edit-longdesc"
              rows={4}
              value={editLongDescription}
              onChange={(e) => setEditLongDescription(e.target.value)}
              required
              className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors resize-none w-full"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-gold" /> Upload New Cover Image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(e, true)}
                disabled={actionLoading}
                className="px-4 py-3 bg-background border border-white/10 rounded-xl text-gray-400 text-xs focus:outline-none file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-hover cursor-pointer w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="edit-cover" className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Or Paste Image URL *
              </label>
              <div className="relative flex items-center">
                <input
                  id="edit-cover"
                  type="url"
                  value={editCoverUrl}
                  onChange={(e) => setEditCoverUrl(e.target.value)}
                  required
                  className="px-4 py-3 pr-10 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors w-full"
                />
                <Link2 className="w-4 h-4 text-gray-500 absolute right-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Preview updated image */}
          {editCoverUrl && (
            <div className="relative w-full h-40 sm:h-52 rounded-xl overflow-hidden border border-white/10">
              <Image src={editCoverUrl} alt="Cover Preview" fill className="object-cover" />
            </div>
          )}

          {/* Features array builder (Edit) */}
          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Package Deliverables / Features
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 10 hours of active coverage"
                value={editFeatureInput}
                onChange={(e) => setEditFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEditFeature(e as any))}
                className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white text-sm focus:border-gold focus:outline-none transition-colors flex-grow"
              />
              <button
                type="button"
                onClick={handleAddEditFeature}
                className="px-4 py-3 bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase rounded-xl transition-all"
              >
                Add
              </button>
            </div>
            {editFeatures.length > 0 ? (
              <ul className="flex flex-col gap-2 mt-1 max-w-xl">
                {editFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs">
                    <span className="truncate">{feat}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        type="button" 
                        onClick={() => moveEditFeatureUp(idx)} 
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => moveEditFeatureDown(idx)} 
                        disabled={idx === editFeatures.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveEditFeature(idx)} 
                        className="p-1 text-red-400 hover:text-red-300 ml-1 border-l border-white/10 pl-2 transition-colors"
                        title="Remove deliverable"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] text-gray-500 font-light italic">No deliverables added yet.</p>
            )}
          </div>

          <div className="flex gap-3 self-end">
            <button
              type="button"
              onClick={() => setEditingServiceId(null)}
              className="px-6 py-3 rounded-xl border border-white/10 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading || !editCoverUrl}
              className="px-8 py-3 rounded-xl bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase tracking-widest transition-colors duration-300 disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Services List / Accordion */}
      <div className="flex flex-col gap-6">
        {services.length > 0 ? (
          services.map((service) => {
            const isExpanded = expandedServiceId === service.id;
            const isEditing = editingServiceId === service.id;

            return (
              <div 
                key={service.id} 
                className={`glass rounded-2xl border transition-colors duration-300 overflow-hidden flex flex-col bg-[#0e0e11] ${
                  isEditing ? 'border-gold/30' : 'border-white/5'
                }`}
              >
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                  className="p-6 flex items-center justify-between gap-6 cursor-pointer hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src={service.cover_image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg text-white font-light truncate">{service.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                        <span className="text-xs text-gold font-mono tracking-wide">/{service.slug}</span>
                        <span className="text-[10px] text-gray-500 font-light">
                          Created: {service.created_at ? new Date(service.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startEditing(service)}
                      className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors"
                      title="Edit Service"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service)}
                      className="p-2.5 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-gray-500 ml-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Accordion Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 flex flex-col gap-6 bg-white/[0.005]">
                    {/* Short Description */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-1">
                        <AlignLeft className="w-3 h-3" /> Short Description
                      </span>
                      <p className="text-sm text-gray-300 font-light leading-relaxed">{service.description}</p>
                    </div>

                    {/* Detailed Long Description */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-1">
                        <AlignLeft className="w-3 h-3" /> Detailed Long Description
                      </span>
                      <p className="text-sm text-gray-400 font-light leading-relaxed whitespace-pre-wrap">{service.long_description}</p>
                    </div>

                    {/* Deliverables Features */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-gold" /> Included Deliverables
                      </span>
                      {service.features && service.features.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400 font-light">
                          {service.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[10px] text-gray-500 italic font-light">No deliverables configured.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass rounded-2xl border border-white/5 p-12 text-center flex flex-col items-center justify-center gap-4 bg-[#0e0e11]">
            <div className="w-12 h-12 rounded-full bg-white/[0.02] flex items-center justify-center text-gray-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">No Services Found</p>
              <p className="text-xs text-gray-600 font-light mt-1">Create a service to display it on the public-facing pages.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
