import React from 'react';
import { LogIn, LogOut, Bookmark, User } from 'lucide-react';

export default function Navbar({ user, onLogin, onLogout }) {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Bookmark className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">LynxLocker</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-border">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full" />
                ) : (
                  <User size={16} />
                )}
                <span className="text-sm font-medium hidden sm:inline">{user.displayName}</span>
              </div>
              <button onClick={onLogout} className="btn btn-ghost text-sm">
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button onClick={onLogin} className="btn btn-primary text-sm">
              <LogIn size={18} />
              Login with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
