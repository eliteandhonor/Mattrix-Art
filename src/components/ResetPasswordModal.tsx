import React, { useState } from 'react';
import { X, Mail, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';

interface ResetPasswordModalProps {
  onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    // In a real app, send reset code to email
    toast.success('Reset code sent to your email');
    setStep('code');
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error('Please enter the reset code');
      return;
    }
    // In a real app, verify the code
    setStep('newPassword');
  };

  const handleSubmitNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    // In a real app, update password in backend
    toast.success('Password reset successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-black/80 border border-green-500/20 rounded-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-green-400 text-2xl font-bold tracking-wider">
              Reset Password
            </h2>
            <button onClick={onClose} className="text-green-400 hover:text-green-300">
              <X size={24} />
            </button>
          </div>

          {step === 'email' && (
            <form onSubmit={handleSubmitEmail} className="space-y-6">
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="matrix-input pl-10"
                />
              </div>

              <button type="submit" className="matrix-button w-full justify-center">
                <span>Send Reset Code</span>
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleSubmitCode} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter reset code"
                  className="matrix-input"
                  maxLength={6}
                />
              </div>

              <button type="submit" className="matrix-button w-full justify-center">
                <span>Verify Code</span>
                <Check size={20} />
              </button>
            </form>
          )}

          {step === 'newPassword' && (
            <form onSubmit={handleSubmitNewPassword} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="matrix-input"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="matrix-input"
                />
              </div>

              <button type="submit" className="matrix-button w-full justify-center">
                <span>Reset Password</span>
                <Check size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};