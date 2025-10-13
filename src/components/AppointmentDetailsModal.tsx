import React from 'react';
import { Calendar, Clock, User, UserCheck, FileText, Copy, Edit2, XCircle, CheckCircle } from 'lucide-react';
import { Appointment, Patient, Doctor } from '../types';

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  patient: Patient | undefined;
  doctor: Doctor | undefined;
  onEdit: () => void;
  onDuplicate: () => void;
  onCancel: () => void;
  onMarkCompleted: () => void;
}

export function AppointmentDetailsModal({
  appointment,
  patient,
  doctor,
  onEdit,
  onDuplicate,
  onCancel,
  onMarkCompleted
}: AppointmentDetailsModalProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Запланировано' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Завершено' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Отменено' },
      'no-show': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Неявка' }
    };

    const statusStyle = statusMap[status as keyof typeof statusMap] || statusMap.scheduled;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
        {statusStyle.label}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeMap = {
      consultation: 'Консультация',
      'follow-up': 'Повторный прием',
      procedure: 'Процедура',
      emergency: 'Экстренный прием'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onDuplicate}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
          >
            <Copy size={16} />
            <span>Дублировать запись</span>
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Edit2 size={16} />
            <span>Редактировать запись</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          {appointment.status === 'scheduled' && (
            <>
              <button
                type="button"
                onClick={onMarkCompleted}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <CheckCircle size={16} />
                <span>Отметить как завершено</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <XCircle size={16} />
                <span>Отменить запись</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Patient Info */}
      <div className="flex items-center space-x-3">
        <User size={20} className="text-gray-500" />
        <span className="text-gray-900 font-medium">
          {patient?.firstName} {patient?.lastName}
        </span>
      </div>

      {/* Appointment Date and Time */}
      <div className="flex items-center space-x-3">
        <Calendar size={20} className="text-gray-500" />
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Приём:</span>
          <span className="font-medium text-gray-900">
            {formatDate(appointment.date)}
          </span>
          <Clock size={16} className="text-gray-500" />
          <span className="font-medium text-gray-900">
            {appointment.time} - {(() => {
              const [hours, minutes] = appointment.time.split(':').map(Number);
              const endMinutes = hours * 60 + minutes + appointment.duration;
              const endHours = Math.floor(endMinutes / 60);
              const endMins = endMinutes % 60;
              return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
            })()}
          </span>
        </div>
      </div>

      {/* Created At */}
      <div className="flex items-center space-x-3">
        <Calendar size={20} className="text-gray-500" />
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Создано:</span>
          <span className="text-gray-900">{formatDateTime(appointment.createdAt)}</span>
        </div>
      </div>

      {/* Updated At - if available */}
      {appointment.updatedAt && (
        <div className="flex items-center space-x-3">
          <Calendar size={20} className="text-gray-500" />
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Обновлено:</span>
            <span className="text-gray-900">{formatDateTime(appointment.updatedAt)}</span>
          </div>
        </div>
      )}

      {/* Symptoms */}
      <div className="flex items-start space-x-3">
        <FileText size={20} className="text-gray-500 mt-0.5" />
        <div>
          <span className="text-gray-700">Симптомы:</span>
          <span className="text-gray-900 ml-1">{appointment.symptoms || '-'}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="flex items-start space-x-3">
        <FileText size={20} className="text-gray-500 mt-0.5" />
        <div>
          <span className="text-gray-700">Заметки:</span>
          <span className="text-gray-900 ml-1">{appointment.notes || '-'}</span>
        </div>
      </div>

      {/* Type */}
      <div className="flex items-center space-x-3">
        <FileText size={20} className="text-gray-500" />
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Тип:</span>
          <span className="text-gray-900">{getTypeLabel(appointment.type)}</span>
        </div>
      </div>

      {/* Doctor */}
      <div className="flex items-center space-x-3">
        <UserCheck size={20} className="text-gray-500" />
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Врач:</span>
          <span className="text-gray-900">
            {doctor?.firstName} {doctor?.lastName} ({doctor?.specialization})
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-3">
        <span className="text-gray-700">Статус:</span>
        {getStatusBadge(appointment.status)}
      </div>

      {/* Diagnosis - if available */}
      {appointment.diagnosis && (
        <div className="flex items-start space-x-3 pt-4 border-t border-gray-200">
          <FileText size={20} className="text-gray-500 mt-0.5" />
          <div>
            <span className="text-gray-700 font-medium">Диагноз:</span>
            <p className="text-gray-900 mt-1">{appointment.diagnosis}</p>
          </div>
        </div>
      )}

      {/* Prescription - if available */}
      {appointment.prescription && (
        <div className="flex items-start space-x-3">
          <FileText size={20} className="text-gray-500 mt-0.5" />
          <div>
            <span className="text-gray-700 font-medium">Назначения:</span>
            <p className="text-gray-900 mt-1">{appointment.prescription}</p>
          </div>
        </div>
      )}
    </div>
  );
}
