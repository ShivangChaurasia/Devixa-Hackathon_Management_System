import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import GlassCard from '../../components/ui/GlassCard';
import { Shield, ShieldAlert, CheckCircle2, UserX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users');
      setUsers(res.users);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { role });
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/status`, { status });
      setUsers(users.map(u => u._id === userId ? { ...u, status } : u));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50 animate-pulse">Loading users...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/70">
            <thead className="text-xs uppercase bg-foreground/5 text-foreground/50">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-foreground/40">@{user.username || 'unassigned'}</div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="bg-background border border-foreground/10 rounded px-2 py-1 outline-none focus:border-accent-start"
                    >
                      <option value="PARTICIPANT">Participant</option>
                      <option value="ORGANIZER">Organizer</option>
                      <option value="JUDGE">Judge</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${user.status === 'ACTIVE' ? 'bg-status-success/20 text-status-success' : 'bg-status-error/20 text-status-error'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    {user.status === 'ACTIVE' ? (
                      <button onClick={() => updateUserStatus(user._id, 'BLOCKED')} className="p-2 bg-foreground/5 hover:bg-status-error/20 hover:text-status-error rounded text-foreground/50 transition-colors" title="Block User">
                        <UserX size={16} />
                      </button>
                    ) : (
                      <button onClick={() => updateUserStatus(user._id, 'ACTIVE')} className="p-2 bg-foreground/5 hover:bg-status-success/20 hover:text-status-success rounded text-foreground/50 transition-colors" title="Unblock User">
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
