import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Star, TrendingUp, Clock, Search, User, Share2, Download, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { EditArtworkModal } from './EditArtworkModal';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ArtworkGridProps {
  onUserClick?: (userId: string) => void;
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({ onUserClick }) => {
  const { 
    artworks, 
    setSelectedArtwork, 
    getAverageRating, 
    searchTerm,
    user,
    deleteArtwork,
    hasUserRated,
    addRating,
    selectedCategory,
    currentPage,
    setCurrentPage,
    itemsPerPage
  } = useStore();

  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [hoveredArtwork, setHoveredArtwork] = useState<string | null>(null);
  const [editingArtwork, setEditingArtwork] = useState<any | null>(null);

  const filteredAndSortedArtworks = useMemo(() => {
    return [...artworks]
      .filter((artwork) => {
        // Filter by category if selected
        if (selectedCategory && artwork.categoryId !== selectedCategory) {
          return false;
        }
        
        // Filter by search term
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          artwork.title.toLowerCase().includes(searchLower) ||
          artwork.artist.toLowerCase().includes(searchLower) ||
          artwork.description.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return getAverageRating(b.id) - getAverageRating(a.id);
        }
      });
  }, [artworks, sortBy, getAverageRating, searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedArtworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtworks = filteredAndSortedArtworks.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (artwork: any) => {
    try {
      await navigator.share({
        title: artwork.title,
        text: `Check out "${artwork.title}" by ${artwork.artist}`,
        url: window.location.href,
      });
      toast.success('Shared successfully');
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleDownload = async (artwork: any) => {
    try {
      const response = await fetch(artwork.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${artwork.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-green-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedArtworks.length)} of {filteredAndSortedArtworks.length} artworks
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortBy('date')}
              className={`matrix-button ${
                sortBy === 'date' ? 'bg-green-500/20' : ''
              }`}
            >
              <Clock size={16} />
              <span>Latest</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortBy('rating')}
              className={`matrix-button ${
                sortBy === 'rating' ? 'bg-green-500/20' : ''
              }`}
            >
              <TrendingUp size={16} />
              <span>Top Rated</span>
            </motion.button>
          </div>
        </div>

        {paginatedArtworks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-green-400/50"
          >
            <Search size={48} className="mb-4" />
            <p className="text-xl">No artworks found</p>
            {searchTerm && (
              <p className="mt-2">Try adjusting your search terms</p>
            )}
          </motion.div>
        ) : (
          <Masonry
            breakpointCols={{
              default: 3,
              1100: 2,
              700: 1
            }}
            className="flex -ml-6 w-auto"
            columnClassName="pl-6 bg-clip-padding"
          >
            {paginatedArtworks.map((artwork) => {
              const rating = getAverageRating(artwork.id);
              const isHovered = hoveredArtwork === artwork.id;
              const userRated = hasUserRated(artwork.id);
              const canEdit = user?.id === artwork.userId || artwork.isAnonymous;

              return (
                <motion.div
                  layout
                  key={artwork.id}
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div
                    className="group relative overflow-hidden rounded-lg cursor-pointer transform 
                             transition-all duration-300 hover:scale-[1.02] 
                             hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]"
                    onMouseEnter={() => setHoveredArtwork(artwork.id)}
                    onMouseLeave={() => setHoveredArtwork(null)}
                  >
                    <Zoom>
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    </Zoom>
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute top-4 right-4 flex space-x-2">
                        {canEdit && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-green-500/20 rounded-full text-green-400 hover:bg-green-500/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingArtwork(artwork);
                              }}
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-red-500/20 rounded-full text-red-400 hover:bg-red-500/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this artwork?')) {
                                  deleteArtwork(artwork.id);
                                  toast.success('Artwork deleted');
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500/20 rounded-full text-green-400 hover:bg-green-500/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(artwork);
                          }}
                        >
                          <Share2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-green-500/20 rounded-full text-green-400 hover:bg-green-500/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(artwork);
                          }}
                        >
                          <Download size={16} />
                        </motion.button>
                      </div>

                      <div className="absolute bottom-0 p-4 w-full" onClick={() => setSelectedArtwork(artwork)}>
                        <motion.h3 
                          className="text-green-400 font-bold text-lg mb-1"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {artwork.title}
                        </motion.h3>
                        <motion.button
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUserClick?.(artwork.userId);
                          }}
                          className="flex items-center text-green-200 hover:text-green-300 
                                   transition-colors mb-2 group/user"
                        >
                          <User size={14} className="mr-1 group-hover/user:scale-110 transition-transform" />
                          <span>{artwork.artist}</span>
                        </motion.button>
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.button
                                key={i}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!userRated) {
                                    addRating(artwork.id, i + 1);
                                    toast.success('Rating submitted');
                                  }
                                }}
                                disabled={userRated}
                              >
                                <Star
                                  size={16}
                                  className={`${
                                    i < rating
                                      ? 'text-green-400 fill-green-400'
                                      : 'text-green-800'
                                  } transition-colors ${
                                    userRated ? 'cursor-default' : 'cursor-pointer'
                                  }`}
                                />
                              </motion.button>
                            ))}
                          </div>
                          <span className="text-green-200/70 text-sm">
                            {format(new Date(artwork.createdAt), 'MMM d, yyyy')}
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </Masonry>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="matrix-button"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`matrix-button w-10 h-10 justify-center ${
                  currentPage === page ? 'bg-green-500/40' : ''
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="matrix-button"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingArtwork && (
          <EditArtworkModal
            artwork={editingArtwork}
            onClose={() => setEditingArtwork(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};