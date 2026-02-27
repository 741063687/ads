import React from 'react';
import { Bell, Search, Languages } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  title: string;
  language: 'en' | 'zh';
  onToggleLanguage: () => void;
}

const TITLE_MAP: Record<string, { en: string; zh: string }> = {
  'ad-creator': { en: 'Ad Creator', zh: '广告创编' },
  'media-config': { en: 'Media Config', zh: '媒体配置' },
  'users': { en: 'Users & Roles', zh: '用户权限' },
};

const Header: React.FC<HeaderProps> = ({ user, title, language, onToggleLanguage }) => {
  const displayTitle = TITLE_MAP[title] ? TITLE_MAP[title][language] : title.replace('-', ' ');

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <h1 className="text-xl font-semibold text-gray-800 capitalize">{displayTitle}</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={language === 'en' ? "Search..." : "搜索..."}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-tiktok-cyan/50 w-64"
          />
        </div>

        <button 
          onClick={onToggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600 border border-transparent hover:border-gray-200"
        >
          <Languages size={18} />
          <span>{language === 'en' ? 'EN' : '中文'}</span>
        </button>

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-tiktok-magenta rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-9 h-9 rounded-full border border-gray-200"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;