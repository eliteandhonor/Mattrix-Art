import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryModalProps {
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ onClose }) => {
  const { user, addCategory, categories, deleteCategory, getCategoryArtworks } = useStore();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !user) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      addCategory({
        id: Date.now().toString(),
        name,
        createdBy: user.id,
      });
      toast.success('Category created successfully');
      setName('');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleDelete = (categoryId: string) => {
    const artworksCount = getCategoryArtworks(categoryId).length;
    if (artworksCount > 0) {
      if (!window.confirm(`This category contains ${artworksCount} artwork(s). The artworks will be moved to "No Category". Continue?`)) {
        return;
      }
    }
    deleteCategory(categoryId);
    toast.success('Category deleted successfully');
  };

  const userCategories = categories.filter(
    (category) => user && category.createdBy === user.id
  );

  // Handle click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 flex items-start justify-center z-50 overflow-y-auto py-8"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-black/80 border border-green-500/20 rounded-lg w-full max-w-md m-4 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-black/80 z-10 px-6 py-4 border-b border-green-500/20">
          <div className="flex justify-between items-center">
            <h2 className="text-green-400 text-2xl font-bold tracking-wider">
              Manage Categories
            </h2>
            <button 
              onClick={onClose} 
              className="text-green-400 hover:text-green-300 p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FolderPlus size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New Category Name"
                className="matrix-input pl-10"
              />
            </div>

            <button
              type="submit"
              className="matrix-button w-full justify-center"
            >
              Create Category
            </button>
          </form>

          {userCategories.length > 0 && (
            <div className="mt-8">
              <h3 className="text-green-400 font-bold mb-4">Your Categories</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {userCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center justify-between p-3 bg-black/50 border border-green-500/20 rounded"
                    >
                      {editingId === category.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => {
                            if (editingName.trim() && editingName !== category.name) {
                              useStore.getState().updateCategory(category.id, editingName);
                              toast.success('Category updated');
                            }
                            setEditingId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            } else if (e.key === 'Escape') {
                              setEditingId(null);
                            }
                          }}
                          className="matrix-input"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="text-green-200 cursor-pointer hover:text-green-300"
                          onClick={() => {
                            setEditingId(category.id);
                            setEditingName(category.name);
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};