import React, { useState } from 'react';
import { X, Save, Folder } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { Artwork } from '../types';

interface EditArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
}

export const EditArtworkModal: React.FC<EditArtworkModalProps> = ({ artwork, onClose }) => {
  const { updateArtwork, categories, user } = useStore();
  const [title, setTitle] = useState(artwork.title);
  const [description, setDescription] = useState(artwork.description);
  const [categoryId, setCategoryId] = useState(artwork.categoryId || '');

  const userCategories = categories.filter(
    (category) => user && category.createdBy === user.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Title is required');
      return;
    }

    try {
      updateArtwork(artwork.id, {
        title,
        description,
        categoryId: categoryId || undefined,
      });
      toast.success('Artwork updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update artwork');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-black/80 border border-green-500/20 rounded-lg w-full max-w-xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-green-400 text-2xl font-bold tracking-wider">
              Edit Artwork
            </h2>
            <button onClick={onClose} className="text-green-400 hover:text-green-300">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title *"
                className="matrix-input"
                required
              />

              <div className="relative">
                <Folder size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="matrix-input pl-10 appearance-none"
                >
                  <option value="">No Category</option>
                  {userCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="matrix-input h-32 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="matrix-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="matrix-button"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};