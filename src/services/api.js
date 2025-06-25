const API_URL = 'http://localhost:5000/api'; // URL du backend

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de l\'utilisateur');
  }
  return response.json();
};


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserManager from './components/UserManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UserManager />} />
        {/* autres routes */}
      </Routes>
    </Router>
  );
}