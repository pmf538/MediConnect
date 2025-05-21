import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data
const patients = [
  { id: 1, name: 'Moustapha Diallo', dob: '1985-03-15', phone: '777339973', email: 'moustapha1@gmail.com', lastVisit: '2025-03-28' },
  { id: 2, name: 'Cheikh Sy', dob: '1978-11-02', phone: '774563536', email: 'sycheikh2@gmail.com', lastVisit: '2025-04-01' },
  { id: 3, name: 'Mamadou Gueye', dob: '1992-07-22', phone: '788466478', email: 'gueyemamadou3@gmail.com.com', lastVisit: '2025-03-15' },
  { id: 4, name: 'Abdoulaye Sow', dob: '1965-09-18', phone: '708787699', email: 'sowabdoulaye4@gmail.com', lastVisit: '2025-03-20' },
  { id: 5, name: 'Sophia Diallo', dob: '2000-01-30', phone: '758337788', email: 'diallosophia5@gmail.com', lastVisit: '2025-02-10' },
  { id: 6, name: 'Samba Ndiaye', dob: '1980-05-12', phone: '788389973', email: 'ndiayesamba6@gmail.com', lastVisit: '2025-03-25' },
  { id: 7, name: 'Rokhaya Diallo', dob: '1995-12-08', phone: '778556687', email: 'diallorokhaya7@gmail.com', lastVisit: '2025-03-28' },
  { id: 8, name: 'Samba Diallo', dob: '1972-04-25', phone: '779895533', email: 'diallosamba8@gmail.com', lastVisit: '2025-04-01' }
];

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 6;

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // Calculate pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
        <Link to="/patients/new" className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          <span>New Patient</span>
        </Link>
      </div>
      
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="btn btn-outline flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            
            <select className="form-input py-2 bg-white">
              <option>All Patients</option>
              <option>Recent Visits</option>
              <option>Upcoming Appointments</option>
              <option>Active Treatments</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Patient Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date of Birth</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Last Visit</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <Link to={`/patients/${patient.id}`} className="font-medium text-blue-500 hover:text-blue-600">
                      {patient.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(patient.dob).toLocaleDateString()} ({calculateAge(patient.dob)} y.o.)
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-600">{patient.phone}</div>
                    <div className="text-slate-500 text-sm">{patient.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/patients/${patient.id}`} className="text-sm text-blue-500 hover:text-blue-600">
                        View
                      </Link>
                      <Link to={`/appointments/new?patient=${patient.id}`} className="text-sm text-slate-500 hover:text-slate-700">
                        Schedule
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              
              {currentPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No patients found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredPatients.length > patientsPerPage && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium">{indexOfFirstPatient + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastPatient, filteredPatients.length)}
              </span>{' '}
              of <span className="font-medium">{filteredPatients.length}</span> patients
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-outline p-2"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-md text-sm ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-outline p-2"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
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

export default Patients;