import React, { useEffect, useState } from 'react';
import { User, RoleDefinition, RoleType } from '../types';
import { getUsers, getRoles } from '../services/mockTikTokService';
import { Users as UsersIcon, Shield, Search, Plus, MoreHorizontal, Mail, Lock, CheckCircle, XCircle } from 'lucide-react';

const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'roles'>('team');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 mt-1">Manage team access and configure role-based permissions.</p>
        </div>
        {activeTab === 'team' && (
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm">
            <Plus size={18} />
            Invite Member
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('team')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'team'
                ? 'border-tiktok-magenta text-tiktok-magenta'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UsersIcon size={18} />
            Team Members
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'border-tiktok-magenta text-tiktok-magenta'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield size={18} />
            Roles & Permissions (RBAC)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-8 h-8 border-4 border-tiktok-gray border-t-tiktok-magenta rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'team' ? (
          <TeamList users={users} />
        ) : (
          <RolePermissions roles={roles} />
        )}
      </div>
    </div>
  );
};

// --- Sub-components ---

const TeamList = ({ users }: { users: User[] }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search users..."
          className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiktok-cyan/50 w-64"
        />
      </div>
      <div className="text-sm text-gray-500">
        Total Users: <span className="font-semibold text-gray-900">{users.length}</span>
      </div>
    </div>
    
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
          <th className="px-6 py-4">User</th>
          <th className="px-6 py-4">Role</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50 transition">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-gray-200" />
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail size={10} /> {user.email}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                user.role === RoleType.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-200' :
                user.role === RoleType.EDITOR ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Active
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition">
                <MoreHorizontal size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RolePermissions = ({ roles }: { roles: RoleDefinition[] }) => (
  <div className="space-y-8 animate-in fade-in duration-300">
    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
      <Shield className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
      <div>
        <h4 className="text-sm font-bold text-blue-900">Role-Based Access Control (RBAC)</h4>
        <p className="text-sm text-blue-700 mt-1 leading-relaxed">
          Configure granular permissions for each role. Defines the ability to Create, Read, Update, or Delete resources across the platform.
          Changes are applied immediately to all users with the assigned role.
        </p>
      </div>
    </div>

    <div className="grid gap-8">
      {roles.map((role) => (
        <div key={role.type} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                role.type === 'ADMIN' ? 'bg-purple-100 text-purple-600' :
                role.type === 'EDITOR' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{role.type}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
              </div>
            </div>
            {role.type === 'ADMIN' && (
              <span className="text-xs font-mono bg-black text-white px-2 py-1 rounded">SYSTEM</span>
            )}
          </div>
          
          <div className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white text-left text-gray-400 border-b border-gray-100 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Resource</th>
                  <th className="px-6 py-3 text-center font-medium w-32">Create</th>
                  <th className="px-6 py-3 text-center font-medium w-32">Read</th>
                  <th className="px-6 py-3 text-center font-medium w-32">Update</th>
                  <th className="px-6 py-3 text-center font-medium w-32">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {role.permissions.map((perm) => (
                  <tr key={perm.resource} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 capitalize text-gray-700 font-medium flex items-center gap-2">
                        {perm.resource === 'finance' && <Lock size={14} className="text-gray-400"/>}
                        {perm.resource}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PermissionToggle active={perm.canCreate} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PermissionToggle active={perm.canRead} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PermissionToggle active={perm.canUpdate} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PermissionToggle active={perm.canDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PermissionToggle = ({ active }: { active: boolean }) => (
  <div className={`w-10 h-6 rounded-full mx-auto relative transition-all duration-200 cursor-pointer ${
    active ? 'bg-tiktok-cyan shadow-[0_0_8px_rgba(37,244,238,0.4)]' : 'bg-gray-200'
  }`}>
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
      active ? 'left-5' : 'left-1'
    }`}>
      {active ? (
        <CheckCircle size={10} className="text-tiktok-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0" />
      ) : (
         <XCircle size={10} className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0" />
      )}
    </div>
  </div>
);

export default Users;