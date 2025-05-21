import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface PrescriptionFormData {
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

const NewPrescription: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  
  const { register, handleSubmit, formState: { errors } } = useForm<PrescriptionFormData>({
    defaultValues: {
      patientId: patientId || ''
    }
  });

  const onSubmit = async (data: PrescriptionFormData) => {
    try {
      const response = await axios.post(`${API_URL}/prescriptions`, data);
      navigate(`/prescriptions/${response.data.id}`);
    } catch (error) {
      console.error('Erreur lors de la création de l\'ordonnance:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/prescriptions')}
          className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span>Retour aux ordonnances</span>
        </button>
      </div>

      <div className="card">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Nouvelle Ordonnance</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label" htmlFor="medication">Médicament</label>
              <input
                {...register('medication', { required: 'Le médicament est requis' })}
                type="text"
                id="medication"
                className="form-input"
              />
              {errors.medication && <p className="text-red-500 text-sm mt-1">{errors.medication.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="dosage">Dosage</label>
              <input
                {...register('dosage', { required: 'Le dosage est requis' })}
                type="text"
                id="dosage"
                className="form-input"
                placeholder="Ex: 500mg"
              />
              {errors.dosage && <p className="text-red-500 text-sm mt-1">{errors.dosage.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="frequency">Fréquence</label>
              <input
                {...register('frequency', { required: 'La fréquence est requise' })}
                type="text"
                id="frequency"
                className="form-input"
                placeholder="Ex: 3 fois par jour"
              />
              {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="duration">Durée</label>
              <input
                {...register('duration', { required: 'La durée est requise' })}
                type="text"
                id="duration"
                className="form-input"
                placeholder="Ex: 7 jours"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="notes">Instructions spéciales</label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={4}
              className="form-input"
              placeholder="Instructions supplémentaires pour le patient..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/prescriptions')}
              className="btn btn-outline"
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Créer l'ordonnance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPrescription;