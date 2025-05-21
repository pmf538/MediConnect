import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, ClipboardList, FileText, UserRound, Phone, Mail, 
  MapPin, Activity, Heart, Clock, Plus, ArrowLeft, Edit
} from 'lucide-react';

// Mock patient data
const patientData = {
  id: 1,
  name: 'Moustapha Diallo',
  dob: '1985-03-15',
  gender: 'man',
  phone: '777339973',
  email: 'moustapha1@gmail.com',
  address: 'Villa 102,Rue 15, Point E Dakar, CP 11500',
  insurance: 'SONAM Assurances',
  insuranceNumber: 'SA-SANTE-2024-000182',
  bloodType: 'A+',
  allergies: ['Penicillin', 'Peanuts'],
  conditions: ['Asthma', 'Hypertension'],
  notes: 'Patient exercises regularly and maintains a balanced diet. Experiences occasional stress-related symptoms.',
  appointments: [
    { id: 1, date: '2025-03-28', reason: 'Annual check-up', doctor: 'Dr. Amadou Diallo', status: 'completed' },
    { id: 2, date: '2025-01-15', reason: 'Flu symptoms', doctor: 'Dr. Amadou Diallo', status: 'completed' },
    { id: 3, date: '2024-11-10', reason: 'Follow-up on hypertension', doctor: 'Dr. Amadou Diallo', status: 'completed' },
    { id: 4, date: '2025-04-20', reason: 'Asthma management', doctor: 'Dr. Amadou Diallo', status: 'scheduled' }
  ],
  prescriptions: [
    { id: 1, name: 'Ventolin HFA', dosage: '90mcg', frequency: 'As needed', issued: '2024-11-10', ends: '2025-11-10', status: 'active' },
    { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', issued: '2024-11-10', ends: '2025-02-10', status: 'expired' },
    { id: 3, name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', issued: '2025-01-15', ends: '2025-01-22', status: 'completed' }
  ],
  vitals: [
    { id: 1, date: '2025-03-28', bp: '125/82', pulse: 72, temp: 98.6, weight: 145, height: 167 },
    { id: 2, date: '2025-01-15', bp: '130/85', pulse: 75, temp: 99.2, weight: 147, height: 167 },
    { id: 3, date: '2024-11-10', bp: '128/84', pulse: 70, temp: 98.4, weight: 146, height: 167 }
  ]
};

// Tabs enum
enum Tab {
  Overview = 'overview',
  Appointments = 'appointments',
  Prescriptions = 'prescriptions',
  MedicalHistory = 'medical-history',
  Notes = 'notes'
}

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Overview);
  
  // In a real app, you would fetch patient data based on the ID
  const patient = patientData;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/patients" className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft size={16} />
          <span>Back to Patients</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Patient info sidebar */}
        <div className="lg:w-1/3">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Patient Information</h2>
              <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
                <Edit size={16} />
                <span>Edit</span>
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl mb-3">
                {patient.name.charAt(0)}
              </div>
              <h1 className="text-xl font-bold text-slate-800">{patient.name}</h1>
              <div className="text-slate-500 text-sm mt-1">
                {new Date(patient.dob).toLocaleDateString()} ({calculateAge(patient.dob)} y.o.) • {patient.gender}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Phone</div>
                  <div>{patient.phone}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Email</div>
                  <div>{patient.email}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Address</div>
                  <div>{patient.address}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Insurance</div>
                  <div>{patient.insurance}</div>
                  <div className="text-sm text-slate-500">{patient.insuranceNumber}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-medium text-slate-800 mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Link to={`/appointments/new?patient=${patient.id}`} 
                      className="btn btn-outline flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  <span>Schedule Appointment</span>
                </Link>
                <Link to={`/prescriptions/new?patient=${patient.id}`}
                      className="btn btn-outline flex items-center justify-center gap-2">
                  <ClipboardList size={16} />
                  <span>Write Prescription</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:w-2/3">
          {/* Tabs */}
          <div className="card p-0 mb-6">
            <div className="flex overflow-x-auto">
              {Object.entries(Tab).map(([key, value]) => (
                <button 
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex-1 text-center border-b-2 ${
                    activeTab === value 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab content */}
          <div className="card">
            {activeTab === Tab.Overview && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Medical Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-4 border border-slate-200 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                        <Heart size={16} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Blood Type</div>
                        <div className="font-medium">{patient.bloodType}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 border border-slate-200 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Activity size={16} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Last Visit</div>
                        <div className="font-medium">{new Date(patient.appointments[0].date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 border border-slate-200 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-3">
                        <Clock size={16} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Next Appointment</div>
                        <div className="font-medium">
                          {
                            patient.appointments.find(a => a.status === 'scheduled') 
                              ? new Date(patient.appointments.find(a => a.status === 'scheduled')!.date).toLocaleDateString()
                              : 'None scheduled'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-slate-800 mb-3">Allergies</h3>
                    <div className="border border-slate-200 rounded-lg">
                      {patient.allergies.length > 0 ? (
                        <ul className="divide-y divide-slate-200">
                          {patient.allergies.map((allergy, index) => (
                            <li key={index} className="px-4 py-3">{allergy}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-slate-500">No allergies recorded</div>
                      )}
                      <div className="border-t border-slate-200 px-4 py-2">
                        <button className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                          <Plus size={14} />
                          <span>Add Allergy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-slate-800 mb-3">Conditions</h3>
                    <div className="border border-slate-200 rounded-lg">
                      {patient.conditions.length > 0 ? (
                        <ul className="divide-y divide-slate-200">
                          {patient.conditions.map((condition, index) => (
                            <li key={index} className="px-4 py-3">{condition}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-slate-500">No conditions recorded</div>
                      )}
                      <div className="border-t border-slate-200 px-4 py-2">
                        <button className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                          <Plus size={14} />
                          <span>Add Condition</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-800 mb-3">Latest Vitals</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Blood Pressure</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Pulse (bpm)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Temp (°F)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Weight (lbs)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Height (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.vitals.map((vital) => (
                          <tr key={vital.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 font-medium">{new Date(vital.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{vital.bp}</td>
                            <td className="py-3 px-4">{vital.pulse}</td>
                            <td className="py-3 px-4">{vital.temp}</td>
                            <td className="py-3 px-4">{vital.weight}</td>
                            <td className="py-3 px-4">{vital.height}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <button className="text-sm text-blue-500 hover:text-blue-600">
                      Add New Vitals
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === Tab.Appointments && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Appointment History</h2>
                  <Link to={`/appointments/new?patient=${patient.id}`} className="btn btn-primary btn-sm flex items-center gap-2">
                    <Plus size={16} />
                    <span>New Appointment</span>
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Reason</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Doctor</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.appointments.map((appointment) => (
                        <tr key={appointment.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{new Date(appointment.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{appointment.reason}</td>
                          <td className="py-3 px-4">{appointment.doctor}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              appointment.status === 'completed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {appointment.status === 'completed' ? 'Completed' : 'Scheduled'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="text-sm text-blue-500 hover:text-blue-600">
                                View
                              </button>
                              {appointment.status === 'scheduled' && (
                                <button className="text-sm text-slate-500 hover:text-slate-700">
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === Tab.Prescriptions && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Prescriptions</h2>
                  <Link to={`/prescriptions/new?patient=${patient.id}`} className="btn btn-primary btn-sm flex items-center gap-2">
                    <Plus size={16} />
                    <span>New Prescription</span>
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Medication</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Dosage</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Frequency</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Issued</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Ends</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.prescriptions.map((prescription) => (
                        <tr key={prescription.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{prescription.name}</td>
                          <td className="py-3 px-4">{prescription.dosage}</td>
                          <td className="py-3 px-4">{prescription.frequency}</td>
                          <td className="py-3 px-4">{new Date(prescription.issued).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{new Date(prescription.ends).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              prescription.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : prescription.status === 'expired'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                            }`}>
                              {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="text-sm text-blue-500 hover:text-blue-600">
                                View
                              </button>
                              {prescription.status === 'active' && (
                                <button className="text-sm text-slate-500 hover:text-slate-700">
                                  Renew
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === Tab.MedicalHistory && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Medical History</h2>
                <p className="text-slate-500 italic mb-4">This section will display the patient's complete medical history.</p>
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-600">
                  Medical history functionality is under development.
                </div>
              </div>
            )}
            
            {activeTab === Tab.Notes && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Patient Notes</h2>
                  <button className="btn btn-primary btn-sm flex items-center gap-2">
                    <Plus size={16} />
                    <span>Add Note</span>
                  </button>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-4 mb-6">
                  <p className="text-slate-700">{patient.notes}</p>
                  <div className="mt-3 text-right">
                    <span className="text-sm text-slate-500">Last updated: {new Date(patient.appointments[0].date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-medium text-slate-800 mb-2">Add New Note</h3>
                  <textarea 
                    className="form-input min-h-[120px] w-full mb-3" 
                    placeholder="Enter your notes about this patient...">
                  </textarea>
                  <div className="flex justify-end">
                    <button className="btn btn-primary">Save Note</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate age
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default PatientDetail;