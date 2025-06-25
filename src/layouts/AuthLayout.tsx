import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Stethoscope } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-teal-500 text-white p-12">
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-2 mb-12">
            <Stethoscope size={32} />
            <span className="font-bold text-2xl">MediConnect</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-6">Gestion moderne de cabinet médical</h1>
            <p className="text-xl opacity-90 mb-8">Simplifiez votre pratique avec notre solution complète pour la prise de rendez-vous, la gestion des patients et la prescription médicale.</p>
            
            <div className="border border-white/30 rounded-lg p-6 bg-white/10 backdrop-blur-sm">
              <h3 className="font-semibold text-xl mb-3">Pourquoi choisir MediConnect ?</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span>Prise de rendez-vous intuitive</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span>Dossiers patients complets</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span>Gestion sécurisée des ordonnances</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span>Optimisation des flux de travail</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-auto text-sm opacity-70">
            © 2025 MediConnect. Tous droits réservés.
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <Stethoscope size={28} className="text-blue-500" />
            <span className="font-bold text-xl text-blue-500">MediConnect</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;