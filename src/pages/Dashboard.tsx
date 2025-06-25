import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarClock, ClipboardList, Clock, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Données de démonstration
const rendezVousAujourdhui = [
  { id: 1, heure: '09:00', patient: 'Moustapha Diallo', type: 'Consultation', statut: 'enregistré' },
  { id: 2, heure: '10:30', patient: 'Cheikh Sy', type: 'Suivi', statut: 'planifié' },
  { id: 3, heure: '11:45', patient: 'Mamadou Gueye', type: 'Consultation', statut: 'planifié' },
  { id: 4, heure: '14:15', patient: 'Abdoulaye Sow', type: 'Vaccination', statut: 'planifié' },
  { id: 5, heure: '16:00', patient: 'Sophia Diallo', type: 'Examen physique', statut: 'planifié' }
];

const patientsRecents = [
  { id: 1, nom: 'Samba Ndiaye', derniereVisite: '2025-04-01', motif: 'Symptômes grippaux' },
  { id: 2, nom: 'Rokhaya Diallo', derniereVisite: '2025-03-28', motif: 'Consultation prénatale' },
  { id: 3, nom: 'Samba Diallo', derniereVisite: '2025-03-25', motif: 'Contrôle tension artérielle' }
];

const TableauDeBord: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bienvenue, {user?.name}</h1>
          <p className="text-slate-500">Votre activité du jour</p>
        </div>
        <div className="flex gap-3">
          <Link to="/patients/nouveau" className="btn btn-outline flex items-center gap-2">
            <Plus size={16} />
            <span>Nouveau patient</span>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card flex items-center p-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Patients totaux</div>
            <div className="text-2xl font-bold">10</div>
          </div>
        </div>
        
        <div className="card flex items-center p-6">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-4">
            <CalendarClock size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Rendez-vous aujourd'hui</div>
            <div className="text-2xl font-bold">5</div>
          </div>
        </div>
        
        <div className="card flex items-center p-6">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-4">
            <ClipboardList size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Dossiers en attente</div>
            <div className="text-2xl font-bold">3</div>
          </div>
        </div>
        
        <div className="card flex items-center p-6">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Temps d'attente moyen</div>
            <div className="text-2xl font-bold">15 minutes</div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rendez-vous du jour */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Rendez-vous aujourd'hui</h2>
              <Link to="/rendez-vous" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                Voir tout <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Heure</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Statut</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rendezVousAujourdhui.map((rendezVous) => (
                    <tr key={rendezVous.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{rendezVous.heure}</td>
                      <td className="py-3 px-4">
                        <Link to={`/patients/${rendezVous.id}`} className="text-blue-500 hover:text-blue-600">
                          {rendezVous.patient}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{rendezVous.type}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          rendezVous.statut === 'enregistré' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {rendezVous.statut === 'enregistré' ? 'Enregistré' : 'Planifié'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-sm text-slate-500 hover:text-slate-700">Voir</button>
                          {rendezVous.statut !== 'enregistré' && (
                            <button className="text-sm text-blue-500 hover:text-blue-600">Enregistrer</button>
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
        
        {/* Patients récents */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Patients récents</h2>
              <Link to="/patients" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                Voir tout <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {patientsRecents.map((patient) => (
                <div key={patient.id} className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                    {patient.nom.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">
                      <Link to={`/patients/${patient.id}`} className="text-blue-500 hover:text-blue-600">
                        {patient.nom}
                      </Link>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center">
                      <span>Dernière visite : {new Date(patient.derniereVisite).toLocaleDateString('fr-FR')}</span>
                      <span className="mx-1">•</span>
                      <span>{patient.motif}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <button className="w-full py-2 text-center text-sm text-blue-500 hover:text-blue-600 font-medium">
                Voir plus de patients
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauDeBord;