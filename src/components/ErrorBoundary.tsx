import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-b from-green-900 to-black flex items-center justify-center">
                    <div className="bg-black/50 border border-green-500 rounded-lg p-6 max-w-md text-center">
                        <div className="text-green-400 text-xl font-mono mb-4">ERROR</div>
                        <div className="text-green-300 font-mono mb-4">
                            Se produjo un error inesperado
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-green-600 hover:bg-green-500 text-black font-mono px-4 py-2 rounded transition-colors"
                        >
                            Recargar página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}