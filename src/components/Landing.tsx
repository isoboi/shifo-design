import React from 'react';
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
  Send
} from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

export function Landing({ onGetStarted }: LandingProps) {
  const features = [
    {
      icon: Users,
      title: 'Управление пациентами',
      description: 'Полная база данных пациентов с историей болезней, контактами и важной медицинской информацией'
    },
    {
      icon: Stethoscope,
      title: 'База врачей',
      description: 'Управление персоналом клиники: специализации, расписание, тарифы и опыт работы'
    },
    {
      icon: Calendar,
      title: 'Запись на прием',
      description: 'Интеллектуальная система записи с автоматической проверкой конфликтов и доступности'
    },
    {
      icon: DollarSign,
      title: 'Финансовый учет',
      description: 'Полный контроль платежей, расходов и финансовой отчетности клиники'
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Детальная статистика работы клиники: посещаемость, доходы, популярные услуги'
    },
    {
      icon: Clock,
      title: 'Расписание',
      description: 'Визуализация расписания врачей с возможностью планирования на месяцы вперед'
    }
  ];

  const stats = [
    { value: '24/7', label: 'Доступность системы' },
    { value: '100%', label: 'Безопасность данных' },
    { value: '<1 сек', label: 'Скорость работы' },
    { value: '∞', label: 'Пациентов в базе' }
  ];

  const benefits = [
    'Автоматизация рутинных процессов',
    'Снижение ошибок при записи',
    'Повышение качества обслуживания',
    'Прозрачная финансовая отчетность',
    'Быстрый доступ к данным пациентов',
    'Оптимизация загрузки врачей'
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
            <button
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Войти в систему
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Современная система управления</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Цифровое будущее вашей клиники
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Полнофункциональная система для управления медицинской клиникой.
              Управляйте пациентами, врачами, записями и финансами в одном месте.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Начать работу</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="#contact"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 transition-colors font-semibold text-lg inline-flex items-center justify-center"
              >
                Узнать больше
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-24"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                    <div className="text-sm text-gray-600">Приема сегодня</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">156</div>
                    <div className="text-sm text-gray-600">Пациентов</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-300 rounded-full opacity-50 blur-2xl"></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Все инструменты в одной системе
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Комплексное решение для эффективного управления медицинской клиникой любого размера
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
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
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Почему выбирают Shifo?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Современная система, созданная с учетом потребностей медицинских учреждений
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Безопасность данных</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Все данные пациентов надежно защищены и хранятся в соответствии
                с международными стандартами безопасности медицинской информации.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Шифрование данных</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Регулярные резервные копии</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Контроль доступа</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Свяжитесь с нами
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Остались вопросы? Мы всегда готовы помочь
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Отправить сообщение</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    placeholder="Ваше имя"
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
                    Телефон
                  </label>
                  <input
                    type="tel"
                    placeholder="+998 XX XXX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Расскажите о вашей клинике и потребностях..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Отправить сообщение</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Контактная информация</h3>
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
                    <div className="font-semibold text-gray-900 mb-1">Телефон</div>
                    <a href="tel:+998712345678" className="text-gray-600 hover:text-blue-600">
                      +998 71 234 56 78
                    </a>
                    <br />
                    <a href="tel:+998901234567" className="text-gray-600 hover:text-blue-600">
                      +998 90 123 45 67
                    </a>
                    <div className="text-sm text-gray-500 mt-1">
                      Пн-Пт: 9:00 - 18:00
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Адрес</div>
                    <p className="text-gray-600">
                      г. Ташкент, Мирабадский район,<br />
                      ул. Амира Темура, 107
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-4">
                Готовы начать?
              </h3>
              <p className="text-blue-100 mb-6">
                Попробуйте систему прямо сейчас
              </p>
              <button
                onClick={onGetStarted}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold inline-flex items-center space-x-2 shadow-lg"
              >
                <span>Начать работу</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-bold text-white">Shifo</span>
              </div>
              <p className="text-sm">
                Современная система управления медицинской клиникой
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm">
                <li>Возможности</li>
                <li>Безопасность</li>
                <li>Интеграции</li>
                <li>Обновления</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm">
                <li>Документация</li>
                <li>Обучение</li>
                <li>Контакты</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Shifo. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
