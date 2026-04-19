import React, { useState, useRef } from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';
import { X, Upload, FileCheck, Loader2, AlertCircle, Bookmark } from 'lucide-react';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { normalizeUrl } from '../utils/url';

export default function ImportModal({ isOpen, onClose, user, existingBookmarks = [] }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/html') {
      setFile(selectedFile);
      setError(null);
      setStats(null);
    } else {
      setError('Please select a valid Chrome bookmarks HTML file.');
      setFile(null);
    }
  };

  const parseBookmarks = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const bookmarks = [];

    // Helper to traverse and extract folders as tags
    const traverse = (element, currentTags = []) => {
      const children = element.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        
        if (child.tagName === 'DT') {
          const h3 = child.querySelector(':scope > h3');
          const a = child.querySelector(':scope > a');
          const dl = child.querySelector(':scope > dl');

          if (a) {
            const url = a.getAttribute('href');
            const title = a.textContent.trim();
            if (url && url.startsWith('http')) {
              bookmarks.push({
                url,
                title,
                tags: [...currentTags],
                createdAt: serverTimestamp()
              });
            }
          }

          if (h3 && dl) {
            const folderName = h3.textContent.trim().toLowerCase();
            // Avoid adding top-level generic folders as tags if desired, 
            // but for now we'll include them.
            traverse(dl, [...currentTags, folderName]);
          }
        } else if (child.tagName === 'DL') {
          traverse(child, currentTags);
        }
      }
    };

    const rootDL = doc.querySelector('dl');
    if (rootDL) {
      traverse(rootDL);
    } else {
      // Fallback: just get all links if structure is weird
      const allLinks = doc.querySelectorAll('a');
      allLinks.forEach(a => {
        const url = a.getAttribute('href');
        if (url && url.startsWith('http')) {
          bookmarks.push({
            url,
            title: a.textContent.trim(),
            tags: [],
            createdAt: serverTimestamp()
          });
        }
      });
    }

    return bookmarks;
  };

  const handleImport = async () => {
    if (!file || !user) return;

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const content = await file.text();
      const allParsed = parseBookmarks(content);

      if (allParsed.length === 0) {
        throw new Error('No bookmarks found in the selected file.');
      }

      // Filter out duplicates
      const existingUrls = new Set(existingBookmarks.map(b => normalizeUrl(b.url)));
      const bookmarks = allParsed.filter(b => !existingUrls.has(normalizeUrl(b.url)));
      const duplicateCount = allParsed.length - bookmarks.length;

      if (bookmarks.length === 0 && duplicateCount > 0) {
        setStats({ total: allParsed.length, imported: 0, skipped: duplicateCount });
        setLoading(false);
        return;
      }

      setStats({ total: allParsed.length, imported: 0, skipped: duplicateCount });

      // Batch write to Firestore (max 500 per batch)
      const batchSize = 50; // Small batch size for better UI feedback
      let count = 0;

      for (let i = 0; i < bookmarks.length; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = bookmarks.slice(i, i + batchSize);

        chunk.forEach(bookmark => {
          const newDocRef = doc(collection(db, 'users', user.uid, 'bookmarks'));
          batch.set(newDocRef, {
            ...bookmark,
            description: null,
            favicon: null
          });
        });

        await batch.commit();
        count += chunk.length;
        setProgress(Math.round((count / bookmarks.length) * 100));
        setStats(prev => ({ ...prev, imported: count }));
      }

      setLoading(false);
      // Wait a bit to show 100% then close? 
      // Or just show success state.
      setTimeout(() => {
        onClose();
        setFile(null);
        setProgress(0);
        setStats(null);
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to import bookmarks.');
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered className="premium-modal">
      <Modal.Header className="modal-header d-flex justify-content-between align-items-center px-4 py-3">
        <Modal.Title className="h4 mb-0 text-white fw-bold d-flex align-items-center gap-2">
          <Upload size={24} className="text-primary" />
          Import from Chrome
        </Modal.Title>
        <button onClick={onClose} className="btn btn-premium-ghost p-1.5 border-0" disabled={loading}>
          <X size={24} />
        </button>
      </Modal.Header>
      <Modal.Body className="px-4 py-5 text-center">
        {!file && (
          <div 
            onClick={() => fileInputRef.current.click()}
            className="border-dashed border-2 border-primary border-opacity-25 rounded-4 p-5 cursor-pointer hover-bg-primary hover-bg-opacity-5 transition-all mb-4"
          >
            <div className="bg-primary bg-opacity-10 d-inline-flex p-4 rounded-circle mb-3">
              <Upload className="text-primary" size={32} />
            </div>
            <h5 className="text-white fw-bold mb-2">Select Bookmarks File</h5>
            <p className="text-muted small mb-0">Choose the bookmarks.html file exported from Chrome</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".html" 
              className="d-none" 
            />
          </div>
        )}

        {file && !loading && !stats && (
          <div className="glass p-4 rounded-4 text-start mb-4 d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-10 p-3 rounded-3">
              <FileCheck className="text-success" size={24} />
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="text-white fw-medium text-truncate">{file.name}</div>
              <div className="text-muted small">{(file.size / 1024).toFixed(2)} KB • Ready to import</div>
            </div>
            <button 
              onClick={() => setFile(null)} 
              className="btn btn-link text-muted p-0"
              title="Remove file"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {loading && (
          <div className="py-4">
            <div className="mb-4 position-relative d-inline-block">
               <Loader2 className="text-primary animate-spin" size={48} />
               <div className="position-absolute top-50 start-50 translate-middle text-primary fw-bold small">
                 {progress}%
               </div>
            </div>
            <h5 className="text-white fw-bold mb-2">Importing your bookmarks...</h5>
            <p className="text-muted mb-4">This may take a moment depending on the number of links.</p>
            <ProgressBar now={progress} className="premium-progress mb-3" />
            {stats && (
              <div className="text-muted small">
                Imported {stats.imported} of {stats.total - stats.skipped} new bookmarks
                {stats.skipped > 0 && ` (${stats.skipped} duplicates skipped)`}
              </div>
            )}
          </div>
        )}

        {stats && !loading && (
          <div className="py-4 animate-fade-in">
            <div className={`bg-${stats.imported > 0 ? 'success' : 'info'} bg-opacity-10 d-inline-flex p-4 rounded-circle mb-3`}>
              <Bookmark className={`text-${stats.imported > 0 ? 'success' : 'info'}`} size={32} />
            </div>
            <h5 className="text-white fw-bold mb-2">Import Complete</h5>
            <div className="text-muted mb-0">
              {stats.imported > 0 ? (
                <>Successfully imported {stats.imported} bookmarks.</>
              ) : (
                <>No new bookmarks to import.</>
              )}
              {stats.skipped > 0 && (
                <div className="small mt-1 text-info opacity-75">
                  {stats.skipped} duplicates were identified and skipped.
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger d-flex align-items-center gap-2 mb-4 text-start">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {file && !loading && !stats && (
          <button 
            onClick={handleImport}
            className="btn btn-premium w-100 py-3 mt-2 shadow-lg"
          >
            Start Import
          </button>
        )}
      </Modal.Body>
    </Modal>
  );
}
