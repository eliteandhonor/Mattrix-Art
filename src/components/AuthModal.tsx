import React, { useState } from 'react';
import { X, User, Lock, KeyRound } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface AuthModalProps {
  onClose: () => void;
  mode: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, mode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const { login, register } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (mode === 'login') {
        login(username, password);
        toast.success('Logged in successfully');
      } else {
        register(username, password);
        toast.success('Registered successfully');
      }
      onClose();
    } catch (error) {
      toast.error(mode === 'login' ? 'Login failed' : 'Registration failed');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !newPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // In a real app, this would make an API call to reset the password
      // For this demo, we'll simulate it by updating the store
      useStore.setState((state) => ({
        user: state.user?.username === username ? { ...state.user, password: newPassword } : state.user
      }));
      toast.success('Password reset successfully');
      setIsResetting(false);
    } catch (error) {
      toast.error('Password reset failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-black/80 border border-green-500/20 rounded-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-green-400 text-2xl font-bold tracking-wider">
              {isResetting ? 'Reset Password' : mode === 'login' ? 'Login' : 'Register'}
            </h2>
            <button onClick={onClose} className="text-green-400 hover:text-green-300">
              <X size={24} />
            </button>
          </div>

          {!isResetting ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="matrix-input pl-10"
                    />
                  </div>

                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="matrix-input pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button type="submit" className="matrix-button w-full justify-center">
                    {mode === 'login' ? 'Login' : 'Register'}
                  </button>

                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setIsResetting(true)}
                      className="text-green-400/70 hover:text-green-400 text-sm text-center"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="matrix-input pl-10"
                  />
                </div>

                <div className="relative">
                  <KeyRound size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="matrix-input pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <button type="submit" className="matrix-button w-full justify-center">
                  Reset Password
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetting(false)}
                  className="text-green-400/70 hover:text-green-400 text-sm text-center"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};