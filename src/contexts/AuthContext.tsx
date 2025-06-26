import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  specialization?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  error: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('medicalAppToken');
      
      if (token) {
        try {
          
          setUser({
            id: '1',
            name: 'Dr. Amadou Diallo',
            email: 'dialloamadou9@gmail.com',
            role: 'doctor',
            specialization: 'Médecin Généraliste',
            phone: '+221 77 123 45 68',
            address: 'Dakar, Sénégal'
          });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (err) {
          localStorage.removeItem('medicalAppToken');
          console.error('Erreur d\'authentification:', err);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      
      const token = 'mock-jwt-token';
      const userData = {
        id: '1',
        name: 'Dr. Pape Moussa Faye',
        email: 'fayepapemoussa9@gmail.com',
        role: 'doctor',
        specialization: 'Médecin Généraliste',
        phone: '+221 77 123 45 67',
        address: 'Dakar, Sénégal'
      };
      
      localStorage.setItem('medicalAppToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Échec de l\'authentification');
      throw new Error(err.response?.data?.message || 'Échec de l\'authentification');
    }
  };

  const logout = () => {
    localStorage.removeItem('medicalAppToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Échec de la mise à jour du profil');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      updateProfile,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};