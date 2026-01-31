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
  Languages,
  X,
  Clipboard
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  isSidebarOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Панель управления', icon: Home },
  { id: 'patients', label: 'Пациенты', icon: Users },
  { id: 'doctors', label: 'Врачи', icon: UserCheck },
  { id: 'appointments', label: 'Записи', icon: Calendar },
  { id: 'finances', label: 'Финансы', icon: CreditCard },
  { id: 'laboratory', label: 'Лаборатория', icon: Clipboard },
  { id: 'analytics', label: 'Аналитика', icon: Activity },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, language, onLanguageChange, isSidebarOpen, onClose }: SidebarProps) {
  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div className={`bg-white h-screen w-64 shadow-lg flex flex-col fixed lg:static z-50 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
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

      <div className="p-4 border-t border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Languages className="text-gray-600" size={18} />
            <span className="text-sm font-medium text-gray-700">Язык</span>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                language === 'ru'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                language === 'en'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>

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
    </>
  );
}