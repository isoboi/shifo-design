import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { DoctorManagement } from './components/DoctorManagement';
import { AppointmentScheduler } from './components/AppointmentScheduler';
import { FinanceManagement } from './components/FinanceManagement';
import { Analytics } from './components/Analytics';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockPatients, mockDoctors, mockAppointments, mockPayments } from './data/mockData';
import { Patient, Doctor, Appointment, Payment, Expense } from './types';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', mockPatients);
  const [doctors, setDoctors] = useLocalStorage<Doctor[]>('doctors', mockDoctors);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', mockAppointments);
  const [payments, setPayments] = useLocalStorage<Payment[]>('payments', mockPayments);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);

  const handleAddPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPatients([...patients, newPatient]);
  };

  const handleUpdatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  const handleAddDoctor = (doctorData: Omit<Doctor, 'id'>) => {
    const newDoctor: Doctor = {
      ...doctorData,
      id: Date.now().toString()
    };
    setDoctors([...doctors, newDoctor]);
  };

  const handleUpdateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };

  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAppointments([...appointments, newAppointment]);

    // Автоматически создаем запись о платеже
    const doctor = doctors.find(d => d.id === appointmentData.doctorId);
    if (doctor) {
      const newPayment: Payment = {
        id: (Date.now() + Math.random()).toString(),
        appointmentId: newAppointment.id,
        patientId: appointmentData.patientId,
        amount: doctor.consultationFee,
        method: 'cash',
        status: 'pending',
        paymentType: 'regular',
        createdAt: new Date().toISOString()
      };
      setPayments([...payments, newPayment]);
    }
  };

  const handleUpdateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    // Также удаляем связанные платежи
    setPayments(payments.filter(p => p.appointmentId !== id));
  };
  const handleUpdatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(payments.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleAddPayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: (Date.now() + Math.random()).toString(),
      createdAt: new Date().toISOString(),
      paidAt: paymentData.status === 'paid' ? new Date().toISOString() : undefined
    };
    setPayments([...payments, newPayment]);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleUpdateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            payments={payments}
          />
        );
      case 'patients':
        return (
          <PatientManagement
            patients={patients}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onDeletePatient={handleDeletePatient}
          />
        );
      case 'doctors':
        return (
          <DoctorManagement
            doctors={doctors}
            onAddDoctor={handleAddDoctor}
            onUpdateDoctor={handleUpdateDoctor}
            onDeleteDoctor={handleDeleteDoctor}
          />
        );
      case 'appointments':
        return (
          <AppointmentScheduler
            appointments={appointments}
            patients={patients}
            doctors={doctors}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        );
      case 'finances':
        return (
          <FinanceManagement
            payments={payments}
            expenses={expenses}
            appointments={appointments}
            patients={patients}
            onUpdatePayment={handleUpdatePayment}
            onAddPayment={handleAddPayment}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'analytics':
        return (
          <Analytics
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            payments={payments}
          />
        );
      case 'settings':
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Настройки</h2>
            <p className="text-gray-600">Раздел настроек в разработке...</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (showLanding) {
    return <Landing onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;