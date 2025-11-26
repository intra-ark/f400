import React, { useState, useEffect, useRef } from 'react';

interface BackupMenuProps {
    onExportBackup: () => void;
    onExportExcel: () => void;
    onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BackupMenu({ onExportBackup, onExportExcel, onImportBackup, onImportExcel }: BackupMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative group" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Database Management"
            >
                <span className="material-icons-outlined text-gray-600 dark:text-gray-400">storage</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Database</p>
                    </div>
                    <div className="p-2">
                        <button
                            onClick={() => { onExportBackup(); setIsOpen(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2 text-sm"
                        >
                            <span className="material-icons-outlined text-blue-600 text-base">download</span>
                            <span className="text-gray-700 dark:text-gray-300">Export JSON</span>
                        </button>
                        <button
                            onClick={() => { onExportExcel(); setIsOpen(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2 text-sm"
                        >
                            <span className="material-icons-outlined text-green-600 text-base">table_chart</span>
                            <span className="text-gray-700 dark:text-gray-300">Export Excel</span>
                        </button>
                        <label className="w-full">
                            <div className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2 text-sm cursor-pointer">
                                <span className="material-icons-outlined text-green-700 text-base">publish</span>
                                <span className="text-gray-700 dark:text-gray-300">Import Excel</span>
                            </div>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={(e) => { onImportExcel(e); setIsOpen(false); }}
                                className="hidden"
                            />
                        </label>
                        <label className="w-full">
                            <div className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2 text-sm cursor-pointer">
                                <span className="material-icons-outlined text-orange-600 text-base">upload</span>
                                <span className="text-gray-700 dark:text-gray-300">Import JSON</span>
                            </div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={(e) => { onImportBackup(e); setIsOpen(false); }}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 px-2">Import replaces all data</p>
                    </div>
                </div>
            )}
        </div>
    );
}
