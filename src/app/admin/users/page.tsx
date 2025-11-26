"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import AddUserForm from '@/components/admin/users/AddUserForm';
import UserList from '@/components/admin/users/UserList';
import LineAssignmentModal from '@/components/admin/users/LineAssignmentModal';
import RoleChangeModal from '@/components/admin/users/RoleChangeModal';
import PasswordResetModal from '@/components/admin/users/PasswordResetModal';
import { User, Line } from '@/lib/utils';

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [lines, setLines] = useState<Line[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [selectedUserForLines, setSelectedUserForLines] = useState<User | null>(null);
    const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
    const [selectedUserForReset, setSelectedUserForReset] = useState<{ id: number; username: string } | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
        message: '',
        type: 'success',
        visible: false
    });

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'info' | 'warning' | 'danger';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => { }
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type, visible: true });
    };

    const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'info' | 'warning' | 'danger' = 'warning') => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            type,
            onConfirm: () => {
                onConfirm();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    useEffect(() => {
        fetchUsers();
        fetchLines();
    }, []);

    const fetchUsers = () => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const fetchLines = () => {
        fetch('/api/lines')
            .then(res => res.json())
            .then(data => setLines(data))
            .catch(console.error);
    };

    const handleAddUser = async (username: string, role: string) => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password: 'password123', role })
            });

            if (res.ok) {
                showToast(`User "${username}" created successfully! Default password is "password123"`);
                fetchUsers();
            } else {
                const error = await res.json();
                showToast(error.error || 'Failed to create user', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error creating user', 'error');
        }
    };

    const handleDeleteUser = (userId: number, username: string) => {
        showConfirm(
            'Delete User',
            `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
            async () => {
                try {
                    const res = await fetch(`/api/users?id=${userId}`, {
                        method: 'DELETE'
                    });

                    if (res.ok) {
                        showToast(`User "${username}" deleted successfully`);
                        fetchUsers();
                    } else {
                        showToast('Failed to delete user', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    showToast('Error deleting user', 'error');
                }
            },
            'danger'
        );
    };

    const handleResetPassword = async (userId: number, newPass: string) => {
        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, password: newPass })
            });

            if (res.ok) {
                showToast('Password reset successfully!');
                setSelectedUserForReset(null);
            } else {
                showToast('Failed to reset password', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error resetting password', 'error');
        }
    };

    const handleSaveLineAssignments = async (userId: number, lineIds: number[]) => {
        try {
            const res = await fetch('/api/user-lines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, lineIds })
            });

            if (res.ok) {
                showToast('Line assignments updated successfully!');
                setSelectedUserForLines(null);
            } else {
                showToast('Failed to update assignments', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error updating assignments', 'error');
        }
    };

    const handleChangeRole = async (userId: number, newRole: string) => {
        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, role: newRole })
            });

            if (res.ok) {
                showToast('User role updated successfully!');
                fetchUsers();
                setSelectedUserForRole(null);
            } else {
                showToast('Failed to update role', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error updating role', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, visible: false }))}
                />
            )}

            <Modal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />

            <header className="flex justify-between items-center mb-8 border-b-2 border-[#3dcd58] pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <span className="material-icons-outlined text-3xl">arrow_back</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
                </div>
            </header>

            <AddUserForm onAddUser={handleAddUser} />

            <UserList
                users={users}
                currentUserRole={session?.user?.role || 'USER'}
                onDeleteUser={handleDeleteUser}
                onResetPassword={(id, username) => setSelectedUserForReset({ id, username })}
                onManageLines={setSelectedUserForLines}
                onChangeRole={setSelectedUserForRole}
            />

            {/* Line Assignment Modal */}
            {selectedUserForLines && (
                <LineAssignmentModal
                    user={selectedUserForLines}
                    lines={lines}
                    onSave={handleSaveLineAssignments}
                    onClose={() => setSelectedUserForLines(null)}
                />
            )}

            {/* Role Change Modal */}
            {selectedUserForRole && (
                <RoleChangeModal
                    user={selectedUserForRole}
                    onSave={handleChangeRole}
                    onClose={() => setSelectedUserForRole(null)}
                />
            )}

            {/* Password Reset Modal */}
            {selectedUserForReset && (
                <PasswordResetModal
                    userId={selectedUserForReset.id}
                    username={selectedUserForReset.username}
                    onReset={handleResetPassword}
                    onClose={() => setSelectedUserForReset(null)}
                />
            )}
        </div>
    );
}
