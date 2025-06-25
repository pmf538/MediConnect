import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Données de démonstration 
let patients = [
  { 
    id: '1', 
    name: 'Fatou Diallo', 
    dob: '1985-03-15',
    gender: 'Femme',
    phone: '77 123 45 67',
    email: 'fatou.diallo@example.com',
    address: 'Rue 10, Médina, Dakar',
    insurance: 'IPM Santé',
    insuranceNumber: 'IPM-12345-FD',
    bloodType: 'O+',
    allergies: ['Pénicilline', 'Arachides'],
    conditions: ['Asthme', 'Hypertension'],
    notes: 'Patiente régulière qui suit bien son traitement. Fait de l\'exercice régulièrement.'
  },
  { 
    id: '2', 
    name: 'Moussa Sow', 
    dob: '1978-11-02',
    gender: 'Homme',
    phone: '76 234 56 78',
    email: 'moussa.sow@example.com',
    address: 'Avenue Cheikh Anta Diop, Dakar',
    insurance: 'IPRES Santé',
    insuranceNumber: 'IPRES-67890-MS',
    bloodType: 'A+',
    allergies: ['Sulfamides'],
    conditions: ['Diabète Type 2'],
    notes: 'Patient diabétique bien suivi. Contrôle régulier de sa glycémie.'
  }
];

// Get all patients
router.get('/', (req, res) => {
  res.json(patients);
});

// Get patient by ID
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient non trouvé' });
  }
  
  res.json(patient);
});

// Create new patient
router.post('/', (req, res) => {
  const newPatient = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// Update patient
router.put('/:id', (req, res) => {
  const patientIndex = patients.findIndex(p => p.id === req.params.id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ message: 'Patient non trouvé' });
  }
  
  patients[patientIndex] = {
    ...patients[patientIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json(patients[patientIndex]);
});

// Delete patient
router.delete('/:id', (req, res) => {
  const patientIndex = patients.findIndex(p => p.id === req.params.id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ message: 'Patient non trouvé' });
  }
  
  patients = patients.filter(p => p.id !== req.params.id);
  res.json({ message: 'Patient supprimé avec succès' });
});

export default router;