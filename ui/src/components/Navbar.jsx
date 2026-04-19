import React from 'react';
import { LogIn, LogOut, Bookmark, User, MousePointer2, Plus, Upload } from 'lucide-react';

export default function Navbar({ user, onLogin, onLogout, onShowShortcuts, onImport, onAdd }) {
  return (
    <nav className="navbar navbar-expand-lg glass sticky-top px-3 py-2 mb-5">
      <div className="container-xl d-flex justify-content-between align-items-center">
        <div className="navbar-brand d-flex align-items-center gap-2">
          <div className="bg-primary p-2 rounded-3 shadow-lg">
            <Bookmark className="text-white" size={24} />
          </div>
          <span className="h4 mb-0 text-white tracking-tight">LynxLocker</span>
        </div>

        <div className="d-flex align-items-center gap-3">
          {user ? (
            <div className="d-flex align-items-center gap-2 gap-md-3">
              <button 
                onClick={onImport} 
                className="btn btn-premium-ghost d-flex align-items-center gap-2 px-3 py-2"
                title="Import Bookmarks"
              >
                <Upload size={18} />
                <span className="d-none d-lg-inline text-sm">Import</span>
              </button>

              <button 
                onClick={onAdd} 
                className="btn btn-premium d-flex align-items-center gap-2 px-3 py-2"
              >
                <Plus size={18} />
                <span className="d-none d-md-inline text-sm">Add Bookmark</span>
              </button>

              <div className="vr mx-1 opacity-25 d-none d-md-block" style={{height: '24px'}}></div>

              <button 
                onClick={onShowShortcuts} 
                className="btn btn-premium-ghost d-flex align-items-center gap-2 px-3 py-2"
                title="Browser Shortcuts"
              >
                <MousePointer2 size={18} />
                <span className="d-none d-md-inline text-sm">Shortcuts</span>
              </button>
              
              <div className="d-flex align-items-center gap-2 bg-dark px-3 py-1.5 rounded-pill border border-secondary shadow-sm ms-md-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="rounded-circle" style={{width: '24px', height: '24px'}} />
                ) : (
                  <User size={16} className="text-primary" />
                )}
                <span className="text-sm fw-medium d-none d-xl-inline text-light">{user.displayName}</span>
              </div>
              
              <button onClick={onLogout} className="btn btn-premium-ghost d-flex align-items-center gap-2 px-3 py-2">
                <LogOut size={18} />
                <span className="d-none d-sm-inline text-sm">Logout</span>
              </button>
            </div>

          ) : (
            <button onClick={onLogin} className="btn btn-premium shadow-lg">
              <LogIn size={18} />
              <span>Login with Google</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
