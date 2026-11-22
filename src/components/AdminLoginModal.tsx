import React, { useEffect, useState } from 'react';
import { AlertCircle, Lock, X } from 'lucide-react';
import { ADMIN_ACCESS_ID } from '../data/defaultData';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [adminId, setAdminId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setAdminId('');
    setError(null);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === ADMIN_ACCESS_ID) {
      setError(null);
      onAuthenticated();
    } else {
      setError('Invalid Admin ID');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0A2463] text-[#F59E0B] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="admin-login-title" className="font-display font-bold text-lg text-[#0A2463]">
                Admin Login
              </h2>
              <p className="text-xs text-slate-500">
                Enter your authorized Admin ID to unlock CMS controls
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Admin Login"
            className="w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-rose-800"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="jit-admin-id-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Admin ID
            </label>
            <input
              id="jit-admin-id-input"
              type="password"
              inputMode="numeric"
              autoFocus
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Admin ID"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
            />
            <p className="mt-2 text-[11px] text-slate-500">
              After unlocking, connect your authorized Google Admin account inside the CMS panel to
              sync updates globally via Firebase Firestore.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Verify &amp; Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
