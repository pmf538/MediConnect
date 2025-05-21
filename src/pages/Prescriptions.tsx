import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';

// Mock data
const prescriptions = [
  { id: 1, patient: 'Moustapha Diallo', medication: 'Ventolin HFA', dosage: '90mcg', frequency: 'As needed', issued: '2024-11-10', ends: '2025-11-10', status: 'active' },
  { id: 2, patient: 'Cheikh Sy', medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', issued: '2024-11-10', ends: '2025-02-10', status: 'expired' },
  { id: 3, patient: 'Mamadou Gueye', medication: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', issued: '2025-01-15', ends: '2025-01-22', status: 'completed' },
  { id: 4, patient: 'Abdoulaye Sow', medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily', issued: '2025-02-20', ends: '2025-08-20', status: 'active' },
  { id: 5, patient: 'Sophia Diallo', medication: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', issued: '2025-01-30', ends: '2025-07-30', status: 'active' },
  { id: 6, patient: 'Samba Ndiaye', medication: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', issued: '2025-03-15', ends: '2025-06-15', status: 'active' },
  { id: 7, patient: 'Rokhaya Diallo', medication: 'Prednisone', dosage: '5mg', frequency: 'Once daily', issued: '2025-02-10', ends: '2025-03-10', status: 'completed' },
  { id: 8, patient: 'Samba Diallo', medication: 'Sertraline', dosage: '50mg', frequency: 'Once daily', issued: '2025-01-05', ends: '2025-07-05', status: 'active' }
];

type FilterStatus = 'all' | 'active' | 'expired' | 'completed';

const Prescriptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  
  // Filter prescriptions based on search term and status
  const filteredPrescriptions = prescriptions.filter(prescription => 
    (statusFilter === 'all' || prescription.status === statusFilter) &&
    (prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
     prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Prescriptions</h1>
        <Link to="/prescriptions/new" className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          <span>New Prescription</span>
        </Link>
      </div>
      
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search prescriptions..."
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
            
            <select 
              className="form-input py-2 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            >
              <option value="all">All Prescriptions</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Medication</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Dosage</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Frequency</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Issued Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">End Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <Link to={`/patients/${prescription.id}`} className="font-medium text-blue-500 hover:text-blue-600">
                      {prescription.patient}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-medium">{prescription.medication}</td>
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
                      <Link to={`/prescriptions/${prescription.id}`} className="text-sm text-blue-500 hover:text-blue-600">
                        View
                      </Link>
                      {prescription.status === 'active' && (
                        <button className="text-sm text-slate-500 hover:text-slate-700">
                          Renew
                        </button>
                      )}
                      {prescription.status === 'expired' && (
                        <button className="text-sm text-slate-500 hover:text-slate-700">
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredPrescriptions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500">
                    No prescriptions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;