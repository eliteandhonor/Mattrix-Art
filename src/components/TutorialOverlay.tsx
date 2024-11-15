import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to The Matrix Gallery',
      content: 'A unique digital art platform inspired by The Matrix. Let\'s show you around!',
    },
    {
      title: 'Upload Your Art',
      content: 'Share your artwork anonymously or create an account to build your portfolio.',
    },
    {
      title: 'Interact & Engage',
      content: 'Rate artworks, leave comments, and follow your favorite artists.',
    },
    {
      title: 'Organize & Discover',
      content: 'Use categories to organize your work and discover new artists.',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-w-md mx-4"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-400 hover:text-green-300"
        >
          <X size={24} />
        </button>

        <div className="bg-black/80 border border-green-500/20 rounded-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-green-400 text-2xl font-bold mb-4">
              {steps[step].title}
            </h2>
            <p className="text-green-200/70">{steps[step].content}</p>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              className={`matrix-button ${step === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={step === 0}
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === step ? 'bg-green-400' : 'bg-green-500/20'
                  }`}
                />
              ))}
            </div>

            <button onClick={handleNext} className="matrix-button">
              <span>{step === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};