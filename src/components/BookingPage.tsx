import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Building2, User, Phone, Mail, ArrowLeft } from 'lucide-react';

interface BookingPageProps {
  onBack: () => void;
}

export function BookingPage({ onBack }: BookingPageProps) {
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const clinics = [
    { id: '1', name: 'Центральная Городская Больница', address: 'ул. Ленина, 45' },
    { id: '2', name: 'Клиника "Здоровье+"', address: 'пр. Мира, 12' },
    { id: '3', name: 'Медицинский Центр "Семейный"', address: 'ул. Пушкина, 78' },
    { id: '4', name: 'Поликлиника №1', address: 'ул. Гагарина, 23' }
  ];

  const getCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }
    return week;
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
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Заявка отправлена!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Мы свяжемся с вами в ближайшее время для подтверждения записи
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Детали записи:</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Клиника:</span> {clinics.find(c => c.id === selectedClinic)?.name}</p>
                <p><span className="font-medium">Дата:</span> {selectedDate}</p>
                <p><span className="font-medium">Время:</span> {selectedTime}</p>
                <p><span className="font-medium">Имя:</span> {formData.name}</p>
                <p><span className="font-medium">Телефон:</span> {formData.phone}</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Назад</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Онлайн запись</h1>
            <p className="text-sky-100 text-lg">Выберите удобное время для посещения</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                <Building2 className="h-5 w-5 text-sky-600" />
                <span>Выберите клинику</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clinics.map((clinic) => (
                  <button
                    key={clinic.id}
                    type="button"
                    onClick={() => setSelectedClinic(clinic.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedClinic === clinic.id
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-gray-200 hover:border-sky-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{clinic.name}</div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{clinic.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                <Calendar className="h-5 w-5 text-sky-600" />
                <span>Выберите день</span>
              </label>
              <div className="grid grid-cols-7 gap-2 md:gap-3">
                {weekDays.map((day, index) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => !isPast && setSelectedDate(dateStr)}
                      disabled={isPast}
                      className={`p-3 md:p-4 rounded-xl border-2 text-center transition-all ${
                        isPast
                          ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : selectedDate === dateStr
                          ? 'border-sky-600 bg-sky-50'
                          : 'border-gray-200 hover:border-sky-300'
                      }`}
                    >
                      <div className={`text-xs md:text-sm font-medium mb-1 ${
                        isPast ? 'text-gray-400' : isToday(day) ? 'text-sky-600' : 'text-gray-600'
                      }`}>
                        {getDayName(day)}
                      </div>
                      <div className={`text-base md:text-lg font-bold ${
                        isPast ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {formatDate(day)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                <Clock className="h-5 w-5 text-sky-600" />
                <span>Выберите время</span>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      !selectedDate
                        ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : selectedTime === time
                        ? 'border-sky-600 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-sky-300 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ваши контактные данные</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4" />
                    <span>Ваше имя *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4" />
                    <span>Телефон *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4" />
                    <span>Email (необязательно)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Примечания (необязательно)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                    placeholder="Дополнительная информация..."
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-8 py-4 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-semibold text-lg shadow-lg shadow-sky-200"
              >
                Отправить заявку
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
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
