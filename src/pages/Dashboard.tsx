import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarClock, ClipboardList, Clock, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data
const todaysAppointments = [
  { id: 1, time: '09:00', patient: 'Moustapha Diallo', type: 'Check-up', status: 'checked-in' },
  { id: 2, time: '10:30', patient: 'Cheikh Sy', type: 'Follow-up', status: 'scheduled' },
  { id: 3, time: '11:45', patient: 'Mamadou Gueye', type: 'Consultation', status: 'scheduled' },
  { id: 4, time: '14:15', patient: 'Abdoulaye Sow', type: 'Vaccination', status: 'scheduled' },
  { id: 5, time: '16:00', patient: 'Sophia Diallo', type: 'Physical', status: 'scheduled' }
];

const recentPatients = [
  { id: 1, name: 'Samba Ndiaye', lastVisit: '2025-04-01', reason: 'Flu symptoms' },
  { id: 2, name: 'Rokhaya Diallo', lastVisit: '2025-03-28', reason: 'Prenatal checkup' },
  { id: 3, name: 'Samba Diallo', lastVisit: '2025-03-25', reason: 'Blood pressure monitoring' }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h1>
          <p className="text-slate-500">Here's what's happening today</p>
        </div>
        <div className="flex gap-3">
          
          <Link to="/patients/new" className="btn btn-outline flex items-center gap-2">
            <Plus size={16} />
            <span>New Patient</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card flex items-center p-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Total Patients</div>
            <div className="text-2xl font-bold">10</div>
          </div>
        </div>
        
        <div className="card flex items-center p-6">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-4">
            <CalendarClock size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Today's Appointments</div>
            <div className="text-2xl font-bold">5</div>
          </div>
        </div>
        
        <div className="card flex items-center p-6">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-4">
            <ClipboardList size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Pending Records</div>
            <div className="text-2xl font-bold">3</div>
          </div>
        </div>
        
        <div className="card flex items-center p-6">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Avg. Wait Time</div>
            <div className="text-2xl font-bold">12m</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Today's Appointments</h2>
              <Link to="/appointments" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                View all <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{appointment.time}</td>
                      <td className="py-3 px-4">
                        <Link to={`/patients/${appointment.id}`} className="text-blue-500 hover:text-blue-600">
                          {appointment.patient}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{appointment.type}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          appointment.status === 'checked-in' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {appointment.status === 'checked-in' ? 'Checked In' : 'Scheduled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-sm text-slate-500 hover:text-slate-700">View</button>
                          {appointment.status !== 'checked-in' && (
                            <button className="text-sm text-blue-500 hover:text-blue-600">Check In</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Recent Patients */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Recent Patients</h2>
              <Link to="/patients" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                View all <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">
                      <Link to={`/patients/${patient.id}`} className="text-blue-500 hover:text-blue-600">
                        {patient.name}
                      </Link>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center">
                      <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                      <span className="mx-1">•</span>
                      <span>{patient.reason}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <button className="w-full py-2 text-center text-sm text-blue-500 hover:text-blue-600 font-medium">
                View More Patients
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;