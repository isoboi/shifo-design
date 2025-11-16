import React, { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Clock,
  Shield,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  Zap,
  Heart,
  Activity,
  Mail,
  Phone,
  MapPin,
  Send,
  Languages
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface LandingProps {
  onGetStarted: () => void;
}

export function Landing({ onGetStarted }: LandingProps) {
  const [language, setLanguage] = useLocalStorage<'ru' | 'en'>('landing-language', 'ru');

  const translations = {
    ru: {
      loginButton: 'Войти в систему',
      modernSystem: 'Современная система управления',
      heroTitle: 'Цифровое будущее вашей клиники',
      heroDescription: 'Полнофункциональная система для управления медицинской клиникой. Управляйте пациентами, врачами, записями и финансами в одном месте.',
      getStarted: 'Начать работу',
      learnMore: 'Узнать больше',
      todayAppointments: 'Приема сегодня',
      patients: 'Пациентов',
      availability: 'Доступность системы',
      dataSecurity: 'Безопасность данных',
      speed: 'Скорость работы',
      unlimited: 'Пациентов в базе',
      allTools: 'Все инструменты в одной системе',
      allToolsDesc: 'Комплексное решение для эффективного управления медицинской клиникой любого размера',
      whyChoose: 'Почему выбирают Shifo?',
      whyChooseDesc: 'Современная система, созданная с учетом потребностей медицинских учреждений',
      securityTitle: 'Безопасность данных',
      securityDesc: 'Все данные пациентов надежно защищены и хранятся в соответствии с международными стандартами безопасности медицинской информации.',
      encryption: 'Шифрование данных',
      backups: 'Регулярные резервные копии',
      accessControl: 'Контроль доступа',
      contactUs: 'Свяжитесь с нами',
      contactDesc: 'Остались вопросы? Мы всегда готовы помочь',
      sendMessage: 'Отправить сообщение',
      name: 'Имя',
      yourName: 'Ваше имя',
      phone: 'Телефон',
      message: 'Сообщение',
      messagePlaceholder: 'Расскажите о вашей клинике и потребностях...',
      send: 'Отправить сообщение',
      contactInfo: 'Контактная информация',
      address: 'Адрес',
      addressText: 'г. Ташкент, Мирабадский район,\nул. Амира Темура, 107',
      workingHours: 'Пн-Пт: 9:00 - 18:00',
      footerDesc: 'Современная система управления медицинской клиникой',
      rights: 'Все права защищены',
      features: [
        { title: 'Управление пациентами', desc: 'Полная база данных пациентов с историей болезней, контактами и важной медицинской информацией' },
        { title: 'База врачей', desc: 'Управление персоналом клиники: специализации, расписание, тарифы и опыт работы' },
        { title: 'Запись на прием', desc: 'Интеллектуальная система записи с автоматической проверкой конфликтов и доступности' },
        { title: 'Финансовый учет', desc: 'Полный контроль платежей, расходов и финансовой отчетности клиники' },
        { title: 'Аналитика', desc: 'Детальная статистика работы клиники: посещаемость, доходы, популярные услуги' },
        { title: 'Расписание', desc: 'Визуализация расписания врачей с возможностью планирования на месяцы вперед' }
      ],
      benefits: [
        'Автоматизация рутинных процессов',
        'Снижение ошибок при записи',
        'Повышение качества обслуживания',
        'Прозрачная финансовая отчетность',
        'Быстрый доступ к данным пациентов',
        'Оптимизация загрузки врачей'
      ]
    },
    en: {
      loginButton: 'Login to System',
      modernSystem: 'Modern Management System',
      heroTitle: 'Digital Future of Your Clinic',
      heroDescription: 'Full-featured system for managing medical clinics. Manage patients, doctors, appointments and finances in one place.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      todayAppointments: 'Appointments Today',
      patients: 'Patients',
      availability: 'System Availability',
      dataSecurity: 'Data Security',
      speed: 'Performance',
      unlimited: 'Patients in Database',
      allTools: 'All Tools in One System',
      allToolsDesc: 'Comprehensive solution for effective management of medical clinics of any size',
      whyChoose: 'Why Choose Shifo?',
      whyChooseDesc: 'Modern system designed with the needs of medical facilities in mind',
      securityTitle: 'Data Security',
      securityDesc: 'All patient data is securely protected and stored in accordance with international medical information security standards.',
      encryption: 'Data Encryption',
      backups: 'Regular Backups',
      accessControl: 'Access Control',
      contactUs: 'Contact Us',
      contactDesc: 'Have questions? We are always ready to help',
      sendMessage: 'Send Message',
      name: 'Name',
      yourName: 'Your Name',
      phone: 'Phone',
      message: 'Message',
      messagePlaceholder: 'Tell us about your clinic and needs...',
      send: 'Send Message',
      contactInfo: 'Contact Information',
      address: 'Address',
      addressText: 'Tashkent, Mirabad District,\nAmir Temur Street, 107',
      workingHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
      footerDesc: 'Modern medical clinic management system',
      rights: 'All rights reserved',
      features: [
        { title: 'Patient Management', desc: 'Complete patient database with medical history, contacts and important medical information' },
        { title: 'Doctor Database', desc: 'Clinic staff management: specializations, schedules, rates and work experience' },
        { title: 'Appointment Booking', desc: 'Intelligent booking system with automatic conflict checking and availability' },
        { title: 'Financial Accounting', desc: 'Complete control of payments, expenses and clinic financial reporting' },
        { title: 'Analytics', desc: 'Detailed clinic statistics: attendance, revenue, popular services' },
        { title: 'Schedule', desc: 'Doctor schedule visualization with planning capability months ahead' }
      ],
      benefits: [
        'Automation of routine processes',
        'Reduction of appointment errors',
        'Improved service quality',
        'Transparent financial reporting',
        'Quick access to patient data',
        'Optimization of doctor workload'
      ]
    }
  };

  const t = translations[language];

  const featureIcons = [Users, Stethoscope, Calendar, DollarSign, BarChart3, Clock];

  const stats = [
    { value: '24/7', label: t.availability },
    { value: '100%', label: t.dataSecurity },
    { value: '<1 sec', label: t.speed },
    { value: '∞', label: t.unlimited }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Shifo</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    language === 'ru'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    language === 'en'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
              </div>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
              >
                {t.loginButton}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>{t.modernSystem}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {t.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-blue-700 transition-all font-semibold text-base md:text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>{t.getStarted}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="#contact"
                className="border-2 border-gray-300 text-gray-700 px-6 md:px-8 py-3 md:py-4 rounded-xl hover:border-gray-400 transition-colors font-semibold text-base md:text-lg inline-flex items-center justify-center"
              >
                {t.learnMore}
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-4 md:p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-24"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                    <div className="text-sm text-gray-600">{t.todayAppointments}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">156</div>
                    <div className="text-sm text-gray-600">{t.patients}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-300 rounded-full opacity-50 blur-2xl"></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.allTools}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t.allToolsDesc}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {t.features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-blue-600 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t.whyChoose}
              </h2>
              <p className="text-blue-100 text-base md:text-lg mb-8">
                {t.whyChooseDesc}
              </p>
              <div className="space-y-4">
                {t.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white text-base md:text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">{t.securityTitle}</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t.securityDesc}
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t.encryption}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t.backups}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t.accessControl}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.contactUs}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t.contactDesc}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t.sendMessage}</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.name}
                  </label>
                  <input
                    type="text"
                    placeholder={t.yourName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.phone}
                  </label>
                  <input
                    type="tel"
                    placeholder="+998 XX XXX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.message}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t.messagePlaceholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>{t.send}</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t.contactInfo}</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Email</div>
                    <a href="mailto:info@shifo.uz" className="text-blue-600 hover:underline">
                      info@shifo.uz
                    </a>
                    <br />
                    <a href="mailto:support@shifo.uz" className="text-blue-600 hover:underline">
                      support@shifo.uz
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{t.phone}</div>
                    <a href="tel:+998712345678" className="text-gray-600 hover:text-blue-600">
                      +998 71 234 56 78
                    </a>
                    <br />
                    <a href="tel:+998901234567" className="text-gray-600 hover:text-blue-600">
                      +998 90 123 45 67
                    </a>
                    <div className="text-sm text-gray-500 mt-1">
                      {t.workingHours}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{t.address}</div>
                    <p className="text-gray-600 whitespace-pre-line">
                      {t.addressText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">Shifo</span>
            </div>
            <p className="text-sm text-center">
              {t.footerDesc}
            </p>
            <p className="text-sm">&copy; 2025 Shifo. {t.rights}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
