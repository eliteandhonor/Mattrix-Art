import React, { useState } from 'react';
import { Upload, Search, LogIn, UserPlus, LogOut, FolderPlus, RefreshCw } from 'lucide-react';
import { useStore } from '../store';
import { AuthModal } from './AuthModal';
import { CategoryModal } from './CategoryModal';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

interface HeaderProps {
  onUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onUpload }) => {
  const { user, logout, setSearchTerm, resetStore } = useStore();
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const [showCategory, setShowCategory] = useState(false);

  const handleReset = () => {
    if (window.confirm('This will reset all data and remove all images. Are you sure?')) {
      resetStore();
      toast.success('All data has been reset');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/90 border-b border-green-500/20">
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <motion.img 
                src="https://promtasticworld.com/wp-content/uploads/2024/11/logo.png" 
                alt="Logo" 
                className="h-12 w-auto"
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                }}
                transition={{ 
                  duration: 1.5,
                  filter: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }
                }}
              />
              <div>
                <motion.h1 
                  className="text-green-400 text-3xl font-bold tracking-[0.2em] uppercase"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  The Matrix
                </motion.h1>
                <motion.span 
                  className="text-green-400/50 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Digital Art Gallery
                </motion.span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50 
                               group-focus-within:text-green-400 transition-colors" 
                     size={20} />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="matrix-input pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={handleReset} className="matrix-button">
                  <RefreshCw size={20} />
                  <span className="hidden md:inline">Reset</span>
                </button>

                {user ? (
                  <>
                    <button onClick={() => setShowCategory(true)} className="matrix-button">
                      <FolderPlus size={20} />
                      <span className="hidden md:inline">Categories</span>
                    </button>
                    <button onClick={onUpload} className="matrix-button">
                      <Upload size={20} />
                      <span className="hidden md:inline">Upload</span>
                    </button>
                    <button onClick={logout} className="matrix-button">
                      <LogOut size={20} />
                      <span className="hidden md:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={onUpload} className="matrix-button">
                      <Upload size={20} />
                      <span className="hidden md:inline">Upload Anonymously</span>
                    </button>
                    <button onClick={() => setShowAuth('login')} className="matrix-button">
                      <LogIn size={20} />
                      <span className="hidden md:inline">Login</span>
                    </button>
                    <button onClick={() => setShowAuth('register')} className="matrix-button">
                      <UserPlus size={20} />
                      <span className="hidden md:inline">Register</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showAuth && <AuthModal mode={showAuth} onClose={() => setShowAuth(null)} />}
        {showCategory && <CategoryModal onClose={() => setShowCategory(false)} />}
      </AnimatePresence>
    </>
  );
};