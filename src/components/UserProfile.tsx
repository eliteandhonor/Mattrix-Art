import React from 'react';
import { useStore } from '../store';
import { User as UserIcon, Image as ImageIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface UserProfileProps {
  userId: string;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onClose }) => {
  const { getUserArtworks, setSelectedArtwork } = useStore();
  const userArtworks = getUserArtworks(userId);

  if (userArtworks.length === 0) return null;

  const artist = userArtworks[0].artist; // Get artist name from first artwork

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-black/80 border border-green-500/20 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <UserIcon size={32} className="text-green-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-green-400 text-2xl font-bold">{artist}</h2>
                <div className="flex items-center text-green-200/70">
                  <ImageIcon size={16} className="mr-2" />
                  <span>{userArtworks.length} artworks</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-green-400 hover:text-green-300 px-4 py-2 border border-green-500/20 rounded-md"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userArtworks.map((artwork) => (
              <div
                key={artwork.id}
                onClick={() => setSelectedArtwork(artwork)}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
              >
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 p-4 w-full">
                    <h3 className="text-green-400 font-bold mb-1">
                      {artwork.title}
                    </h3>
                    <div className="flex items-center text-green-200/70 text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        {format(new Date(artwork.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};