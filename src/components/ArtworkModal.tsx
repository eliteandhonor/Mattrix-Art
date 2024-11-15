import React, { useState } from 'react';
import { useStore } from '../store';
import { X, Star, MessageSquare, Share2, Download, User } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ArtworkModalProps {
  onUserClick?: (userId: string) => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({ onUserClick }) => {
  const {
    selectedArtwork,
    setSelectedArtwork,
    comments,
    addComment,
    addRating,
    hasUserRated,
    getAverageRating,
    user,
    deleteArtwork,
  } = useStore();

  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!selectedArtwork) return null;

  const artworkComments = comments.filter(
    (comment) => comment.artworkId === selectedArtwork.id
  );

  const currentRating = getAverageRating(selectedArtwork.id);
  const userHasRated = hasUserRated(selectedArtwork.id);
  const canDelete = user?.id === selectedArtwork.userId || selectedArtwork.isAnonymous;

  const handleRating = (rating: number) => {
    if (userHasRated) {
      toast.error('You have already rated this artwork');
      return;
    }
    addRating(selectedArtwork.id, rating);
    toast.success('Rating submitted successfully');
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !commentAuthor) {
      toast.error('Please fill in all required fields');
      return;
    }

    addComment({
      id: Date.now().toString(),
      artworkId: selectedArtwork.id,
      author: commentAuthor,
      content: newComment,
      createdAt: new Date().toISOString(),
    });

    setNewComment('');
    setCommentAuthor('');
    toast.success('Comment added successfully');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: selectedArtwork.title,
        text: `Check out "${selectedArtwork.title}" by ${selectedArtwork.artist}`,
        url: window.location.href,
      });
      toast.success('Shared successfully');
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(selectedArtwork.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedArtwork.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      toast.error('Unable to download image');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      deleteArtwork(selectedArtwork.id);
      toast.success('Artwork deleted');
      setSelectedArtwork(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedArtwork(null);
        }
      }}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-black/80 border border-green-500/20 rounded-lg max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-green-400 text-2xl font-bold">
                {selectedArtwork.title}
              </h2>
              <button
                onClick={() => onUserClick?.(selectedArtwork.userId)}
                className="flex items-center text-green-200 hover:text-green-300 transition-colors mt-1"
              >
                <User size={16} className="mr-1" />
                <span>{selectedArtwork.artist}</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="text-green-400 hover:text-green-300"
                title="Share artwork"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={handleDownload}
                className="text-green-400 hover:text-green-300"
                title="Download artwork"
              >
                <Download size={20} />
              </button>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300"
                  title="Delete artwork"
                >
                  <X size={20} />
                </button>
              )}
              <button
                onClick={() => setSelectedArtwork(null)}
                className="text-green-400 hover:text-green-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <img
            src={selectedArtwork.imageUrl}
            alt={selectedArtwork.title}
            className="w-full rounded-lg mb-6"
          />

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < (hoveredRating || currentRating)
                      ? 'text-green-400 fill-green-400'
                      : 'text-green-800'
                  } cursor-pointer transition-colors`}
                  onMouseEnter={() => !userHasRated && setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRating(i + 1)}
                />
              ))}
            </div>
            <span className="text-green-200">
              ({currentRating.toFixed(1)} average)
            </span>
            {userHasRated && (
              <span className="text-green-400/50">(You've rated this)</span>
            )}
          </div>

          <p className="text-green-200 mb-8">{selectedArtwork.description}</p>

          <div className="border-t border-green-500/20 pt-6">
            <h3 className="text-green-400 text-xl mb-4 flex items-center">
              <MessageSquare size={20} className="mr-2" />
              Comments ({artworkComments.length})
            </h3>

            <form onSubmit={handleComment} className="mb-6">
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your name"
                  className="matrix-input"
                />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="matrix-input h-24 resize-none"
                />
                <button
                  type="submit"
                  className="matrix-button self-end"
                >
                  Post Comment
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {artworkComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="matrix-card"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-400 font-bold">
                      {comment.author}
                    </span>
                    <span className="text-green-200/60 text-sm">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-green-200">{comment.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};