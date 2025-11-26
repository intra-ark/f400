import React, { useState } from 'react';

interface PasswordResetModalProps {
    userId: number;
    username: string;
    onReset: (userId: number, newPass: string) => Promise<void>;
    onClose: () => void;
}

export default function PasswordResetModal({ userId, username, onReset, onClose }: PasswordResetModalProps) {
    const [newPassword, setNewPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const handleReset = async () => {
        if (!newPassword) return;
        setSaving(true);
        await onReset(userId, newPassword);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm animate-scale-in">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Reset Password
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Enter a new password for <strong>{username}</strong>.
                </p>

                <div className="mb-6">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        autoFocus
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={saving || !newPassword}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-md disabled:opacity-50 transition-all"
                    >
                        {saving ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </div>
        </div>
    );
}
