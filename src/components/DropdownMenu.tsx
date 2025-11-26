"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface Line {
    id: number;
    name: string;
    slug: string;
    headerImageUrl: string | null;
}

interface DropdownMenuProps {
    isOpen: boolean;
    onClose: () => void;
    lines: Line[];
    selectedLineId: number | null;
    onSelectLine: (lineId: number) => void;
    onOpenAuthorModal?: () => void;
}

export default function DropdownMenu({ isOpen, onClose, lines, selectedLineId, onSelectLine, onOpenAuthorModal }: DropdownMenuProps) {
    const { data: session } = useSession();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fade-in-down origin-top-right"
        >
            <div className="p-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-white">Menu</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <span className="material-icons-outlined text-sm">close</span>
                    </button>
                </div>

                {/* Line Selection */}
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Production Lines</h4>
                    <div className="space-y-1">
                        <button
                            onClick={() => {
                                onSelectLine(-1);
                                onClose();
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedLineId === -1
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <span className="material-icons-outlined text-lg">dashboard</span>
                            <span>Global Dashboard</span>
                        </button>

                        {lines.map(line => (
                            <button
                                key={line.id}
                                onClick={() => {
                                    onSelectLine(line.id);
                                    onClose();
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedLineId === line.id
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span>{line.name}</span>
                                {selectedLineId === line.id && <span className="material-icons-outlined text-sm">check</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Only Menu Items */}
                <div className="md:hidden space-y-1 border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
                    <button
                        onClick={() => {
                            window.location.href = "mailto:ahmet.mersin@se.com?subject=SET%20SPS%20Yardım%20İsteği";
                            onClose();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2 text-sm"
                    >
                        <span className="material-icons-outlined text-primary text-lg">help</span>
                        <span>Yardım</span>
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            if (onOpenAuthorModal) onOpenAuthorModal();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2 text-sm"
                    >
                        <span className="material-icons-outlined text-primary text-lg">person</span>
                        <span>Hazırlayan</span>
                    </button>
                </div>

                {/* Admin Link */}
                {session && (
                    <Link
                        href="/admin"
                        onClick={onClose}
                        className="block w-full text-center py-2 px-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-bold text-sm transition-colors mb-3"
                    >
                        Admin Panel
                    </Link>
                )}

                {/* Auth Section */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                    {session ? (
                        <>
                            <div className="flex items-center gap-3 mb-3 px-1">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                    {session.user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{session.user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{session.user?.role || 'USER'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="w-full py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined text-lg">logout</span>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-outlined text-lg">login</span>
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
