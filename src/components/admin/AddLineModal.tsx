import React, { useState } from 'react';

interface AddLineModalProps {
    onCreate: (name: string, slug: string) => Promise<void>;
    onClose: () => void;
    creating: boolean;
}

export default function AddLineModal({ onCreate, onClose, creating }: AddLineModalProps) {
    const [newLineName, setNewLineName] = useState('');
    const [newLineSlug, setNewLineSlug] = useState('');

    const handleCreate = () => {
        onCreate(newLineName, newLineSlug);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Add New Production Line</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Line Name
                        </label>
                        <input
                            type="text"
                            value={newLineName}
                            onChange={(e) => setNewLineName(e.target.value)}
                            placeholder="e.g., Assembly Line 1"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Slug (URL-friendly identifier)
                        </label>
                        <input
                            type="text"
                            value={newLineSlug}
                            onChange={(e) => setNewLineSlug(e.target.value)}
                            placeholder="e.g., assembly-line-1"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-green-600 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {creating ? 'Creating...' : 'Create Line'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
