import React, { useMemo } from 'react';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Appointment, Patient, Doctor } from '../types';

interface DayViewProps {
  date: Date;
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  onAppointmentClick: (appointment: Appointment) => void;
  onTimeSlotClick: (date: string, time: string) => void;
}

export function DayView({
  date,
  appointments,
  patients,
  doctors,
  onAppointmentClick,
  onTimeSlotClick
}: DayViewProps) {
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  }, []);

  const getAppointmentsForDoctorAndTime = (doctorId: string, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    const slotAppointments = appointments.filter(apt =>
      apt.date === dateStr &&
      apt.time === time &&
      apt.doctorId === doctorId
    );

    return slotAppointments;
  };

  const getAppointmentColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-gradient-to-r from-blue-500 to-blue-600 border-l-blue-700 text-white';
      case 'completed': return 'bg-gradient-to-r from-green-500 to-green-600 border-l-green-700 text-white';
      case 'cancelled': return 'bg-gradient-to-r from-red-500 to-red-600 border-l-red-700 text-white';
      case 'no-show': return 'bg-gradient-to-r from-gray-400 to-gray-500 border-l-gray-600 text-white';
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600 border-l-blue-700 text-white';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'scheduled': return '●';
      case 'completed': return '✓';
      case 'cancelled': return '✕';
      case 'no-show': return '○';
      default: return '●';
    }
  };

  const isCurrentTime = (time: string) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (!isToday) return false;

    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${Math.floor(now.getMinutes() / 30) * 30}`;
    return time === currentTime;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="grid" style={{ gridTemplateColumns: '180px repeat(' + timeSlots.length + ', 1fr)' }}>
          {/* Top-left corner cell */}
          <div className="sticky left-0 top-0 z-30 bg-gray-50 border-b border-r border-gray-200 p-3">
            <div className="text-sm font-medium text-gray-500">Врач / Время</div>
          </div>

          {/* Time headers */}
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className={`sticky top-0 z-20 bg-gray-50 border-b border-r border-gray-200 last:border-r-0 p-2 text-center ${
                isCurrentTime(time) ? 'bg-red-50' : ''
              }`}
            >
              <div className={`text-xs font-semibold ${
                isCurrentTime(time) ? 'text-red-600' : 'text-gray-900'
              }`}>
                {time}
              </div>
            </div>
          ))}

          {/* Doctor rows */}
          {doctors.map((doctor, doctorIndex) => (
            <React.Fragment key={doctor.id}>
              {/* Doctor name cell */}
              <div className="sticky left-0 z-20 bg-white border-b border-r border-gray-200 p-3">
                <div className="font-medium text-gray-900 text-sm">
                  {doctor.firstName} {doctor.lastName}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {doctor.specialization}
                </div>
              </div>

              {/* Time slot cells for this doctor */}
              {timeSlots.map((time, timeIndex) => {
                const appointmentsInSlot = getAppointmentsForDoctorAndTime(doctor.id, time);
                const maxVisibleAppointments = 4;
                const visibleAppointments = appointmentsInSlot.slice(0, maxVisibleAppointments);
                const hasMore = appointmentsInSlot.length > maxVisibleAppointments;
                const isCurrentSlot = isCurrentTime(time);

                return (
                  <div
                    key={`${doctor.id}-${time}`}
                    className={`border-b border-r border-gray-100 last:border-r-0 p-1 relative cursor-pointer hover:bg-gray-50 transition-colors min-h-[80px] ${
                      isCurrentSlot ? 'bg-red-50' : ''
                    }`}
                    onClick={() => onTimeSlotClick(date.toISOString().split('T')[0], time)}
                  >
                    {isCurrentSlot && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-red-500 z-10"></div>
                    )}

                    <div className="relative h-full">
                      {visibleAppointments.map((appointment, aptIndex) => {
                        const patient = patients.find(p => p.id === appointment.patientId);
                        const heightPerCard = 18;
                        const spacing = 1;

                        return (
                          <div
                            key={appointment.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentClick(appointment);
                            }}
                            className={`
                              absolute left-0 right-0 rounded border-l-2 px-1.5 py-0.5 cursor-pointer
                              hover:shadow-md transition-all duration-150 overflow-hidden
                              ${getAppointmentColor(appointment.status)}
                            `}
                            style={{
                              top: `${aptIndex * (heightPerCard + spacing)}px`,
                              height: `${heightPerCard}px`,
                              fontSize: '10px',
                              zIndex: 10 - aptIndex
                            }}
                          >
                            <div className="flex items-center justify-between h-full">
                              <div className="flex-1 min-w-0 flex items-center space-x-1">
                                <span className="font-bold text-xs">
                                  {getStatusIndicator(appointment.status)}
                                </span>
                                <span className="truncate font-medium">
                                  {patient?.firstName} {patient?.lastName}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {hasMore && (
                        <div
                          className="absolute bottom-0 right-0 bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded-tl"
                          style={{ fontSize: '9px' }}
                        >
                          +{appointmentsInSlot.length - maxVisibleAppointments}
                        </div>
                      )}
                    </div>

                    {visibleAppointments.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Plus size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded border-l-2 border-blue-700"></div>
              <span className="text-gray-600">● Запланировано</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded border-l-2 border-green-700"></div>
              <span className="text-gray-600">✓ Завершено</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded border-l-2 border-red-700"></div>
              <span className="text-gray-600">✕ Отменено</span>
            </div>
            <div className="text-gray-500 italic">До 4 записей в ячейке</div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Текущее время</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
