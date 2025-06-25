import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Filter } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale'; // Import de la locale française
import { Dialog } from '@headlessui/react'

// Données de démonstration pour les rendez-vous
const rendezVous = [
  { id: 1, heure: '09:00', patient: 'Moustapha Diallo', type: 'Consultation', statut: 'enregistré', date: '2025-07-05' },
  { id: 2, heure: '10:30', patient: 'Cheikh Sy', type: 'Suivi', statut: 'planifié', date: '2025-07-05' },
  { id: 3, heure: '11:45', patient: 'Mamadou Gueye', type: 'Consultation', statut: 'planifié', date: '2025-06-29' },
  // ... autres rendez-vous avec les champs traduits
];

// Dates avec rendez-vous pour les indicateurs visuels du calendrier
const datesAvecRendezVous = Array.from(new Set(rendezVous.map(rdv => rdv.date)));

type DatePiece = Date | null;
type DateValue = DatePiece | [DatePiece, DatePiece];

const RendezVous: React.FC = () => {
  const [dateSelectionnee, setDateSelectionnee] = useState<DateValue>(new Date('2025-04-05'));
  const [termeRecherche, setTermeRecherche] = useState('');
  const [afficherModal, setAfficherModal] = useState(false);
  const [nouveauRendezVous, setNouveauRendezVous] = useState({
    heure: '',
    patient: '',
    type: '',
    statut: 'planifié',
    date: dateSelectionnee instanceof Date ? format(dateSelectionnee, 'yyyy-MM-dd') : '',
  });
  const [tousLesRendezVous, setTousLesRendezVous] = useState(rendezVous);

  // Mise à jour de la date du nouveau rendez-vous
  React.useEffect(() => {
    setNouveauRendezVous((prev) => ({
      ...prev,
      date: dateSelectionnee instanceof Date ? format(dateSelectionnee, 'yyyy-MM-dd') : '',
    }));
  }, [dateSelectionnee]);

  // Filtrage des rendez-vous
  const rendezVousFiltres = tousLesRendezVous.filter(rdv => {
    if (!dateSelectionnee) return false;
    const dateFormatee = dateSelectionnee instanceof Date
      ? format(dateSelectionnee, 'yyyy-MM-dd')
      : '';
    return rdv.date === dateFormatee && 
      (rdv.patient.toLowerCase().includes(termeRecherche.toLowerCase()) || 
       rdv.type.toLowerCase().includes(termeRecherche.toLowerCase()));
  });

  // Affichage des points sur le calendrier
  const contenuCaseCalendrier = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateFormatee = format(date, 'yyyy-MM-dd');
    const aDesRendezVous = datesAvecRendezVous.includes(dateFormatee);
    
    return aDesRendezVous ? (
      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-1"></div>
    ) : null;
  };
  
  // Gestion de l'ajout d'un nouveau rendez-vous
  const ajouterRendezVous = (e: React.FormEvent) => {
    e.preventDefault();
    setTousLesRendezVous([
      ...tousLesRendezVous,
      {
        ...nouveauRendezVous,
        id: tousLesRendezVous.length + 1,
      }
    ]);
    setAfficherModal(false);
    setNouveauRendezVous({
      heure: '',
      patient: '',
      type: '',
      statut: 'planifié',
      date: dateSelectionnee instanceof Date ? format(dateSelectionnee, 'yyyy-MM-dd') : '',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Modal d'ajout de rendez-vous */}
      {afficherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Nouveau rendez-vous</h2>
            <form onSubmit={ajouterRendezVous} className="space-y-4">
              {/* Champs du formulaire */}
              <div>
                <label className="block text-sm font-medium mb-1">Patient</label>
                <input
                  type="text"
                  required
                  value={nouveauRendezVous.patient}
                  onChange={e => setNouveauRendezVous({ ...nouveauRendezVous, patient: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>
              {/* ... autres champs ... */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAfficherModal(false)}
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

      {/* En-tête de page */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gestion des rendez-vous</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-outline flex items-center gap-2"
            onClick={() => setAfficherModal(true)}
          >
            <Plus size={16} />
            <span>Ajouter un rendez-vous</span>
          </button>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Calendrier</h2>
            <ReactCalendar
              onChange={setDateSelectionnee}
              value={dateSelectionnee}
              tileContent={contenuCaseCalendrier}
              className="border-none"
              locale="fr" // Configuration française du calendrier
            />
            
            {/* Navigation du calendrier */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <button className="btn btn-outline p-2">
                  <ChevronLeft size={16} />
                </button>
                <h3 className="font-medium">
                  {dateSelectionnee instanceof Date && format(dateSelectionnee, 'MMMM yyyy', { locale: fr })}
                </h3>
                <button className="btn btn-outline p-2">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des rendez-vous */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                {dateSelectionnee instanceof Date && format(dateSelectionnee, 'EEEE d MMMM yyyy', { locale: fr })}
              </h2>
              <div className="flex gap-3">
                {/* Barre de recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un rendez-vous..."
                    value={termeRecherche}
                    onChange={(e) => setTermeRecherche(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>
                <button className="btn btn-outline flex items-center gap-2">
                  <Filter size={16} />
                  <span>Filtrer</span>
                </button>
              </div>
            </div>
            
            {/* Affichage conditionnel */}
            {rendezVousFiltres.length > 0 ? (
              <div className="space-y-4">
                {rendezVousFiltres.map((rdv) => (
                  <div key={rdv.id} className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-16 text-center">
                      <div className="text-lg font-medium">{rdv.heure}</div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{rdv.patient}</div>
                      <div className="text-sm text-slate-500">{rdv.type}</div>
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        rdv.statut === 'enregistré' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {rdv.statut === 'enregistré' ? 'Enregistré' : 'Planifié'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-lg font-medium text-slate-700">Aucun rendez-vous</h3>
                <p className="mt-1 text-slate-500">
                  {termeRecherche
                    ? 'Aucun rendez-vous ne correspond à votre recherche'
                    : 'Aucun rendez-vous prévu pour cette date'}
                </p>
                <div className="mt-6">
                  <button onClick={() => setAfficherModal(true)} className="btn btn-primary">
                    Planifier un rendez-vous
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendezVous;