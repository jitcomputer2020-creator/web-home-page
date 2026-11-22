import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  isPermissionError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
      isPermissionError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const raw = error?.message || 'An unexpected error occurred.';
    let friendly = raw;
    let isPerm = raw.toLowerCase().includes('permission');

    try {
      const parsed = JSON.parse(raw) as { error?: string; operationType?: string; path?: string };
      if (parsed && typeof parsed.error === 'string') {
        isPerm = parsed.error.toLowerCase().includes('permission');
        friendly = isPerm
          ? `Firestore permission denied while performing "${parsed.operationType || 'operation'}" on "${parsed.path || 'database'}". Please sign in with your authorized JIT Admin Google account (${'jitcomputer2020@gmail.com'}).`
          : parsed.error;
      }
    } catch {
      // Not JSON-formatted FirestoreErrorInfo
    }

    return {
      hasError: true,
      message: friendly,
      isPermissionError: isPerm,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 shadow-xl p-7 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="font-display font-bold text-xl text-[#0A2463]">
              {this.state.isPermissionError
                ? 'Cloud Sync Authorization Required'
                : 'Something went wrong'}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
