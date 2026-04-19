import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { X, Link as LinkIcon, Plus, Tag as TagIcon, AlertTriangle } from 'lucide-react';
import { isDuplicateUrl } from '../utils/url';

export default function AddBookmarkModal({ isOpen, onClose, onAdd, bookmarks = [], initialUrl = '', initialTags = '' }) {
  const [url, setUrl] = useState(initialUrl);
  const [tagInput, setTagInput] = useState(initialTags);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl || '');
      setTagInput(initialTags || '');
      setError('');
    }
  }, [isOpen, initialUrl, initialTags]);

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    if (error) setError('');
  };


  const handleSubmit = async (e) => {
    if (!url) return;

    if (isDuplicateUrl(url, bookmarks)) {
      setError('This URL is already in your bookmarks.');
      return;
    }

    setLoading(true);
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
    <Modal show={isOpen} onHide={onClose} centered className="premium-modal">
      <Modal.Header className="modal-header d-flex justify-content-between align-items-center px-4 py-3">
        <Modal.Title className="h4 mb-0 text-white fw-bold">Add Bookmark</Modal.Title>
        <button onClick={onClose} className="btn btn-premium-ghost p-1.5 border-0">
          <X size={24} />
        </button>
      </Modal.Header>
      <Modal.Body className="px-4 py-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="text-muted small fw-bold text-uppercase tracking-wider mb-2 d-flex align-items-center gap-2">
              <LinkIcon size={14} /> URL
            </Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className={`premium-input ${error ? 'border-danger' : ''}`}
              required
              autoFocus
            />
            {error && (
              <div className="text-danger small mt-2 d-flex align-items-center gap-1 animate-fade-in">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-muted small fw-bold text-uppercase tracking-wider mb-2 d-flex align-items-center gap-2">
              <TagIcon size={14} /> Tags (comma separated)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="react, design, research"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="premium-input"
            />
          </Form.Group>

          {tagInput.trim() && (
            <div className="d-flex flex-wrap gap-2 mb-4">
              {tagInput.split(',').map(t => t.trim()).filter(t => t).map(tag => (
                <span key={tag} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 small text-uppercase fw-bold">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-premium w-100 py-3 mt-2 shadow-lg"
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm text-light" role="status" />
            ) : (
              <>
                <Plus size={20} />
                <span>Save Bookmark</span>
              </>
            )}
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
