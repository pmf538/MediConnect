import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface PatientFormData {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  insurance: string;
  insuranceNumber: string;
  bloodType: string;
  allergies: string;
  conditions: string;
  notes: string;
}

const NewPatient: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormData>();

  const onSubmit = async (data: PatientFormData) => {
    try {
      const response = await axios.post(`${API_URL}/patients`, {
        ...data,
        allergies: data.allergies.split(',').map(a => a.trim()),
        conditions: data.conditions.split(',').map(c => c.trim())
      });
      
      navigate(`/patients/${response.data.id}`);
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/patients')}
          className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span>Retour à la liste des patients</span>
        </button>
      </div>

      <div className="card">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Nouveau Patient</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label" htmlFor="name">Nom complet</label>
              <input
                {...register('name', { required: 'Le nom est requis' })}
                type="text"
                id="name"
                className="form-input"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="dob">Date de naissance</label>
              <input
                {...register('dob', { required: 'La date de naissance est requise' })}
                type="date"
                id="dob"
                className="form-input"
              />
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="gender">Genre</label>
              <select
                {...register('gender', { required: 'Le genre est requis' })}
                id="gender"
                className="form-input"
              >
                <option value="">Sélectionner...</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="phone">Téléphone</label>
              <input
                {...register('phone', { required: 'Le téléphone est requis' })}
                type="tel"
                id="phone"
                className="form-input"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="address">Adresse</label>
              <input
                {...register('address')}
                type="text"
                id="address"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="insurance">Assurance</label>
              <input
                {...register('insurance')}
                type="text"
                id="insurance"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="insuranceNumber">Numéro d'assurance</label>
              <input
                {...register('insuranceNumber')}
                type="text"
                id="insuranceNumber"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="bloodType">Groupe sanguin</label>
              <select
                {...register('bloodType')}
                id="bloodType"
                className="form-input"
              >
                <option value="">Sélectionner...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="allergies">Allergies (séparées par des virgules)</label>
            <input
              {...register('allergies')}
              type="text"
              id="allergies"
              className="form-input"
              placeholder="Exemple: Pénicilline, Arachides"
            />
          </div>

          <div>
            <label className="form-label" htmlFor="conditions">Conditions médicales (séparées par des virgules)</label>
            <input
              {...register('conditions')}
              type="text"
              id="conditions"
              className="form-input"
              placeholder="Exemple: Asthme, Hypertension"
            />
          </div>

          <div>
            <label className="form-label" htmlFor="notes">Notes</label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={4}
              className="form-input"
              placeholder="Notes additionnelles sur le patient..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="btn btn-outline"
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Créer le patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatient;