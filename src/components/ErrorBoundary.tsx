import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public readonly props: ErrorBoundaryProps;
  public readonly state: ErrorBoundaryState = {
    hasError: false
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)] text-white p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400">Something went wrong.</h1>
            <p className="text-gray-400 mt-2">Please refresh the page to continue.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-5 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    const { children } = this.props;
    return children;
  }
}
