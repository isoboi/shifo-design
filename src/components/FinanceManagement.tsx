import React, { useState } from 'react';
import { CreditCard, DollarSign, Search, Filter, CheckCircle, XCircle, Clock, Receipt, Plus, TrendingDown, TrendingUp, Edit2, Trash2, Calendar } from 'lucide-react';
import { Payment, Appointment, Patient, Expense } from '../types';
import { Modal } from './Modal';

interface FinanceManagementProps {
  payments: Payment[];
  expenses: Expense[];
  appointments: Appointment[];
  patients: Patient[];
  onUpdatePayment: (id: string, payment: Partial<Payment>) => void;
  onAddPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdateExpense: (id: string, expense: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
}

const categoryLabels: Record<Expense['category'], string> = {
  salary: 'Зарплата',
  equipment: 'Оборудование',
  supplies: 'Расходные материалы',
  utilities: 'Коммунальные услуги',
  rent: 'Аренда',
  maintenance: 'Обслуживание',
  other: 'Прочее'
};

const paymentMethodLabels: Record<'cash' | 'card' | 'transfer' | 'insurance', string> = {
  cash: 'Наличные',
  card: 'Карта',
  transfer: 'Перевод',
  insurance: 'Страховка'
};

export function FinanceManagement({
  payments,
  expenses,
  appointments,
  patients,
  onUpdatePayment,
  onAddPayment,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense
}: FinanceManagementProps) {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [newPayment, setNewPayment] = useState({
    patientId: '',
    appointmentId: '',
    amount: 0,
    method: 'cash' as const,
    status: 'pending' as const,
    paymentType: 'regular' as const,
    notes: ''
  });

  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'createdAt'>>({
    amount: 0,
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    recipient: '',
    notes: ''
  });

  const filteredPayments = payments.filter(payment => {
    const patient = patients.find(p => p.id === payment.patientId);
    const matchesSearch =
      patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    const matchesType = typeFilter === 'all' || payment.paymentType === typeFilter;
    return matchesSearch && matchesStatus && matchesMethod && matchesType;
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.recipient && expense.recipient.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddPayment = () => {
    if (!newPayment.patientId || newPayment.amount <= 0) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    onAddPayment(newPayment);
    setShowAddPaymentModal(false);
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

  const handleAddExpense = () => {
    if (newExpense.amount <= 0 || !newExpense.description) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    onAddExpense(newExpense);
    setShowAddExpenseModal(false);
    setNewExpense({
      amount: 0,
      category: 'other',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      recipient: '',
      notes: ''
    });
  };

  const handleUpdateExpense = () => {
    if (editingExpense && editingExpense.amount > 0 && editingExpense.description) {
      onUpdateExpense(editingExpense.id, editingExpense);
      setEditingExpense(null);
    }
  };

  const totalIncome = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Управление финансами</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Добавить доход
          </button>
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Добавить расход
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Доходы</p>
              <p className="text-2xl font-bold text-green-600 mt-1">+{totalIncome.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Расходы</p>
              <p className="text-2xl font-bold text-red-600 mt-1">-{totalExpenses.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Чистая прибыль</p>
              <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className={`${netProfit >= 0 ? 'bg-blue-100' : 'bg-orange-100'} p-3 rounded-lg`}>
              <DollarSign className={netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'} size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('income')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'income'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Доходы ({filteredPayments.length})
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'expenses'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Расходы ({filteredExpenses.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={activeTab === 'income' ? 'Поиск по пациенту...' : 'Поиск по описанию...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            {activeTab === 'income' ? (
              <div className="flex space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"
                >
                  <option value="all">Все статусы</option>
                  <option value="paid">Оплачено</option>
                  <option value="pending">Ожидает</option>
                  <option value="failed">Ошибка</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"
                >
                  <option value="all">Все типы</option>
                  <option value="regular">Обычная</option>
                  <option value="debt">Долг</option>
                  <option value="prepayment">Предоплата</option>
                </select>
              </div>
            ) : (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"
              >
                <option value="all">Все категории</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            )}
          </div>

          {activeTab === 'income' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Дата</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Пациент</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Тип</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Способ оплаты</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Статус</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        Платежи не найдены
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => {
                      const patient = patients.find(p => p.id === payment.patientId);
                      return (
                        <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {new Date(payment.createdAt).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {patient ? `${patient.firstName} ${patient.lastName}` : 'Неизвестно'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {payment.paymentType === 'regular' ? 'Обычная' : payment.paymentType === 'debt' ? 'Долг' : 'Предоплата'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{paymentMethodLabels[payment.method]}</td>
                          <td className="py-3 px-4">
                            {payment.status === 'paid' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle size={12} className="mr-1" />
                                Оплачено
                              </span>
                            )}
                            {payment.status === 'pending' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock size={12} className="mr-1" />
                                Ожидает
                              </span>
                            )}
                            {payment.status === 'failed' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle size={12} className="mr-1" />
                                Ошибка
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-semibold text-green-600">+{payment.amount.toLocaleString('ru-RU')} ₽</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Дата</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Категория</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Описание</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Получатель</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Способ оплаты</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Сумма</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        Траты не найдены
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {new Date(expense.date).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {categoryLabels[expense.category]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{expense.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{expense.recipient || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{paymentMethodLabels[expense.paymentMethod]}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-semibold text-red-600">-{expense.amount.toLocaleString('ru-RU')} ₽</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingExpense(expense)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Вы уверены, что хотите удалить эту трату?')) {
                                  onDeleteExpense(expense.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showAddPaymentModal} onClose={() => setShowAddPaymentModal(false)} title="Добавить доход" size="lg">
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
                  .map(appointment => (
                    <option key={appointment.id} value={appointment.id}>
                      {new Date(appointment.date).toLocaleDateString('ru-RU')} - {appointment.time}
                    </option>
                  ))}
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
              Добавить доход
            </button>
            <button
              onClick={() => setShowAddPaymentModal(false)}
              className="flex-1 bg-white text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-300 font-medium text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAddExpenseModal} onClose={() => setShowAddExpenseModal(false)} title="Добавить расход" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата *</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Сумма *</label>
              <div className="relative">
                <input
                  type="number"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₽</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория *</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as Expense['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Способ оплаты *</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewExpense({ ...newExpense, paymentMethod: 'cash' })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    newExpense.paymentMethod === 'cash'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Наличные
                </button>
                <button
                  type="button"
                  onClick={() => setNewExpense({ ...newExpense, paymentMethod: 'card' })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    newExpense.paymentMethod === 'card'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Карта
                </button>
                <button
                  type="button"
                  onClick={() => setNewExpense({ ...newExpense, paymentMethod: 'transfer' })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    newExpense.paymentMethod === 'transfer'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Перевод
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание *</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
              placeholder="Краткое описание траты"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Получатель</label>
            <input
              type="text"
              value={newExpense.recipient}
              onChange={(e) => setNewExpense({ ...newExpense, recipient: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
              placeholder="Кому произведена оплата"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Примечания</label>
            <textarea
              value={newExpense.notes}
              onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all resize-none text-sm"
              rows={2}
              placeholder="Дополнительная информация..."
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleAddExpense}
              className="flex-1 bg-sky-600 text-white py-2.5 px-4 rounded-lg hover:bg-sky-700 transition-all shadow-sm hover:shadow font-medium text-sm"
            >
              Добавить расход
            </button>
            <button
              onClick={() => setShowAddExpenseModal(false)}
              className="flex-1 bg-white text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-300 font-medium text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Редактировать расход" size="lg">
        {editingExpense && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата *</label>
                <input
                  type="date"
                  value={editingExpense.date}
                  onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Сумма *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={editingExpense.amount || ''}
                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                    required
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₽</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория *</label>
                <select
                  value={editingExpense.category}
                  onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value as Expense['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Способ оплаты *</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingExpense({ ...editingExpense, paymentMethod: 'cash' })}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      editingExpense.paymentMethod === 'cash'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Наличные
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingExpense({ ...editingExpense, paymentMethod: 'card' })}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      editingExpense.paymentMethod === 'card'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Карта
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingExpense({ ...editingExpense, paymentMethod: 'transfer' })}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      editingExpense.paymentMethod === 'transfer'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Перевод
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание *</label>
              <input
                type="text"
                value={editingExpense.description}
                onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Получатель</label>
              <input
                type="text"
                value={editingExpense.recipient}
                onChange={(e) => setEditingExpense({ ...editingExpense, recipient: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Примечания</label>
              <textarea
                value={editingExpense.notes}
                onChange={(e) => setEditingExpense({ ...editingExpense, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all resize-none text-sm"
                rows={2}
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleUpdateExpense}
                className="flex-1 bg-sky-600 text-white py-2.5 px-4 rounded-lg hover:bg-sky-700 transition-all shadow-sm hover:shadow font-medium text-sm"
              >
                Сохранить изменения
              </button>
              <button
                onClick={() => setEditingExpense(null)}
                className="flex-1 bg-white text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-300 font-medium text-sm"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
