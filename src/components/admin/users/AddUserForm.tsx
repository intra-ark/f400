import React, { useState } from 'react';

interface AddUserFormProps {
    onAddUser: (username: string, role: string) => Promise<void>;
}

export default function AddUserForm({ onAddUser }: AddUserFormProps) {
    const [newUsername, setNewUsername] = useState('');
    const [newUserRole, setNewUserRole] = useState('USER');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim()) return;

        setLoading(true);
        await onAddUser(newUsername, newUserRole);
        setNewUsername('');
        setNewUserRole('USER');
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-primary">person_add</span>
                Add New User
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                </div>
                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading || !newUsername.trim()}
                    className="w-full md:w-auto px-6 py-2 bg-primary hover:bg-green-600 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {loading ? 'Adding...' : (
                        <>
                            <span className="material-icons-outlined">add</span>
                            Add User
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
