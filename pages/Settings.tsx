import React, { useState } from 'react';
import { Settings as SettingsIcon, Menu, Eye, EyeOff } from 'lucide-react';

const Settings: React.FC = () => {
  // Mock menu configuration state
  const [menuConfig, setMenuConfig] = useState([
    { id: 'ad-creator', label: 'Ad Creator', roles: ['ADMIN', 'EDITOR'] },
    { id: 'media-config', label: 'Media Config', roles: ['ADMIN'] },
    { id: 'users', label: 'Users & Roles', roles: ['ADMIN'] },
  ]);

  const toggleMenuVisibility = (menuId: string, role: string) => {
    setMenuConfig(prev => prev.map(item => {
      if (item.id === menuId) {
        const hasRole = item.roles.includes(role);
        return {
          ...item,
          roles: hasRole 
            ? item.roles.filter(r => r !== role)
            : [...item.roles, role]
        };
      }
      return item;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-500 mt-1">Configure global application preferences and interface options.</p>
      </div>
      
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl flex items-start gap-4 mb-8">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-gray-400">
              <Menu size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Navigation Visibility</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-lg">
                Control which menu items are visible to specific user roles. This allows you to simplify the interface for Viewers or Editors by hiding irrelevant tools.
              </p>
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Menu Item</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-center w-32">ADMIN</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-center w-32">EDITOR</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-center w-32">VIEWER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menuConfig.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                       {item.label}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleMenuVisibility(item.id, 'ADMIN')}
                        className={`p-2 rounded-lg transition-all ${item.roles.includes('ADMIN') ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {item.roles.includes('ADMIN') ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                        onClick={() => toggleMenuVisibility(item.id, 'EDITOR')}
                        className={`p-2 rounded-lg transition-all ${item.roles.includes('EDITOR') ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {item.roles.includes('EDITOR') ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                        onClick={() => toggleMenuVisibility(item.id, 'VIEWER')}
                        className={`p-2 rounded-lg transition-all ${item.roles.includes('VIEWER') ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {item.roles.includes('VIEWER') ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        
        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-lg">
            <SettingsIcon size={16} />
            Save System Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;