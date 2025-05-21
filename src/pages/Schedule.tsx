import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, X, Save } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';

// Mock data for schedule
const initialAvailabilityHours = {
  '0': [], // Sunday - closed
  '1': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'], // Monday
  '2': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'], // Tuesday
  '3': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'], // Wednesday
  '4': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'], // Thursday
  '5': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'], // Friday
  '6': [] // Saturday - closed
};

const appointments = [
  { id: 1, time: '09:00', patient: 'Moustapha Diallo', type: 'Check-up', duration: 30, date: '2025-04-07' },
  { id: 2, time: '10:30', patient: 'Cheikh Sy', type: 'Follow-up', duration: 30, date: '2025-04-07' },
  { id: 3, time: '11:45', patient: 'Mamadou Gueye', type: 'Consultation', duration: 60, date: '2025-04-07' },
  { id: 4, time: '14:15', patient: 'Abdoulaye Sow', type: 'Vaccination', duration: 15, date: '2025-04-07' },
  { id: 5, time: '16:00', patient: 'Sophia Diallo', type: 'Physical', duration: 60, date: '2025-04-07' },
  { id: 6, time: '09:30', patient: 'Samba Ndiaye', type: 'Blood pressure monitoring', duration: 30, date: '2025-04-08' },
  { id: 7, time: '11:00', patient: 'Rokhaya Diallo', type: 'Prenatal checkup', duration: 45, date: '2025-04-08' },
  { id: 8, time: '14:00', patient: 'Samba Diallo', type: 'Flu symptoms', duration: 30, date: '2025-04-08' },
  { id: 9, time: '10:00', patient: 'Sophia Diallo', type: 'Annual check-up', duration: 60, date: '2025-04-09' },
  { id: 10, time: '13:30', patient: 'David Diouf', type: 'Follow-up', duration: 30, date: '2025-04-09' }
];

// Time slots 
const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
                   '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2025-04-06')); // Start on a Sunday
  const [view, setView] = useState<'week' | 'day'>('week');
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilityHours, setAvailabilityHours] = useState(initialAvailabilityHours);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  const startDate = startOfWeek(currentDate);
  
  // Generate the days to display in the week view
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Navigate to previous/next week
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  
  // Navigate to previous/next day
  const goToPreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const goToNextDay = () => setCurrentDate(addDays(currentDate, 1));
  
  // Format a date as YYYY-MM-DD for appointment filtering
  const formatDateForFilter = (date: Date) => format(date, 'yyyy-MM-dd');
  
  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    const dateStr = formatDateForFilter(date);
    return appointments.filter(app => app.date === dateStr);
  };
  
  // Check if a time slot has an appointment
  const getAppointmentAtTimeSlot = (date: Date, time: string) => {
    const dateStr = formatDateForFilter(date);
    return appointments.find(app => app.date === dateStr && app.time === time);
  };
  
  // Check if a day is available (has working hours)
  const isDayAvailable = (date: Date) => {
    const dayOfWeek = date.getDay().toString();
    return availabilityHours[dayOfWeek as keyof typeof availabilityHours].length > 0;
  };
  
  // Check if a specific time slot is available
  const isTimeSlotAvailable = (date: Date, time: string) => {
    const dayOfWeek = date.getDay().toString();
    return availabilityHours[dayOfWeek as keyof typeof availabilityHours].includes(time);
  };

  // Open availability modal for a specific day
  const openAvailabilityModal = (day: string) => {
    setEditingDay(day);
    setSelectedSlots([...availabilityHours[day as keyof typeof availabilityHours]]);
    setShowAvailabilityModal(true);
  };

  // Toggle time slot selection
  const toggleTimeSlot = (time: string) => {
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter(slot => slot !== time));
    } else {
      setSelectedSlots([...selectedSlots, time]);
    }
  };

  // Save availability
  const saveAvailability = () => {
    if (editingDay) {
      const updatedAvailability = {
        ...availabilityHours,
        [editingDay]: [...selectedSlots].sort()
      };
      setAvailabilityHours(updatedAvailability);
    }
    setShowAvailabilityModal(false);
  };

  // Reset to default availability
  const resetToDefault = () => {
    if (editingDay) {
      setSelectedSlots([...initialAvailabilityHours[editingDay as keyof typeof initialAvailabilityHours]]);
    }
  };

  // Close availability modal
  const closeAvailabilityModal = () => {
    setShowAvailabilityModal(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Set Availability for {editingDay === '0' ? 'Sunday' : 
                  editingDay === '1' ? 'Monday' : 
                  editingDay === '2' ? 'Tuesday' : 
                  editingDay === '3' ? 'Wednesday' : 
                  editingDay === '4' ? 'Thursday' : 
                  editingDay === '5' ? 'Friday' : 'Saturday'}
              </h3>
              <button onClick={closeAvailabilityModal} className="text-slate-500 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Select available time slots:</p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => toggleTimeSlot(time)}
                    className={`py-2 px-3 rounded text-sm ${
                      selectedSlots.includes(time)
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={resetToDefault}
                className="btn btn-outline"
              >
                Reset to Default
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={closeAvailabilityModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveAvailability}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Schedule</h1>
        <div className="flex items-center gap-3">
          <div className="flex border border-slate-300 rounded-md overflow-hidden">
            <button 
              onClick={() => setView('day')}
              className={`px-3 py-2 text-sm ${
                view === 'day' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Day
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-3 py-2 text-sm ${
                view === 'week' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Week
            </button>
          </div>
          <button className="btn btn-outline flex items-center gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => setShowAvailabilityModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Set Availability</span>
          </button>
        </div>
      </div>
      
      <div className="card">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={view === 'week' ? goToPreviousWeek : goToPreviousDay}
              className="btn btn-outline p-2"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={view === 'week' ? goToNextWeek : goToNextDay}
              className="btn btn-outline p-2"
            >
              <ChevronRight size={16} />
            </button>
            <h2 className="text-lg font-bold">
              {view === 'week' 
                ? `${format(days[0], 'MMMM d')} - ${format(days[6], 'MMMM d, yyyy')}`
                : format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <button 
            onClick={() => setCurrentDate(new Date('2025-04-06'))}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Today
          </button>
        </div>
        
        <div className="overflow-auto">
          {view === 'week' ? (
            // Week view
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-20 py-2 px-4 text-left font-medium text-slate-500 border-b border-slate-200"></th>
                  {days.map(day => (
                    <th key={day.toString()} className="w-1/7 py-2 px-4 text-center font-medium border-b border-slate-200">
                      <div className={`flex flex-col items-center ${
                        isSameDay(day, new Date('2025-04-07')) // Highlight current day
                          ? 'text-blue-600' 
                          : isDayAvailable(day) ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        <span className="text-sm">{format(day, 'E')}</span>
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full mt-1 ${
                          isSameDay(day, new Date('2025-04-07')) 
                            ? 'bg-blue-100' 
                            : ''
                        }`}>
                          {format(day, 'd')}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-4 text-right font-medium text-slate-500 border-r border-slate-200">
                      {time}
                    </td>
                    {days.map(day => {
                      const appointment = getAppointmentAtTimeSlot(day, time);
                      const isAvailable = isTimeSlotAvailable(day, time);
                      
                      return (
                        <td 
                          key={`${day}-${time}`} 
                          className={`py-2 px-1 border-r border-slate-100 ${
                            !isAvailable && 'bg-slate-50'
                          }`}
                        >
                          {appointment ? (
                            <div className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-sm">
                              <div className="font-medium truncate">{appointment.patient}</div>
                              <div className="text-xs truncate">{appointment.type}</div>
                            </div>
                          ) : isAvailable ? (
                            <div className="h-9 flex items-center justify-center">
                              <button className="text-slate-400 hover:text-blue-500 text-xs">
                                + Add
                              </button>
                            </div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Day view
            <div>
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <h3 className="font-medium text-slate-700">
                  {isDayAvailable(currentDate) 
                    ? 'Schedule' 
                    : 'Not Available (Office Closed)'}
                </h3>
                <span className="text-sm text-slate-500">
                  {isDayAvailable(currentDate) 
                    ? '9:00 AM - 5:00 PM' 
                    : ''}
                </span>
              </div>
              
              {isDayAvailable(currentDate) ? (
                <div>
                  {timeSlots.map(time => {
                    const appointment = getAppointmentAtTimeSlot(currentDate, time);
                    const isAvailable = isTimeSlotAvailable(currentDate, time);
                    
                    return (
                      <div 
                        key={time}
                        className={`flex items-center border-b border-slate-100 hover:bg-slate-50 ${
                          !isAvailable && 'bg-slate-50'
                        }`}
                      >
                        <div className="w-20 py-3 px-4 text-right font-medium text-slate-500 border-r border-slate-200">
                          {time}
                        </div>
                        <div className="flex-1 py-3 px-4">
                          {appointment ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-slate-800">{appointment.patient}</div>
                                <div className="text-sm text-slate-500">
                                  {appointment.type} • {appointment.duration} minutes
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="text-sm text-blue-500 hover:text-blue-600">
                                  View
                                </button>
                                <button className="text-sm text-slate-500 hover:text-slate-700">
                                  Reschedule
                                </button>
                              </div>
                            </div>
                          ) : isAvailable ? (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Available</span>
                              <button className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                                <Plus size={14} />
                                <span>Add Appointment</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400">Not Available</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <p>The office is closed on this day.</p>
                  <button 
                    onClick={() => openAvailabilityModal(currentDate.getDay().toString())}
                    className="mt-4 btn btn-outline"
                  >
                    Set Special Availability
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;