import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`fixed bottom-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in-up ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
            <span className="material-icons-outlined text-2xl">
                {type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="font-semibold">{message}</span>
            <button onClick={onClose} className="ml-4 hover:opacity-80">
                <span className="material-icons-outlined text-sm">close</span>
            </button>
        </div>
    );
}
