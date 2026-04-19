import React, { useState, useEffect, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import Navbar from './components/Navbar';
import BookmarkCard from './components/BookmarkCard';
import AddBookmarkModal from './components/AddBookmarkModal';
import ImportModal from './components/ImportModal';
import ShortcutsModal from './components/ShortcutsModal';
import { Search, Plus, LayoutGrid, Loader2, Bookmark, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [initialUrl, setInitialUrl] = useState('');
  const [initialTags, setInitialTags] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    
    // Check for query parameters for shortcuts
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    const tagsParam = params.get('tags');
    
    if (urlParam) {
      setInitialUrl(urlParam);
      if (tagsParam) setInitialTags(tagsParam);
      setIsModalOpen(true);
      
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, "/");
    }

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'bookmarks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeStore = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookmarks(docs);
    });

    return () => unsubscribeStore();
  }, [user]);

  const filteredBookmarks = useMemo(() => {
    if (!searchTerm.trim()) return bookmarks;
    const term = searchTerm.toLowerCase();
    return bookmarks.filter(b => 
      (b.title?.toLowerCase().includes(term)) || 
      (b.url?.toLowerCase().includes(term)) || 
      (b.description?.toLowerCase().includes(term)) ||
      (b.tags?.some(tag => tag.toLowerCase().includes(term)))
    );
  }, [bookmarks, searchTerm]);

  const handleLogin = () => signInWithPopup(auth, googleProvider);
  const handleLogout = () => signOut(auth);

  const handleAddBookmark = async ({ url, tags }) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'bookmarks'), {
        url,
        tags,
        createdAt: serverTimestamp(),
        title: null,
        description: null,
        favicon: null
      });
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const handleDeleteBookmark = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'bookmarks', id));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-bg">
        <Loader2 className="text-primary animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-bg pb-5">
      <Navbar 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        onShowShortcuts={() => setIsShortcutsModalOpen(true)}
        onImport={() => setIsImportModalOpen(true)}
        onAdd={() => setIsModalOpen(true)}
      />

      <main className="container-xl px-4">
        {user ? (
          <div className="animate-fade-in">
            <div className="row g-4 align-items-center mb-5">
              <div className="col-12 col-md-8 col-lg-6 mx-auto">
                <div className="position-relative">
                  <Search className="position-absolute translate-middle-y text-muted" style={{left: '1rem', top: '50%'}} size={20} />
                  <input 
                    type="text" 
                    placeholder="Search your bookmarks..." 
                    className="form-control premium-input shadow-sm"
                    style={{paddingLeft: '3rem'}}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {filteredBookmarks.length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
                <AnimatePresence mode="popLayout">
                  {filteredBookmarks.map(bookmark => (
                    <div key={bookmark.id} className="col">
                      <BookmarkCard 
                        bookmark={bookmark} 
                        onDelete={handleDeleteBookmark} 
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-5 glass rounded-pill-custom border-dashed border-2">
                <div className="bg-dark d-inline-flex p-4 rounded-4 mb-4 border border-secondary shadow-lg">
                  <LayoutGrid className="text-muted" size={48} />
                </div>
                <h3 className="h2 fw-bold mb-3 text-white">No bookmarks found</h3>
                <p className="text-muted lead">
                  {searchTerm ? "Try a different search term" : "Ready to start? Click 'Add Bookmark' to save your first link."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-5 text-center animate-fade-in d-flex flex-column align-items-center">
            <div className="mb-5 position-relative">
              <div className="position-absolute top-50 start-50 translate-middle bg-primary opacity-25" style={{width: '200px', height: '200px', filter: 'blur(80px)', borderRadius: '100%'}} />
              <div className="glass p-5 rounded-circle border-primary border-opacity-25 shadow-2xl position-relative">
                <Bookmark className="text-primary" size={80} />
              </div>
            </div>
            <h1 className="display-3 fw-bold tracking-tight mb-4 text-white">
              Organize your links,<br/><span className="text-primary">perfectly.</span>
            </h1>
            <p className="lead text-muted max-w-2xl mx-auto mb-5 px-4" style={{maxWidth: '700px'}}>
              LynxLocker automatically fetches metadata, favicons, and organizes your bookmarks with powerful tagging and instant search.
            </p>
            <button onClick={handleLogin} className="btn btn-premium btn-lg px-5 py-3 shadow-2xl">
              Get Started for Free
            </button>
            
            <div className="row g-4 mt-5 pt-5 w-100 justify-content-center" style={{maxWidth: '1100px'}}>
              {[
                { title: 'Auto Metadata', desc: 'Saves time by automatically pulling titles and descriptions.' },
                { title: 'Lucid Search', desc: 'Instant client-side filtering for zero-latency retrieval.' },
                { title: 'Tagging System', desc: 'Simple but powerful tagging for deep organization.' }
              ].map(feature => (
                <div key={feature.title} className="col-12 col-md-4">
                  <div className="glass p-4 rounded-4 h-100 text-start border-opacity-10 hover-border-primary transition-all">
                    <h5 className="fw-bold mb-3 text-white">{feature.title}</h5>
                    <p className="text-muted small mb-0">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AddBookmarkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddBookmark} 
        bookmarks={bookmarks}
        initialUrl={initialUrl}
        initialTags={initialTags}
      />

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        user={user}
        existingBookmarks={bookmarks}
      />

      <ShortcutsModal 
        isOpen={isShortcutsModalOpen} 
        onClose={() => setIsShortcutsModalOpen(false)} 
      />
    </div>
  );
}

export default App;
