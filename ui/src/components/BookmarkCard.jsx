import React from 'react';
import { ExternalLink, Tag, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookmarkCard({ bookmark, onDelete }) {
  const { title, url, description, favicon, tags, metadataScrapedAt } = bookmark;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="glass rounded-xl overflow-hidden flex flex-col group h-full"
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
            {favicon ? (
              <img src={favicon} alt="" className="w-6 h-6 object-contain" onError={(e) => e.target.style.display='none'} />
            ) : (
              <ExternalLink size={20} className="text-text-muted" />
            )}
          </div>
          <button 
            onClick={() => onDelete(bookmark.id)}
            className="text-text-muted hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-white group-hover:text-primary transition-colors">
          {title || url}
        </h3>
        
        {description && (
          <p className="text-text-muted text-sm line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags?.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-surface border border-border text-text-muted flex items-center gap-1">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 bg-surface/50 border-t border-border flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Clock size={12} />
          <span>{metadataScrapedAt ? new Date(metadataScrapedAt).toLocaleDateString() : 'Scraping...'}</span>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          Visit <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
}
