import React, { useState, useEffect } from 'react';
import { User, Line } from '@/lib/utils';

interface LineAssignmentModalProps {
    user: User;
    lines: Line[];
    onSave: (userId: number, lineIds: number[]) => Promise<void>;
    onClose: () => void;
}

export default function LineAssignmentModal({ user, lines, onSave, onClose }: LineAssignmentModalProps) {
    const [selectedLineIds, setSelectedLineIds] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch current assignments
        fetch(`/api/user-lines?userId=${user.id}`)
            .then(res => res.json())
            .then((data: { lineId: number }[]) => {
                setSelectedLineIds(data.map(l => l.lineId));
            })
            .catch(console.error);
    }, [user.id]);

    const handleToggleLine = (lineId: number) => {
        setSelectedLineIds(prev =>
            prev.includes(lineId)
                ? prev.filter(id => id !== lineId)
                : [...prev, lineId]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(user.id, selectedLineIds);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg animate-scale-in">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Assign Lines to {user.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Select the production lines this user is allowed to manage.
                </p>

                <div className="max-h-60 overflow-y-auto mb-6 space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                    {lines.map(line => (
                        <label key={line.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedLineIds.includes(line.id)}
                                onChange={() => handleToggleLine(line.id)}
                                className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300 dark:border-gray-600"
                            />
                            <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">{line.name}</span>
                        </label>
                    ))}
                    {lines.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No lines available.</p>
                    )}
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
                        disabled={saving}
                        className="px-4 py-2 bg-primary hover:bg-green-600 text-white font-bold rounded-lg shadow-md disabled:opacity-50 transition-all"
                    >
                        {saving ? 'Saving...' : 'Save Assignments'}
                    </button>
                </div>
            </div>
        </div>
    );
}
