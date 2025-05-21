import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Filter } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { Dialog } from '@headlessui/react'; // Ajoutez cette importation si vous utilisez Headless UI

// Mock data
const appointments = [
  { id: 1, time: '09:00', patient: 'Moustapha Diallo', type: 'Check-up', status: 'checked-in', date: '2025-04-05' },
  { id: 2, time: '10:30', patient: 'Cheikh Sy', type: 'Follow-up', status: 'scheduled', date: '2025-04-05' },
  { id: 3, time: '11:45', patient: 'Mamadou Gueye', type: 'Consultation', status: 'scheduled', date: '2025-04-05' },
  { id: 4, time: '14:15', patient: 'Abdoulaye Sow', type: 'Vaccination', status: 'scheduled', date: '2025-04-05' },
  { id: 5, time: '16:00', patient: 'Sophia Diallo', type: 'Physical', status: 'scheduled', date: '2025-04-05' },
  { id: 6, time: '09:30', patient: 'Samba Ndiaye', type: 'Blood pressure monitoring', status: 'scheduled', date: '2025-04-06' },
  { id: 7, time: '11:00', patient: 'Rokhaya Diallo', type: 'Prenatal checkup', status: 'scheduled', date: '2025-04-06' },
  { id: 8, time: '14:00', patient: 'Samba Diallo', type: 'Flu symptoms', status: 'scheduled', date: '2025-04-06' },
  { id: 9, time: '10:00', patient: 'Sophia Diallo', type: 'Annual check-up', status: 'scheduled', date: '2025-04-07' },
  { id: 10, time: '13:30', patient: 'David Diouf', type: 'Follow-up', status: 'scheduled', date: '2025-04-07' }
];

// The appointmentDates for the calendar dots
const appointmentDates = Array.from(new Set(appointments.map(a => a.date)));

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date('2025-04-05'));
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    time: '',
    patient: '',
    type: '',
    status: 'scheduled',
    date: selectedDate instanceof Date ? format(selectedDate, 'yyyy-MM-dd') : '',
  });
  const [allAppointments, setAllAppointments] = useState(appointments);

  // Mettre à jour la date du nouveau rendez-vous si la date sélectionnée change
  React.useEffect(() => {
    setNewAppointment((prev) => ({
      ...prev,
      date: selectedDate instanceof Date ? format(selectedDate, 'yyyy-MM-dd') : '',
    }));
  }, [selectedDate]);

  // Filter appointments for the selected date
  const filteredAppointments = allAppointments.filter(appointment => {
      if (!selectedDate) return false;
      const dateStr = selectedDate instanceof Date
        ? format(selectedDate, 'yyyy-MM-dd')
        : '';
      return appointment.date === dateStr && 
        (appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
         appointment.type.toLowerCase().includes(searchTerm.toLowerCase()));
    });

  // Calendar tile content to show dots for days with appointments
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    const hasAppointments = appointmentDates.includes(formattedDate);
    
    return hasAppointments ? (
      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-1"></div>
    ) : null;
  };
  
  // Fonction pour gérer la soumission du formulaire
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAllAppointments([
      ...allAppointments,
      {
        ...newAppointment,
        id: allAppointments.length + 1,
      }
    ]);
    setShowModal(false);
    setNewAppointment({
      time: '',
      patient: '',
      type: '',
      status: 'scheduled',
      date: selectedDate instanceof Date ? format(selectedDate, 'yyyy-MM-dd') : '',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Modal pour ajouter un rendez-vous */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Nouveau rendez-vous</h2>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient</label>
                <input
                  type="text"
                  required
                  value={newAppointment.patient}
                  onChange={e => setNewAppointment({ ...newAppointment, patient: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Heure</label>
                <input
                  type="time"
                  required
                  value={newAppointment.time}
                  onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  required
                  value={newAppointment.type}
                  onChange={e => setNewAppointment({ ...newAppointment, type: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newAppointment.date}
                  onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <div className="flex gap-2">
          
          <button
            className="btn btn-outline flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            <span>Ajouter un rendez-vous</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Calendar</h2>
            <ReactCalendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              className="border-none"
            />
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <button className="btn btn-outline p-2">
                  <ChevronLeft size={16} />
                </button>
                <h3 className="font-medium">
                  {selectedDate instanceof Date && format(selectedDate, 'MMMM yyyy')}
                </h3>
                <button className="btn btn-outline p-2">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Appointments list */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedDate instanceof Date && format(selectedDate, 'EEEE, MMMM do, yyyy')}
              </h2>
              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>
                <button className="btn btn-outline flex items-center gap-2">
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
              </div>
            </div>
            
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-16 text-center">
                      <div className="text-lg font-medium">{appointment.time}</div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{appointment.patient}</div>
                      <div className="text-sm text-slate-500">{appointment.type}</div>
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        appointment.status === 'checked-in' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {appointment.status === 'checked-in' ? 'Checked In' : 'Scheduled'}
                      </span>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Link 
                        to={`/appointments/${appointment.id}`}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        View
                      </Link>
                      {appointment.status !== 'checked-in' && (
                        <button className="text-sm text-slate-500 hover:text-slate-700">
                          Check In
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-lg font-medium text-slate-700">No appointments</h3>
                <p className="mt-1 text-slate-500">
                  {searchTerm
                    ? 'No appointments match your search'
                    : 'There are no appointments scheduled for this day'}
                </p>
                <div className="mt-6">
                  <Link to="/appointments/new" className="btn btn-primary">
                    Schedule an Appointment
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;