"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [headerImage, setHeaderImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showHeaderSettings, setShowHeaderSettings] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.headerImageUrl) setHeaderImage(data.headerImageUrl);
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateHeaderImage = async () => {
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ headerImageUrl: headerImage }),
            });
            if (res.ok) {
                alert('Header image updated successfully!');
            } else {
                alert('Failed to update header image');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update header image');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
                <Link href="/" className="text-primary hover:underline font-medium">
                    Back to Public Site
                </Link>
            </header>

            {/* Year Selection Grid */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">Year Data Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[2023, 2024, 2025, 2026, 2027].map(year => (
                        <Link key={year} href={`/admin/year/${year}`} className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-4xl font-bold text-gray-800 dark:text-white">{year}</span>
                                    <span className="material-icons-outlined text-4xl text-primary group-hover:scale-110 transition-transform">calendar_today</span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Manage Data &rarr;</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Header Image Management - Collapsible */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <button
                    onClick={() => setShowHeaderSettings(!showHeaderSettings)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Header Image Management</h2>
                    <span className="material-icons-outlined text-gray-400">
                        {showHeaderSettings ? 'expand_less' : 'expand_more'}
                    </span>
                </button>

                {showHeaderSettings && (
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Header Image URL</label>
                                <input
                                    type="text"
                                    value={headerImage}
                                    onChange={(e) => setHeaderImage(e.target.value)}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="/F400i.png"
                                />
                            </div>
                            <button
                                onClick={handleUpdateHeaderImage}
                                className="bg-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition h-10"
                            >
                                Update Header Image
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
