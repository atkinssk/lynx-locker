import React, { useState } from 'react';
import { Modal, Tab, Nav } from 'react-bootstrap';
import { X, MousePointer2, Search, Copy, Check, ExternalLink } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  const [copiedType, setCopiedType] = useState(null);

  const bookmarkletCode = `javascript:(function(){window.open('${window.location.origin}/?url='+encodeURIComponent(window.location.href)+'&tags=auto-save');})();`;
  const searchEngineUrl = `${window.location.origin}/?url=%s`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg" className="premium-modal">
      <Modal.Header className="modal-header d-flex justify-content-between align-items-center px-4 py-3">
        <div>
          <Modal.Title className="h4 mb-0 text-white fw-bold">Browser Shortcuts</Modal.Title>
          <p className="text-muted small mb-0 mt-1">Add bookmarks to LynxLocker instantly from any page</p>
        </div>
        <button onClick={onClose} className="btn btn-premium-ghost p-1.5 border-0">
          <X size={24} />
        </button>
      </Modal.Header>
      <Modal.Body className="px-0 py-0 overflow-hidden">
        <Tab.Container defaultActiveKey="bookmarklet">
          <div className="bg-dark border-bottom border-secondary border-opacity-25 px-4 pt-2">
            <Nav variant="tabs" className="border-0 gap-4">
              <Nav.Item>
                <Nav.Link eventKey="bookmarklet" className="premium-tab-link pb-3">
                  <MousePointer2 size={16} className="me-2" /> Bookmarklet
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="search" className="premium-tab-link pb-3">
                  <Search size={16} className="me-2" /> Search Engine
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content className="p-4 bg-bg">
            <Tab.Pane eventKey="bookmarklet" className="animate-fade-in">
              <div className="mb-4">
                <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                  <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', fontSize: '12px'}}>1</span>
                  Create a new bookmark
                </h6>
                <p className="text-muted small mb-3">
                  Right-click your browser's Bookmarks Bar and select <strong>Add Page...</strong>
                </p>
                
                <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                  <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', fontSize: '12px'}}>2</span>
                  Set Name and URL
                </h6>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="text-muted small fw-bold text-uppercase tracking-wider mb-2 d-block">Name</label>
                    <div className="glass p-2 px-3 rounded text-white-50 border border-secondary border-opacity-25">Add to Lynx</div>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small fw-bold text-uppercase tracking-wider mb-2 d-flex justify-content-between">
                      <span>URL (JavaScript Code)</span>
                      {copiedType === 'bookmarklet' && <span className="text-success animate-fade-in">Copied!</span>}
                    </label>
                    <div className="position-relative">
                      <pre className="glass p-3 rounded text-primary small overflow-auto text-nowrap border border-secondary border-opacity-25" style={{maxHeight: '100px'}}>
                        {bookmarkletCode}
                      </pre>
                      <button 
                        onClick={() => handleCopy(bookmarkletCode, 'bookmarklet')}
                        className="btn btn-premium-ghost position-absolute top-0 end-0 m-2 p-1.5"
                      >
                        {copiedType === 'bookmarklet' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-3 rounded-4 border-primary border-opacity-10 bg-primary bg-opacity-5">
                  <p className="text-muted small mb-0 d-flex gap-2">
                    <ExternalLink size={14} className="flex-shrink-0 mt-1" />
                    <span>Now just click this bookmark on any website to instantly open the LynxLocker save dialog for that page.</span>
                  </p>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="search" className="animate-fade-in">
              <div className="mb-4">
                <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                  <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', fontSize: '12px'}}>1</span>
                  Open Search Settings
                </h6>
                <p className="text-muted small mb-3">
                  Go to <strong>Settings</strong> → <strong>Search engine</strong> → <strong>Manage search engines</strong> in Chrome.
                </p>

                <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                  <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', fontSize: '12px'}}>2</span>
                  Add Site Search
                </h6>
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="text-muted small fw-bold text-uppercase tracking-wider mb-2 d-block">Search Engine</label>
                    <div className="glass p-2 px-3 rounded text-white-50 border border-secondary border-opacity-25">LynxLocker</div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small fw-bold text-uppercase tracking-wider mb-2 d-block">Shortcut</label>
                    <div className="glass p-2 px-3 rounded text-white-50 border border-secondary border-opacity-25">ll</div>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small fw-bold text-uppercase tracking-wider mb-2 d-flex justify-content-between">
                      <span>URL with %s</span>
                      {copiedType === 'search' && <span className="text-success animate-fade-in">Copied!</span>}
                    </label>
                    <div className="position-relative">
                      <div className="glass p-3 rounded text-primary small overflow-hidden text-truncate border border-secondary border-opacity-25 pe-5">
                        {searchEngineUrl}
                      </div>
                      <button 
                        onClick={() => handleCopy(searchEngineUrl, 'search')}
                        className="btn btn-premium-ghost position-absolute top-0 end-0 m-2 p-1.5"
                      >
                        {copiedType === 'search' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass p-3 rounded-4 border-primary border-opacity-10 bg-primary bg-opacity-5">
                  <p className="text-muted small mb-0 d-flex gap-2">
                    <ExternalLink size={14} className="flex-shrink-0 mt-1" />
                    <span>To use: Type <strong>ll</strong> and <strong>Space</strong> in your address bar, paste a URL, and hit Enter.</span>
                  </p>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}
