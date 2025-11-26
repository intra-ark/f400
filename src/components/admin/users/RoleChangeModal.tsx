import React, { useState } from 'react';
import { User } from '@/lib/utils';

interface RoleChangeModalProps {
    user: User;
    onSave: (userId: number, newRole: string) => Promise<void>;
    onClose: () => void;
}

export default function RoleChangeModal({ user, onSave, onClose }: RoleChangeModalProps) {
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave(user.id, selectedRole);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm animate-scale-in">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Change Role for {user.username}
                </h3>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Role
                    </label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Admins have full access to all lines and settings. Users can only access assigned lines.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || selectedRole === user.role}
                        className="px-4 py-2 bg-primary hover:bg-green-600 text-white font-bold rounded-lg shadow-md disabled:opacity-50 transition-all"
                    >
                        {saving ? 'Updating...' : 'Update Role'}
                    </button>
                </div>
            </div>
        </div>
    );
}
