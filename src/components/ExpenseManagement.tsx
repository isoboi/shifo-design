import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, DollarSign, CreditCard, Calendar, Filter, TrendingDown } from 'lucide-react';
import { Expense } from '../types';
import { Modal } from './Modal';

interface ExpenseManagementProps {
  expenses: Expense[];
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

const paymentMethodLabels: Record<Expense['paymentMethod'], string> = {
  cash: 'Наличные',
  card: 'Карта',
  transfer: 'Перевод'
};

export function ExpenseManagement({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }: ExpenseManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'createdAt'>>({
    amount: 0,
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    recipient: '',
    notes: ''
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.recipient && expense.recipient.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddExpense = () => {
    if (newExpense.amount <= 0 || !newExpense.description) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    onAddExpense(newExpense);
    setShowAddModal(false);
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

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Управление тратами</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Добавить трату
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего трат</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{totalExpenses.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Количество</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{filteredExpenses.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Средняя сумма</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {filteredExpenses.length > 0 ? Math.round(totalExpenses / filteredExpenses.length).toLocaleString('ru-RU') : 0} ₽
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Категорий</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{Object.keys(expensesByCategory).length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Filter className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск по описанию или получателю..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">Все категории</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

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
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center text-xs text-gray-600">
                        {paymentMethodLabels[expense.paymentMethod]}
                      </span>
                    </td>
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
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Добавить трату" size="lg">
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
              Добавить трату
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

      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Редактировать трату" size="lg">
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
