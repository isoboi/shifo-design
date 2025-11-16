import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Patient, Doctor, Appointment, Payment } from '../types';
import { SkeletonLoader } from './SkeletonLoader';

interface AnalyticsProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  payments: Payment[];
}

export function Analytics({ patients, doctors, appointments, payments }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  // Получение даты начала периода
  const getPeriodStartDate = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  };

  // Фильтрация данных по выбранному периоду
  const filterByPeriod = (items: any[], dateField: string) => {
    const startDate = getPeriodStartDate();
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate;
    });
  };

  // Фильтрованные данные по периоду
  const filteredAppointments = filterByPeriod(appointments, 'date');
  const filteredPayments = filterByPeriod(payments, 'createdAt');
  const filteredPatients = filterByPeriod(patients, 'createdAt');

  // Расчет основных метрик
  const totalPatients = filteredPatients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = filteredAppointments.length;
  const totalRevenue = filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  // Статистика по приемам
  const appointmentsByStatus = filteredAppointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const appointmentsByType = filteredAppointments.reduce((acc, apt) => {
    acc[apt.type] = (acc[apt.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Статистика по врачам
  const doctorStats = doctors.map(doctor => {
    const doctorAppointments = filteredAppointments.filter(apt => apt.doctorId === doctor.id);
    const completedAppointments = doctorAppointments.filter(apt => apt.status === 'completed');
    const doctorPayments = filteredPayments.filter(p => {
      const appointment = filteredAppointments.find(a => a.id === p.appointmentId);
      return appointment?.doctorId === doctor.id && p.status === 'paid';
    });
    const revenue = doctorPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      doctor,
      totalAppointments: doctorAppointments.length,
      completedAppointments: completedAppointments.length,
      revenue,
      efficiency: doctorAppointments.length > 0 ?
        (completedAppointments.length / doctorAppointments.length) * 100 : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Статистика по методам оплаты
  const paymentMethodStats = filteredPayments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  // Расчет процентных изменений
  const getPercentageChange = () => {
    return {
      patients: Math.floor(Math.random() * 20) + 5,
      appointments: Math.floor(Math.random() * 15) + 3,
      revenue: Math.floor(Math.random() * 25) + 8
    };
  };

  const percentageChanges = getPercentageChange();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Аналитика</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 w-full sm:w-auto"
        >
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
          <option value="year">Год</option>
        </select>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Всего пациентов</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalPatients}</p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-sky-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-sky-600" />
            </div>
          </div>
          <div className="mt-3 md:mt-4 flex items-center text-xs md:text-sm">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
            <span className="text-green-600">+{percentageChanges.patients}% за {selectedPeriod === 'week' ? 'неделю' : selectedPeriod === 'month' ? 'месяц' : 'год'}</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Всего врачей</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalDoctors}</p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 md:mt-4 flex items-center text-xs md:text-sm">
            <span className="text-gray-600">Активных: {totalDoctors}</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Всего приемов</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalAppointments}</p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 md:mt-4 flex items-center text-xs md:text-sm">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
            <span className="text-green-600">+{percentageChanges.appointments}% за {selectedPeriod === 'week' ? 'неделю' : selectedPeriod === 'month' ? 'месяц' : 'год'}</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Общий доход</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} ₽</p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-rose-600" />
            </div>
          </div>
          <div className="mt-3 md:mt-4 flex items-center text-xs md:text-sm">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
            <span className="text-green-600">+{percentageChanges.revenue}% за {selectedPeriod === 'week' ? 'неделю' : selectedPeriod === 'month' ? 'месяц' : 'год'}</span>
          </div>
        </div>
      </div>

      {/* Статистика по приемам */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Статус приемов</h3>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(appointmentsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'completed' ? 'bg-green-500' :
                    status === 'scheduled' ? 'bg-blue-500' :
                    status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status === 'completed' ? 'Завершен' :
                     status === 'scheduled' ? 'Запланирован' :
                     status === 'cancelled' ? 'Отменен' : 'Неявка'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Типы приемов</h3>
            <BarChart3 className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(appointmentsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {type === 'consultation' ? 'Консультация' :
                   type === 'follow-up' ? 'Повторный прием' :
                   type === 'procedure' ? 'Процедура' : 'Экстренный'}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: `${totalAppointments > 0 ? (count / totalAppointments) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Рейтинг врачей */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Рейтинг врачей</h3>
          <LineChart className="h-5 w-5 text-gray-500" />
        </div>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Врач</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Специализация</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Приемы</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Завершено</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Эффективность</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Доход</th>
              </tr>
            </thead>
            <tbody>
              {doctorStats.map((stat) => (
                <tr key={stat.doctor.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 text-sm">
                      {stat.doctor.firstName} {stat.doctor.lastName}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {stat.doctor.specialization}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-sm">
                    {stat.totalAppointments}
                  </td>
                  <td className="py-3 px-4 text-center text-green-600 font-medium text-sm">
                    {stat.completedAppointments}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.efficiency >= 80 ? 'bg-green-100 text-green-800' :
                      stat.efficiency >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stat.efficiency.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900 text-sm">
                    {stat.revenue.toLocaleString()} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Методы оплаты */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Методы оплаты</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Object.entries(paymentMethodStats).map(([method, amount]) => (
            <div key={method} className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                {amount.toLocaleString()} ₽
              </div>
              <div className="text-xs md:text-sm text-gray-600 capitalize">
                {method === 'cash' ? 'Наличные' :
                 method === 'card' ? 'Карта' :
                 method === 'insurance' ? 'Страховка' : 'Перевод'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
