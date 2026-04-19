import React, { useState } from 'react';
import { X, Link as LinkIcon, Plus, Tag as TagIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddBookmarkModal({ isOpen, onClose, onAdd }) {
  const [url, setUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    // Logic for cleaning tags: split by comma, trim, lowercase, unique
    const tags = tagInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t !== '');
    
    const uniqueTags = [...new Set(tags)];

    await onAdd({ url, tags: uniqueTags });
    setLoading(false);
    setUrl('');
    setTagInput('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add Bookmark</h2>
                <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5 flex items-center gap-2">
                    <LinkIcon size={14} /> URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5 flex items-center gap-2">
                    <TagIcon size={14} /> Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="react, design, research"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {tagInput.split(',').map(t => t.trim()).filter(t => t).map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-full mt-4 h-12"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus size={20} />
                      Save Bookmark
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
