import React, { useState } from 'react';
import { CreditCard, DollarSign, Search, Filter, CheckCircle, XCircle, Clock, Receipt, Plus } from 'lucide-react';
import { Payment, Appointment, Patient } from '../types';
import { Modal } from './Modal';

interface PaymentManagementProps {
  payments: Payment[];
  appointments: Appointment[];
  patients: Patient[];
  onUpdatePayment: (id: string, payment: Partial<Payment>) => void;
  onAddPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
}

export function PaymentManagement({
  payments,
  appointments,
  patients,
  onUpdatePayment,
  onAddPayment
}: PaymentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    patientId: '',
    appointmentId: '',
    amount: 0,
    method: 'cash' as const,
    status: 'pending' as const,
    paymentType: 'regular' as const,
    notes: ''
  });

  const filteredPayments = payments.filter(payment => {
    const patient = patients.find(p => p.id === payment.patientId);
    const appointment = appointments.find(a => a.id === payment.appointmentId);

    const matchesSearch =
      patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    const matchesType = typeFilter === 'all' || payment.paymentType === typeFilter;

    return matchesSearch && matchesStatus && matchesMethod && matchesType;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const debtAmount = payments
    .filter(p => p.paymentType === 'debt')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'failed': return <XCircle size={16} className="text-red-600" />;
      case 'refunded': return <Receipt size={16} className="text-gray-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard size={16} className="text-blue-600" />;
      case 'cash': return <DollarSign size={16} className="text-green-600" />;
      case 'insurance': return <Receipt size={16} className="text-purple-600" />;
      case 'transfer': return <CreditCard size={16} className="text-indigo-600" />;
      default: return <DollarSign size={16} className="text-gray-600" />;
    }
  };

  const handleStatusChange = (paymentId: string, newStatus: string) => {
    const updateData: Partial<Payment> = { status: newStatus as any };

    if (newStatus === 'paid' && !payments.find(p => p.id === paymentId)?.paidAt) {
      updateData.paidAt = new Date().toISOString();
    }

    onUpdatePayment(paymentId, updateData);
  };

  const handleAddPayment = () => {
    if (!newPayment.patientId || newPayment.amount <= 0) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    onAddPayment(newPayment);
    setShowAddModal(false);
    setNewPayment({
      patientId: '',
      appointmentId: '',
      amount: 0,
      method: 'cash',
      status: 'pending',
      paymentType: 'regular',
      notes: ''
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'debt': return 'В долг';
      case 'prepayment': return 'Предоплата';
      case 'regular': return 'Обычная оплата';
      default: return type;
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'debt': return 'text-red-600';
      case 'prepayment': return 'text-blue-600';
      case 'regular': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Управление платежами</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus size={20} />
          <span>Добавить платеж</span>
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общий доход</p>
              <p className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} ₽</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ожидает оплаты</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingAmount.toLocaleString()} ₽</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Долги</p>
              <p className="text-2xl font-bold text-red-600">{debtAmount.toLocaleString()} ₽</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск платежей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">Все статусы</option>
            <option value="paid">Оплачено</option>
            <option value="pending">Ожидает</option>
            <option value="failed">Неуспешно</option>
            <option value="refunded">Возврат</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">Все методы</option>
            <option value="cash">Наличные</option>
            <option value="card">Карта</option>
            <option value="insurance">Страховка</option>
            <option value="transfer">Перевод</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">Все типы</option>
            <option value="regular">Обычная</option>
            <option value="debt">Долг</option>
            <option value="prepayment">Предоплата</option>
          </select>
        </div>
      </div>

      {/* Список платежей */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Список платежей ({filteredPayments.length})</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Пациент</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Сумма</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Тип</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Метод</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Статус</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Дата</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const patient = patients.find(p => p.id === payment.patientId);
                  const appointment = appointments.find(a => a.id === payment.appointmentId);
                  
                  return (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {patient?.firstName} {patient?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{patient?.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {payment.amount.toLocaleString()} ₽
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${getPaymentTypeColor(payment.paymentType)}`}>
                          {getPaymentTypeLabel(payment.paymentType)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getMethodIcon(payment.method)}
                          <span className="capitalize">{payment.method}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {payment.status === 'paid' ? 'Оплачено' : 
                             payment.status === 'pending' ? 'Ожидает' :
                             payment.status === 'failed' ? 'Неуспешно' : 'Возврат'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">
                          {new Date(payment.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                        {payment.paidAt && (
                          <p className="text-xs text-green-600">
                            Оплачен: {new Date(payment.paidAt).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {payment.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(payment.id, 'paid')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Подтвердить
                            </button>
                            <button
                              onClick={() => handleStatusChange(payment.id, 'failed')}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Отклонить
                            </button>
                          </div>
                        )}
                        {payment.status === 'paid' && (
                          <button
                            onClick={() => handleStatusChange(payment.id, 'refunded')}
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                          >
                            Возврат
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Платежи не найдены
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно добавления платежа */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Добавить новый платеж" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Пациент *</label>
              <select
                value={newPayment.patientId}
                onChange={(e) => setNewPayment({ ...newPayment, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                required
              >
                <option value="">Выберите пациента</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Прием (необязательно)</label>
              <select
                value={newPayment.appointmentId}
                onChange={(e) => setNewPayment({ ...newPayment, appointmentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                disabled={!newPayment.patientId}
              >
                <option value="">Без привязки к приему</option>
                {appointments
                  .filter(apt => apt.patientId === newPayment.patientId)
                  .map(appointment => {
                    const doctor = patients.find(p => p.id === appointment.doctorId);
                    return (
                      <option key={appointment.id} value={appointment.id}>
                        {new Date(appointment.date).toLocaleDateString('ru-RU')} - {appointment.time}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Сумма *</label>
              <div className="relative">
                <input
                  type="number"
                  value={newPayment.amount || ''}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₽</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Тип платежа *</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, paymentType: 'regular' })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    newPayment.paymentType === 'regular'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Обычная
                </button>
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, paymentType: 'debt' })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    newPayment.paymentType === 'debt'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Долг
                </button>
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, paymentType: 'prepayment' })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    newPayment.paymentType === 'prepayment'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Предоплата
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Способ оплаты *</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, method: 'cash' })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1.5 ${
                    newPayment.method === 'cash'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <DollarSign size={14} />
                  <span>Наличные</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, method: 'card' })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1.5 ${
                    newPayment.method === 'card'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard size={14} />
                  <span>Карта</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, method: 'insurance' })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1.5 ${
                    newPayment.method === 'insurance'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Receipt size={14} />
                  <span>Страховка</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, method: 'transfer' })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1.5 ${
                    newPayment.method === 'transfer'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard size={14} />
                  <span>Перевод</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус *</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, status: 'pending' })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1.5 ${
                    newPayment.status === 'pending'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Clock size={14} />
                  <span>Ожидает</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewPayment({ ...newPayment, status: 'paid' })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1.5 ${
                    newPayment.status === 'paid'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CheckCircle size={14} />
                  <span>Оплачено</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Примечания</label>
            <textarea
              value={newPayment.notes}
              onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all resize-none text-sm"
              rows={2}
              placeholder="Дополнительная информация о платеже..."
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleAddPayment}
              className="flex-1 bg-sky-600 text-white py-2.5 px-4 rounded-lg hover:bg-sky-700 transition-all shadow-sm hover:shadow font-medium text-sm"
            >
              Добавить платеж
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 bg-white text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-300 font-medium text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}