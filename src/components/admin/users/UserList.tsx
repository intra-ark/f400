import React from 'react';
import { User } from '@/lib/utils';

interface UserListProps {
    users: User[];
    currentUserRole: string;
    onDeleteUser: (userId: number, username: string) => void;
    onResetPassword: (userId: number, username: string) => void;
    onManageLines: (user: User) => void;
    onChangeRole: (user: User) => void;
}

export default function UserList({ users, currentUserRole, onDeleteUser, onResetPassword, onManageLines, onChangeRole }: UserListProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold text-lg">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* Reset Password Button */}
                                        <button
                                            onClick={() => onResetPassword(user.id, user.username)}
                                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                                            title="Reset Password"
                                        >
                                            <span className="material-icons-outlined">lock_reset</span>
                                        </button>

                                        {/* Manage Lines Button - Only for non-admins */}
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => onManageLines(user)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Assign Lines"
                                            >
                                                <span className="material-icons-outlined">fact_check</span>
                                            </button>
                                        )}

                                        {/* Change Role Button - Prevent changing own role or super admin */}
                                        {user.username !== 'ahmet mersin' && (
                                            <button
                                                onClick={() => onChangeRole(user)}
                                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                title="Change Role"
                                            >
                                                <span className="material-icons-outlined">admin_panel_settings</span>
                                            </button>
                                        )}

                                        {/* Delete User Button - Prevent deleting super admin */}
                                        {user.username !== 'ahmet mersin' && (
                                            <button
                                                onClick={() => onDeleteUser(user.id, user.username)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <span className="material-icons-outlined">delete</span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
