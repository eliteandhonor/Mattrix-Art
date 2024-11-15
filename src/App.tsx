import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArtworkGrid } from './components/ArtworkGrid';
import { ArtworkModal } from './components/ArtworkModal';
import { UploadModal } from './components/UploadModal';
import { UserProfile } from './components/UserProfile';
import { CategoryList } from './components/CategoryList';
import { MatrixRain } from './components/MatrixRain';
import { HelpModal } from './components/HelpModal';
import { TutorialOverlay } from './components/TutorialOverlay';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-green-200 flex flex-col">
      <MatrixRain />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#4ade80',
            border: '1px solid rgba(74, 222, 128, 0.2)',
          },
        }}
      />

      <Header onUpload={() => setShowUpload(true)} />

      <main className="flex-1 container mx-auto px-4 py-8 mt-[140px] md:mt-[88px]">
        <CategoryList />
        <ArtworkGrid onUserClick={(userId) => setSelectedUserId(userId)} />
      </main>

      <AnimatePresence mode="wait">
        {showUpload && (
          <UploadModal 
            key="upload-modal"
            onClose={() => setShowUpload(false)} 
          />
        )}
        {showHelp && (
          <HelpModal 
            key="help-modal"
            onClose={() => setShowHelp(false)} 
          />
        )}
        {showTutorial && (
          <TutorialOverlay 
            key="tutorial-overlay"
            onClose={() => setShowTutorial(false)} 
          />
        )}
        {showResetPassword && (
          <ResetPasswordModal 
            key="reset-password-modal"
            onClose={() => setShowResetPassword(false)} 
          />
        )}
        {selectedUserId && (
          <UserProfile 
            key={`user-profile-${selectedUserId}`}
            userId={selectedUserId} 
            onClose={() => setSelectedUserId(null)} 
          />
        )}
      </AnimatePresence>

      <ArtworkModal onUserClick={(userId) => setSelectedUserId(userId)} />
    </div>
  );
}

export default App;