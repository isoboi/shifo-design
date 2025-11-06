import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Phone, Mail } from 'lucide-react';
import { Patient } from '../types';

interface PatientManagementProps {
  patients: Patient[];
  onAddPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  onUpdatePatient: (id: string, patient: Partial<Patient>) => void;
  onDeletePatient: (id: string) => void;
}

export function PatientManagement({ 
  patients, 
  onAddPatient, 
  onUpdatePatient, 
  onDeletePatient 
}: PatientManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    insuranceNumber: '',
    emergencyContact: '',
    allergies: '',
    medicalHistory: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patientData = {
      ...formData,
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean)
    };

    if (editingPatient) {
      onUpdatePatient(editingPatient.id, patientData);
      setEditingPatient(null);
    } else {
      onAddPatient(patientData);
      setShowAddForm(false);
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      address: '',
      insuranceNumber: '',
      emergencyContact: '',
      allergies: '',
      medicalHistory: ''
    });
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      insuranceNumber: patient.insuranceNumber,
      emergencyContact: patient.emergencyContact,
      allergies: patient.allergies.join(', '),
      medicalHistory: patient.medicalHistory
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPatient(null);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      address: '',
      insuranceNumber: '',
      emergencyContact: '',
      allergies: '',
      medicalHistory: ''
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Управление пациентами</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-sky-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-sky-600 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          <span className="text-sm md:text-base">Добавить пациента</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск пациентов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>

      {(showAddForm || editingPatient) && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            {editingPatient ? 'Редактировать пациента' : 'Добавить нового пациента'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Имя</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Фамилия</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Номер страховки</label>
              <input
                type="text"
                required
                value={formData.insuranceNumber}
                onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Адрес</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Экстренный контакт</label>
              <input
                type="tel"
                required
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Аллергии (через запятую)</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Медицинская история</label>
              <textarea
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors text-sm md:text-base"
              >
                {editingPatient ? 'Сохранить изменения' : 'Добавить пациента'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm md:text-base"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Список пациентов ({filteredPatients.length})</h2>
          <div className="space-y-3 md:space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow gap-3"
              >
                <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 gap-1 sm:gap-0">
                      <div className="flex items-center text-xs md:text-sm text-gray-500">
                        <Phone size={12} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{patient.phone}</span>
                      </div>
                      <div className="flex items-center text-xs md:text-sm text-gray-500">
                        <Mail size={12} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                    </div>
                    {patient.allergies.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Аллергии: {patient.allergies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleEdit(patient)}
                    className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDeletePatient(patient.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}