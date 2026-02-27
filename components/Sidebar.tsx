import React from 'react';
import { Users, LogOut, Network, Zap } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  language: 'en' | 'zh';
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onLogout, language }) => {
  const translations = {
    en: {
      adCreator: 'Ad Creator',
      mediaConfig: 'Media Config',
      users: 'Users & Roles',
      signOut: 'Sign Out'
    },
    zh: {
      adCreator: '广告创编',
      mediaConfig: '媒体配置',
      users: '用户权限',
      signOut: '退出登录'
    }
  };

  const t = translations[language];

  const menuItems = [
    { id: 'ad-creator', label: t.adCreator, icon: Zap },
    { id: 'media-config', label: t.mediaConfig, icon: Network },
    { id: 'users', label: t.users, icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="p-6 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-8 bg-tiktok-black rounded-md flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-tiktok-cyan via-transparent to-tiktok-magenta opacity-50"></div>
             <span className="text-white font-bold text-xl relative z-10">T</span>
        </div>
        <span className="font-bold text-xl tracking-tight">AdsManager</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-tiktok-gray text-tiktok-black'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-tiktok-magenta' : 'text-gray-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          {t.signOut}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;