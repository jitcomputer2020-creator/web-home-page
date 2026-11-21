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
    if (adminId.trim() === ADMIN_ACCESS_ID) {
      setError(null);
      onAuthenticated();
    } else {
      setError('Invalid Admin ID. Please verify and try again.');
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
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="admin-login-title" className="font-display font-bold text-lg text-blue-950">
                JIT Admin Access
              </h2>
              <p className="text-xs text-slate-500">
                Authorized Institute Management Control
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
              className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs sm:text-sm text-rose-800"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="jit-admin-id" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Enter Admin ID
            </label>
            <input
              id="jit-admin-id"
              type="password"
              inputMode="numeric"
              autoFocus
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter 10-digit Admin ID"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            />
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
              className="min-h-[44px] px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Unlock Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
