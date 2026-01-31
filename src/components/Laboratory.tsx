import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, Filter, X, ChevronLeft, ChevronRight, Clipboard } from 'lucide-react';
import { LabResult, Patient, Doctor } from '../types';
import { Modal } from './Modal';
import { SkeletonLoader } from './SkeletonLoader';

interface LaboratoryProps {
  labResults: LabResult[];
  patients: Patient[];
  doctors: Doctor[];
  onAddLabResult: (result: Omit<LabResult, 'id' | 'createdAt'>) => void;
  onUpdateLabResult: (id: string, result: Partial<LabResult>) => void;
  onDeleteLabResult: (id: string) => void;
}

export function Laboratory({
  labResults,
  patients,
  doctors,
  onAddLabResult,
  onUpdateLabResult,
  onDeleteLabResult
}: LaboratoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState<LabResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedTestType, setSelectedTestType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState<Omit<LabResult, 'id' | 'createdAt'>>({
    patientId: '',
    doctorId: '',
    testType: 'blood',
    testName: '',
    result: '',
    referenceRange: '',
    unit: '',
    status: 'pending',
    notes: '',
    testDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const testTypeLabels: Record<string, string> = {
    blood: 'Анализ крови',
    biochemistry: 'Биохимия',
    urine: 'Анализ мочи',
    hormone: 'Гормоны',
    immunology: 'Иммунология',
    microbiology: 'Микробиология',
    other: 'Другое'
  };

  const statusLabels: Record<string, string> = {
    pending: 'Ожидание',
    completed: 'Завершен',
    reviewed: 'Проверен'
  };

  const getPeriodStartDate = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'today':
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        return today;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      case 'custom':
        return customDateRange.start ? new Date(customDateRange.start) : new Date(0);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  };

  const getPeriodEndDate = () => {
    if (selectedPeriod === 'custom' && customDateRange.end) {
      const endDate = new Date(customDateRange.end);
      endDate.setHours(23, 59, 59, 999);
      return endDate;
    }
    return new Date();
  };

  const filteredResults = labResults.filter(result => {
    const patient = patients.find(p => p.id === result.patientId);
    const doctor = doctors.find(d => d.id === result.doctorId);

    const matchesSearch = !searchTerm ||
      patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPatient = selectedPatient === 'all' || result.patientId === selectedPatient;
    const matchesDoctor = selectedDoctor === 'all' || result.doctorId === selectedDoctor;
    const matchesTestType = selectedTestType === 'all' || result.testType === selectedTestType;
    const matchesStatus = selectedStatus === 'all' || result.status === selectedStatus;

    const startDate = getPeriodStartDate();
    const endDate = getPeriodEndDate();
    const resultDate = new Date(result.testDate);
    const matchesDate = resultDate >= startDate && resultDate <= endDate;

    return matchesSearch && matchesPatient && matchesDoctor && matchesTestType && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPatient, selectedDoctor, selectedTestType, selectedStatus, selectedPeriod, searchTerm, itemsPerPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResult) {
      onUpdateLabResult(editingResult.id, { ...formData, updatedAt: new Date().toISOString() });
      setEditingResult(null);
    } else {
      onAddLabResult(formData);
    }
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (result: LabResult) => {
    setEditingResult(result);
    setFormData({
      patientId: result.patientId,
      doctorId: result.doctorId,
      testType: result.testType,
      testName: result.testName,
      result: result.result,
      referenceRange: result.referenceRange || '',
      unit: result.unit || '',
      status: result.status,
      notes: result.notes || '',
      testDate: result.testDate
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот результат?')) {
      onDeleteLabResult(id);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      testType: 'blood',
      testName: '',
      result: '',
      referenceRange: '',
      unit: '',
      status: 'pending',
      notes: '',
      testDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddNew = () => {
    setEditingResult(null);
    resetForm();
    setShowModal(true);
  };

  const clearFilters = () => {
    setSelectedPatient('all');
    setSelectedDoctor('all');
    setSelectedTestType('all');
    setSelectedStatus('all');
    setSelectedPeriod('month');
    setCustomDateRange({ start: '', end: '' });
    setSearchTerm('');
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Лаборатория</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors justify-center"
          >
            <Filter size={18} />
            <span className="text-sm md:text-base">Фильтры</span>
          </button>
          <button
            onClick={handleAddNew}
            className="bg-sky-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-sky-600 transition-colors justify-center flex-1 sm:flex-initial"
          >
            <Plus size={18} />
            <span className="text-sm md:text-base">Добавить результат</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-sky-600 hover:text-sky-700 font-medium"
            >
              Сбросить все
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Пациент</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="all">Все пациенты</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Врач</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="all">Все врачи</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тип анализа</label>
                <select
                  value={selectedTestType}
                  onChange={(e) => setSelectedTestType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="all">Все типы</option>
                  {Object.entries(testTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="all">Все статусы</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Период</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPeriod('today')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === 'today'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Сегодня
                </button>
                <button
                  onClick={() => setSelectedPeriod('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === 'week'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Неделя
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === 'month'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Месяц
                </button>
                <button
                  onClick={() => setSelectedPeriod('year')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === 'year'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Год
                </button>
                <button
                  onClick={() => setSelectedPeriod('custom')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === 'custom'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Кастомный
                </button>
              </div>

              {selectedPeriod === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Дата начала</label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Дата окончания</label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск по пациенту, врачу, названию анализа..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пациент</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Врач</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип анализа</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Результат</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <Clipboard className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p>Результаты не найдены</p>
                  </td>
                </tr>
              ) : (
                paginatedResults.map((result) => {
                  const patient = patients.find(p => p.id === result.patientId);
                  const doctor = doctors.find(d => d.id === result.doctorId);

                  return (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(result.testDate).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {patient ? `${patient.firstName} ${patient.lastName}` : 'Неизвестно'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Неизвестно'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {testTypeLabels[result.testType]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{result.testName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {result.result} {result.unit}
                        {result.referenceRange && (
                          <span className="text-xs text-gray-500 block">
                            Норма: {result.referenceRange}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          result.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                          result.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {statusLabels[result.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(result)}
                            className="text-sky-600 hover:text-sky-700"
                            title="Редактировать"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(result.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Удалить"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredResults.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Показывать:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">записей</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {startIndex + 1}-{Math.min(endIndex, filteredResults.length)} из {filteredResults.length}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingResult(null); resetForm(); }}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingResult ? 'Редактировать результат' : 'Добавить результат'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пациент *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Врач *</label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="">Выберите врача</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип анализа *</label>
                <select
                  required
                  value={formData.testType}
                  onChange={(e) => setFormData({ ...formData, testType: e.target.value as LabResult['testType'] })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  {Object.entries(testTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата анализа *</label>
                <input
                  type="date"
                  required
                  value={formData.testDate}
                  onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Название анализа *</label>
                <input
                  type="text"
                  required
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Например: Гемоглобин, Лейкоциты..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Результат *</label>
                <input
                  type="text"
                  required
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Например: 145"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Единица измерения</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Например: г/л, ммоль/л..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Референсный диапазон</label>
                <input
                  type="text"
                  value={formData.referenceRange}
                  onChange={(e) => setFormData({ ...formData, referenceRange: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Например: 120-160 г/л"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Статус *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LabResult['status'] })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Примечания</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                  placeholder="Дополнительная информация..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => { setShowModal(false); setEditingResult(null); resetForm(); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
              >
                {editingResult ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
