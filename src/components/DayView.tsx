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
      case 'scheduled': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      case 'no-show': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border border-blue-200';
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

                    {appointmentsInSlot.length > 0 ? (
                      appointmentsInSlot.length === 1 ? (
                        <div className="flex h-full gap-0.5">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentClick(appointmentsInSlot[0]);
                            }}
                            className={`flex-1 flex flex-col items-center justify-center rounded cursor-pointer hover:shadow-md transition-all ${getAppointmentColor(appointmentsInSlot[0].status)}`}
                          >
                            <div className="font-semibold text-xs truncate px-1">
                              {patients.find(p => p.id === appointmentsInSlot[0].patientId)?.firstName} {patients.find(p => p.id === appointmentsInSlot[0].patientId)?.lastName}
                            </div>
                            <div className="text-xs opacity-90">{appointmentsInSlot[0].duration} мин</div>
                          </div>
                          <button
                            className="flex-1 bg-white border-2 border-blue-200 rounded flex items-center justify-center font-semibold hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTimeSlotClick(date.toISOString().split('T')[0], time);
                            }}
                          >
                            <Plus size={20} className="text-blue-400" />
                          </button>
                        </div>
                      ) : appointmentsInSlot.length === 2 ? (
                        <div className="flex h-full gap-0.5">
                          {appointmentsInSlot.map((appointment) => {
                            const patient = patients.find(p => p.id === appointment.patientId);

                            return (
                              <div
                                key={appointment.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAppointmentClick(appointment);
                                }}
                                className={`flex-1 rounded cursor-pointer hover:shadow-md transition-all flex flex-col items-center justify-center px-0.5 ${getAppointmentColor(appointment.status)}`}
                              >
                                <div className="font-semibold text-xs truncate w-full text-center">
                                  {patient?.firstName} {patient?.lastName}
                                </div>
                                <div className="text-[10px] opacity-90">{appointment.duration}м</div>
                              </div>
                            );
                          })}
                          <button
                            className="flex-1 bg-white border-2 border-blue-200 rounded flex items-center justify-center font-semibold hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTimeSlotClick(date.toISOString().split('T')[0], time);
                            }}
                          >
                            <Plus size={20} className="text-blue-400" />
                          </button>
                        </div>
                      ) : appointmentsInSlot.length >= 3 ? (
                        <div className="flex h-full gap-0.5">
                          {appointmentsInSlot.slice(0, 3).map((appointment) => {
                            const patient = patients.find(p => p.id === appointment.patientId);

                            return (
                              <div
                                key={appointment.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAppointmentClick(appointment);
                                }}
                                className={`flex-1 rounded cursor-pointer hover:shadow-md transition-all flex flex-col items-center justify-center px-0.5 ${getAppointmentColor(appointment.status)}`}
                              >
                                <div className="font-semibold text-xs truncate w-full text-center">
                                  {patient?.firstName} {patient?.lastName}
                                </div>
                                <div className="text-[10px] opacity-90">{appointment.duration}м</div>
                              </div>
                            );
                          })}
                          <button
                            className="flex-1 bg-white border-2 border-blue-200 rounded flex items-center justify-center font-semibold text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTimeSlotClick(date.toISOString().split('T')[0], time);
                            }}
                          >
                            {appointmentsInSlot.length > 3 ? <span className="text-blue-500">+{appointmentsInSlot.length - 3}</span> : <Plus size={20} className="text-blue-400" />}
                          </button>
                        </div>
                      ) : null
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Plus size={20} className="text-gray-400" />
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
              <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
              <span className="text-gray-600">Запланировано</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-gray-600">Завершено</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-gray-600">Отменено</span>
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
