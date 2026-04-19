import React from 'react';
import { ExternalLink, Tag, Clock, Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookmarkCard({ bookmark, onDelete, onEdit }) {
  const { title, url, description, favicon, tags, metadataScrapedAt } = bookmark;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="h-100"
    >
      <div className="card premium-card h-100">
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="bg-dark rounded-3 d-flex align-items-center justify-center p-2 border border-secondary shadow-sm" style={{width: '42px', height: '42px', overflow: 'hidden'}}>
              {favicon ? (
                <img src={favicon} alt="" className="img-fluid object-contain" onError={(e) => e.target.style.display='none'} />
              ) : (
                <ExternalLink size={20} className="text-primary" />
              )}
            </div>
            <div className="d-flex gap-1">
              <button 
                onClick={() => onEdit(bookmark)}
                className="btn btn-sm btn-outline-primary border-0 opacity-50 hover-opacity-100 transition-opacity p-1.5 rounded-3"
              >
                <Pencil size={18} />
              </button>
              <button 
                onClick={() => onDelete(bookmark.id)}
                className="btn btn-sm btn-outline-danger border-0 opacity-50 hover-opacity-100 transition-opacity p-1.5 rounded-3"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <h5 className="card-title text-white fw-bold mb-2 text-truncate" title={title || url}>
            {title || url}
          </h5>
          
          {description && (
            <p className="card-text text-muted small mb-4 flex-grow-1" style={{display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
              {description}
            </p>
          )}

          <div className="d-flex flex-wrap gap-2 mb-4">
            {tags?.map(tag => (
              <span key={tag} className="badge bg-dark border border-secondary text-muted text-uppercase fw-bold p-2 d-flex align-items-center gap-1" style={{fontSize: '10px', letterSpacing: '0.5px'}}>
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="card-footer bg-transparent border-top border-secondary py-3 px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 text-muted small">
            <Clock size={12} />
            <span>{metadataScrapedAt ? new Date(metadataScrapedAt).toLocaleDateString() : 'Scraping...'}</span>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary text-decoration-none small fw-bold d-flex align-items-center gap-1 hover-light transition-colors"
          >
            Visit <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
