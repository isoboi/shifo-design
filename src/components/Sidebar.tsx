import React from 'react';
import {
  Home,
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  Settings,
  Activity,
  TrendingDown,
  Languages
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language?: 'ru' | 'en';
  onLanguageChange?: (lang: 'ru' | 'en') => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Панель управления', icon: Home },
  { id: 'patients', label: 'Пациенты', icon: Users },
  { id: 'doctors', label: 'Врачи', icon: UserCheck },
  { id: 'appointments', label: 'Записи', icon: Calendar },
  { id: 'finances', label: 'Финансы', icon: CreditCard },
  { id: 'analytics', label: 'Аналитика', icon: Activity },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, language = 'ru', onLanguageChange }: SidebarProps) {
  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          МедКлиника
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Система управления
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                isActive
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {onLanguageChange && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <Languages size={18} />
              <span className="text-sm font-medium">Language</span>
            </div>
            <div className="flex bg-white rounded-md shadow-sm">
              <button
                onClick={() => onLanguageChange('ru')}
                className={`px-3 py-1.5 text-xs font-medium rounded-l-md transition-colors ${
                  language === 'ru'
                    ? 'bg-sky-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 text-xs font-medium rounded-r-md transition-colors ${
                  language === 'en'
                    ? 'bg-sky-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">АД</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">Администратор</p>
            <p className="text-sm text-gray-500">admin@clinic.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}