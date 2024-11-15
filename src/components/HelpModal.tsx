import React from 'react';
import { X, Upload, Star, MessageSquare, User, Share2, Download, FolderPlus } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const features = [
    {
      icon: <Upload size={20} />,
      title: 'Upload Artwork',
      description: 'Share your digital art with or without an account. Supports images up to 5MB.',
    },
    {
      icon: <Star size={20} />,
      title: 'Rate & Review',
      description: 'Rate artworks and leave comments to engage with artists.',
    },
    {
      icon: <FolderPlus size={20} />,
      title: 'Categories',
      description: 'Organize artworks into categories for better discovery.',
    },
    {
      icon: <User size={20} />,
      title: 'User Profiles',
      description: 'Create an account to manage your gallery and track your contributions.',
    },
    {
      icon: <Share2 size={20} />,
      title: 'Share',
      description: 'Share artworks on social media or copy direct links.',
    },
    {
      icon: <Download size={20} />,
      title: 'Download',
      description: 'Download high-quality versions of artworks (when permitted).',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-black/80 border border-green-500/20 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-green-400 text-2xl font-bold tracking-wider">
              Help & Features
            </h2>
            <button onClick={onClose} className="text-green-400 hover:text-green-300">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black/50 border border-green-500/20 rounded-lg p-4 hover:border-green-500/40 transition-all duration-300"
              >
                <div className="flex items-center mb-2">
                  <div className="text-green-400 mr-2">{feature.icon}</div>
                  <h3 className="text-green-400 font-bold">{feature.title}</h3>
                </div>
                <p className="text-green-200/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-green-500/5 rounded-lg border border-green-500/10">
            <h3 className="text-green-400 font-bold mb-2">Quick Tips</h3>
            <ul className="text-green-200/70 text-sm space-y-2">
              <li>• Click on any artwork to view details and leave comments</li>
              <li>• Hover over artworks to see quick actions</li>
              <li>• Create an account to manage your own gallery</li>
              <li>• Use categories to organize and discover similar artworks</li>
              <li>• Forgot your password? Click "Reset Password" on the login screen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};