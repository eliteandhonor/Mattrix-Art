import React, { useState, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, FolderPlus } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

interface UploadModalProps {
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
  const { user, addArtwork, categories } = useStore();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Compress image if it's too large
      if (result.length > 1024 * 1024) { // If larger than 1MB
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 1200;
          if (width > height && width > maxDimension) {
            height *= maxDimension / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width *= maxDimension / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          ctx.drawImage(img, 0, 0, width, height);
          setPreview(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = result;
      } else {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !title || (!user && !artist)) {
      toast.error('Please fill in all required fields and upload an image');
      return;
    }

    try {
      setIsUploading(true);

      const newArtwork = {
        id: Date.now().toString(),
        title,
        artist: user ? user.username : artist,
        description,
        imageUrl: preview,
        rating: 0,
        ratingCount: 0,
        createdAt: new Date().toISOString(),
        userId: user?.id || 'anonymous',
        categoryId: categoryId || undefined,
        isAnonymous: !user,
      };

      addArtwork(newArtwork);
      toast.success('Artwork uploaded successfully');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload artwork. Please try again with a smaller image.');
    } finally {
      setIsUploading(false);
    }
  };

  const userCategories = categories.filter(
    (category) => user && category.createdBy === user.id
  );

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-black/80 border border-green-500/20 rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-green-400 text-2xl font-bold tracking-wider">
              {user ? 'Upload to Your Gallery' : 'Upload Anonymously'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-green-400 hover:text-green-300"
              disabled={isUploading}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`relative cursor-pointer transition-all duration-300 ${
                isDragActive ? 'border-green-500/50' : ''
              }`}
            >
              {preview ? (
                <div className="relative group">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-green-400">Click or drag to change image</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-green-500/20 rounded-lg flex flex-col items-center justify-center text-green-400/50">
                  <ImageIcon size={48} />
                  <span className="mt-2">
                    {isDragActive ? 'Drop image here' : 'Click or drag to upload image (max 5MB)'}
                  </span>
                </div>
              )}
              <input {...getInputProps()} />
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title *"
                className="matrix-input"
                required
                disabled={isUploading}
              />

              {!user && (
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Artist Name *"
                  className="matrix-input"
                  required
                  disabled={isUploading}
                />
              )}

              {user && userCategories.length > 0 && (
                <div className="relative">
                  <FolderPlus size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="matrix-input pl-10 appearance-none"
                    disabled={isUploading}
                  >
                    <option value="">Select Category (Optional)</option>
                    {userCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="matrix-input h-32 resize-none"
                disabled={isUploading}
              />
            </div>

            <button
              type="submit"
              className="matrix-button w-full justify-center"
              disabled={!preview || isUploading}
            >
              <Upload size={20} />
              <span>{isUploading ? 'Uploading...' : 'Upload Artwork'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};