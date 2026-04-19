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
import { Search, Plus, Filter, LayoutGrid, Loader2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="text-primary animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6">
        {user ? (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by title, tag, or URL..." 
                  className="pl-12 h-12 bg-surface/50 border-border focus:border-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex-1 md:flex-none h-12 px-6">
                  <Plus size={20} />
                  Add Bookmark
                </button>
              </div>
            </div>

            {filteredBookmarks.length > 0 ? (
              <motion.div 
                layout 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredBookmarks.map(bookmark => (
                    <BookmarkCard 
                      key={bookmark.id} 
                      bookmark={bookmark} 
                      onDelete={handleDeleteBookmark} 
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20 glass rounded-3xl border-dashed border-2">
                <div className="bg-surface w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                  <LayoutGrid className="text-text-muted" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">No bookmarks found</h3>
                <p className="text-text-muted">
                  {searchTerm ? "Try a different search term" : "Click 'Add Bookmark' to get started"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative glass p-6 rounded-3xl border-primary/20">
                <Bookmark className="text-primary" size={64} />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-primary/40 bg-clip-text text-transparent">
              Organize your links,<br/>perfectly.
            </h1>
            <p className="text-text-muted text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              LynxLocker automatically fetches metadata, favicons, and organizes your bookmarks with powerful tagging and instant search.
            </p>
            <button onClick={handleLogin} className="btn btn-primary h-14 px-10 text-lg shadow-xl shadow-primary/20">
              Get Started for Free
            </button>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              {[
                { title: 'Auto Metadata', desc: 'Saves time by automatically pulling titles and descriptions.' },
                { title: 'Lucid Search', desc: 'Instant client-side filtering for zero-latency retrieval.' },
                { title: 'Tagging System', desc: 'Simple but powerful tagging for deep organization.' }
              ].map(feature => (
                <div key={feature.title} className="glass p-6 rounded-2xl text-left border-border/50 hover:border-primary/20 transition-colors">
                  <h4 className="font-bold text-lg mb-2 text-white">{feature.title}</h4>
                  <p className="text-text-muted text-sm">{feature.desc}</p>
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
      />
    </div>
  );
}

export default App;
