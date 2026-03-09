'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error in 3D Viewer:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-black/5 rounded-2xl">
                    <svg className="w-12 h-12 text-red-500 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <h2 className="text-xl font-display text-maserati-navy dark:text-white mb-2 tracking-widest uppercase">Model Failed to Load</h2>
                    <p className="text-maserati-navy/60 dark:text-white/60 text-sm max-w-sm mb-4">
                        The 3D model could not be displayed due to corrupted or unsupported internal textures.
                    </p>
                    <code className="text-xs bg-black/10 dark:bg-white/10 p-2 rounded text-left block w-full overflow-x-auto max-w-md">
                        {this.state.error?.message}
                    </code>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-6 px-6 py-2 border border-maserati-navy/20 dark:border-white/20 rounded-none text-sm tracking-widest uppercase hover:bg-maserati-navy/5 dark:hover:bg-white/5 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
