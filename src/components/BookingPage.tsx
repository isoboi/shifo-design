import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Building2, User, Phone, Mail, ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingPageProps {
  onBack: () => void;
}

export function BookingPage({ onBack }: BookingPageProps) {
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const clinics = [
    { id: '1', name: 'Центральная Городская Больница', address: 'ул. Ленина, 45', city: 'Ташкент' },
    { id: '2', name: 'Клиника "Здоровье+"', address: 'пр. Мира, 12', city: 'Ташкент' },
    { id: '3', name: 'Медицинский Центр "Семейный"', address: 'ул. Пушкина, 78', city: 'Ташкент' },
    { id: '4', name: 'Поликлиника №1', address: 'ул. Гагарина, 23', city: 'Ташкент' },
    { id: '5', name: 'Детская поликлиника №2', address: 'ул. Амира Темура, 56', city: 'Ташкент' },
    { id: '6', name: 'Клиника "МедЦентр"', address: 'ул. Бабура, 89', city: 'Ташкент' },
    { id: '7', name: 'Больница им. Ибн Сины', address: 'пр. Узбекистана, 34', city: 'Ташкент' },
    { id: '8', name: 'Стоматологическая клиника "Дент+"', address: 'ул. Навои, 12', city: 'Ташкент' },
    { id: '9', name: 'Многопрофильная клиника "Здравица"', address: 'ул. Шота Руставели, 45', city: 'Ташкент' },
    { id: '10', name: 'Медицинский центр "Эталон"', address: 'пр. Бунёдкор, 67', city: 'Ташкент' }
  ];

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    monday.setDate(monday.getDate() + (currentWeekOffset * 7));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const goToPreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  const getWeekRange = () => {
    const week = getCurrentWeek();
    const start = week[0];
    const end = week[6];
    return `${start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const weekDays = getCurrentWeek();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClinic || !selectedDate || !selectedTime) {
      alert('Пожалуйста, выберите клинику, дату и время');
      return;
    }

    if (!formData.name || !formData.phone) {
      alert('Пожалуйста, заполните имя и телефон');
      return;
    }

    const selectedClinicData = clinics.find(c => c.id === selectedClinic);

    console.log('Booking submitted:', {
      clinic: selectedClinicData,
      date: selectedDate,
      time: selectedTime,
      ...formData
    });

    setIsSubmitted(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-8 md:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Заявка отправлена!</h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              Мы свяжемся с вами в ближайшее время для подтверждения записи
            </p>
            <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 text-left">
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-3 md:mb-4">Детали записи:</h3>
              <div className="space-y-2 text-sm md:text-base text-gray-600">
                <p><span className="font-medium">Клиника:</span> {clinics.find(c => c.id === selectedClinic)?.name}</p>
                <p><span className="font-medium">Дата:</span> {selectedDate}</p>
                <p><span className="font-medium">Время:</span> {selectedTime}</p>
                <p><span className="font-medium">Имя:</span> {formData.name}</p>
                <p><span className="font-medium">Телефон:</span> {formData.phone}</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 md:px-8 py-3 bg-sky-600 text-white rounded-lg md:rounded-xl hover:bg-sky-700 active:bg-sky-800 transition-colors font-medium text-sm md:text-base"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-4 md:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 md:mb-6 transition-colors text-sm md:text-base"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          <span>Назад</span>
        </button>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-6 md:px-8 py-6 md:py-10">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Онлайн запись</h1>
            <p className="text-sky-100 text-sm md:text-lg">Выберите удобное время для посещения</p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div>
              <label className="flex items-center space-x-2 text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                <Building2 className="h-4 w-4 md:h-5 md:w-5 text-sky-600" />
                <span>Выберите клинику</span>
              </label>

              <div className="relative mb-3 md:mb-4">
                <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск клиники..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="border border-gray-200 rounded-lg md:rounded-xl max-h-56 md:max-h-64 overflow-y-auto">
                {filteredClinics.length === 0 ? (
                  <div className="p-4 md:p-6 text-center text-sm md:text-base text-gray-500">
                    Клиники не найдены
                  </div>
                ) : (
                  filteredClinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      type="button"
                      onClick={() => {
                        setSelectedClinic(clinic.id);
                        setSearchQuery('');
                      }}
                      className={`w-full p-3 md:p-4 text-left transition-all border-b border-gray-100 last:border-b-0 ${
                        selectedClinic === clinic.id
                          ? 'bg-sky-50 border-l-4 border-l-sky-600'
                          : 'hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold text-sm md:text-base text-gray-900 mb-1">{clinic.name}</div>
                      <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-600">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span>{clinic.address}, {clinic.city}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {selectedClinic && (
                <div className="mt-3 md:mt-4 p-3 md:p-4 bg-sky-50 border border-sky-200 rounded-lg md:rounded-xl">
                  <div className="flex items-start space-x-2">
                    <Building2 className="h-4 w-4 md:h-5 md:w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm md:text-base text-sky-900">
                        {clinics.find(c => c.id === selectedClinic)?.name}
                      </div>
                      <div className="text-xs md:text-sm text-sky-700">
                        {clinics.find(c => c.id === selectedClinic)?.address}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-3">
                <label className="flex items-center space-x-2 text-base md:text-lg font-semibold text-gray-900">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-sky-600" />
                  <span>Выберите день</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousWeek}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    title="Предыдущая неделя"
                  >
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                  </button>

                  <div className="text-xs md:text-sm font-medium text-gray-700 min-w-[140px] md:min-w-[160px] text-center">
                    {getWeekRange()}
                  </div>

                  <button
                    type="button"
                    onClick={goToNextWeek}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    title="Следующая неделя"
                  >
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                  </button>

                  {currentWeekOffset !== 0 && (
                    <button
                      type="button"
                      onClick={goToCurrentWeek}
                      className="ml-2 px-3 py-1.5 text-xs md:text-sm bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors font-medium"
                    >
                      Сегодня
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-3">
                {weekDays.map((day, index) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => !isPast && setSelectedDate(dateStr)}
                      disabled={isPast}
                      className={`p-1.5 sm:p-2 md:p-4 rounded-md md:rounded-xl border-2 text-center transition-all min-h-[60px] sm:min-h-[70px] md:min-h-0 flex flex-col justify-center ${
                        isPast
                          ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : selectedDate === dateStr
                          ? 'border-sky-600 bg-sky-50 shadow-sm'
                          : 'border-gray-200 hover:border-sky-300 active:bg-sky-50 active:border-sky-400'
                      }`}
                    >
                      <div className={`text-[9px] sm:text-[10px] md:text-sm font-medium mb-0.5 sm:mb-1 uppercase ${
                        isPast ? 'text-gray-400' : isToday(day) ? 'text-sky-600 font-semibold' : 'text-gray-600'
                      }`}>
                        {getDayName(day)}
                      </div>
                      <div className={`text-xs sm:text-sm md:text-lg font-bold leading-tight ${
                        isPast ? 'text-gray-400' : selectedDate === dateStr ? 'text-sky-700' : 'text-gray-900'
                      }`}>
                        {formatDate(day)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-sky-600" />
                <span>Выберите время</span>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                    className={`py-2.5 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl border-2 font-medium text-sm md:text-base transition-all ${
                      !selectedDate
                        ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : selectedTime === time
                        ? 'border-sky-600 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-sky-300 active:bg-sky-50 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 md:pt-8">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Ваши контактные данные</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-xs md:text-sm font-medium text-gray-700 mb-2">
                    <User className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Ваше имя *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-xs md:text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Телефон *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-xs md:text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Email (необязательно)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Примечания (необязательно)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={1}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                    placeholder="Дополнительная информация..."
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
              <button
                type="submit"
                className="flex-1 px-6 md:px-8 py-3 md:py-4 bg-sky-600 text-white rounded-lg md:rounded-xl hover:bg-sky-700 active:bg-sky-800 transition-colors font-semibold text-base md:text-lg shadow-lg shadow-sky-200"
              >
                Отправить заявку
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-6 md:px-8 py-3 md:py-4 border-2 border-gray-300 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors font-semibold text-base md:text-base"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
