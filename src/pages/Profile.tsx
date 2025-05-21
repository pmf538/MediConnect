import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
  specialization: string;
  phone: string;
  address: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      specialization: user?.specialization || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Profil du Médecin</h1>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-500">{user?.specialization || 'Médecin Généraliste'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-outline"
          >
            {isEditing ? 'Annuler' : 'Modifier le profil'}
          </button>
        </div>

        {isEditing ? (
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
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  {...register('email', { required: 'L\'email est requis' })}
                  type="email"
                  id="email"
                  className="form-input"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="specialization">Spécialisation</label>
                <input
                  {...register('specialization')}
                  type="text"
                  id="specialization"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="phone">Téléphone</label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="form-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label" htmlFor="address">Adresse du cabinet</label>
                <input
                  {...register('address')}
                  type="text"
                  id="address"
                  className="form-input"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Email</h3>
                <p className="mt-1">{user?.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">Téléphone</h3>
                <p className="mt-1">{user?.phone || 'Non renseigné'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">Spécialisation</h3>
                <p className="mt-1">{user?.specialization || 'Médecin Généraliste'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">Adresse du cabinet</h3>
                <p className="mt-1">{user?.address || 'Non renseignée'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;