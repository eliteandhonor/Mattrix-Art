import React from 'react';
import { useStore } from '../store';
import { Folder, Image as ImageIcon } from 'lucide-react';

export const CategoryList: React.FC = () => {
  const { categories, getCategoryArtworks, setSelectedCategory } = useStore();

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-green-400 text-xl font-bold mb-4 flex items-center">
        <Folder className="mr-2" />
        Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => setSelectedCategory(null)}
          className={`matrix-card cursor-pointer ${!useStore.getState().selectedCategory ? 'border-green-500/40' : ''}`}
        >
          <h3 className="text-green-400 font-bold mb-2">All Artworks</h3>
          <div className="flex items-center text-green-200/70">
            <ImageIcon size={16} className="mr-2" />
            <span>{useStore.getState().artworks.length} artworks</span>
          </div>
        </div>
        
        {categories.map((category) => {
          const artworks = getCategoryArtworks(category.id);
          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`matrix-card cursor-pointer ${
                useStore.getState().selectedCategory === category.id ? 'border-green-500/40' : ''
              }`}
            >
              <h3 className="text-green-400 font-bold mb-2">{category.name}</h3>
              <div className="flex items-center text-green-200/70">
                <ImageIcon size={16} className="mr-2" />
                <span>{artworks.length} artworks</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};