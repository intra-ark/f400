import React, { useState } from 'react';

interface YearManagerProps {
    availableYears: number[];
    onAddYear: (year: number) => Promise<void>;
    onDeleteYear: (year: number) => Promise<void>;
    onClose: () => void;
}

export default function YearManager({ availableYears, onAddYear, onDeleteYear, onClose }: YearManagerProps) {
    const [newYearInput, setNewYearInput] = useState('');

    const handleAdd = () => {
        const year = parseInt(newYearInput);
        if (!year || isNaN(year)) return;
        onAddYear(year);
        setNewYearInput('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Manage Years</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Add New Year
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="2000"
                            max="2100"
                            value={newYearInput}
                            onChange={(e) => setNewYearInput(e.target.value)}
                            placeholder="e.g. 2028"
                            className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!newYearInput}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 rounded-lg disabled:opacity-50 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Available Years</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableYears.map(year => (
                            <div key={year} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="font-semibold text-gray-800 dark:text-white">{year}</span>
                                <button
                                    onClick={() => onDeleteYear(year)}
                                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                    title="Delete Year"
                                >
                                    <span className="material-icons-outlined text-sm">delete</span>
                                </button>
                            </div>
                        ))}
                        {availableYears.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No years configured.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
