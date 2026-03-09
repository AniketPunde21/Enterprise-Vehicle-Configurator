'use client';

import { useEffect, useState } from 'react';

interface NotificationToastProps {
    messages: string[];
}

export default function NotificationToast({ messages }: NotificationToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (messages.length > 0) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 4500);
            return () => clearTimeout(timer);
        }
    }, [messages]);

    if (!visible || messages.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
            <div className="glass-card border-maserati-accent/40 p-4 max-w-sm shadow-xl shadow-black/30">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-maserati-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-maserati-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-maserati-accent text-xs font-semibold tracking-wider uppercase mb-1">
                            Configuration Updated
                        </p>
                        {messages.map((msg, i) => (
                            <p key={i} className="text-white/60 text-sm leading-relaxed">
                                {msg}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
