import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Données de démonstration
let prescriptions = [
  { id: '1', patientId: '1', patient: 'Fatou Diallo', medication: 'Ventoline', dosage: '100mcg', frequency: 'En cas de besoin', issued: '2024-11-10', ends: '2025-11-10', status: 'active', doctorId: '1' },
  { id: '2', patientId: '1', patient: 'Fatou Diallo', medication: 'Amlodipine', dosage: '5mg', frequency: 'Une fois par jour', issued: '2024-11-10', ends: '2025-02-10', status: 'expired', doctorId: '1' },
  { id: '3', patientId: '1', patient: 'Fatou Diallo', medication: 'Amoxicilline', dosage: '500mg', frequency: 'Trois fois par jour', issued: '2025-01-15', ends: '2025-01-22', status: 'completed', doctorId: '1' },
  { id: '4', patientId: '2', patient: 'Moussa Sow', medication: 'Metformine', dosage: '500mg', frequency: 'Deux fois par jour', issued: '2025-02-20', ends: '2025-08-20', status: 'active', doctorId: '1' }
];

// Get all prescriptions
router.get('/', (req, res) => {
  // Filter by patientId or status if provided
  const { patientId, status, doctorId } = req.query;
  
  let filteredPrescriptions = [...prescriptions];
  
  if (patientId) {
    filteredPrescriptions = filteredPrescriptions.filter(p => p.patientId === patientId);
  }
  
  if (status) {
    filteredPrescriptions = filteredPrescriptions.filter(p => p.status === status);
  }
  
  if (doctorId) {
    filteredPrescriptions = filteredPrescriptions.filter(p => p.doctorId === doctorId);
  }
  
  res.json(filteredPrescriptions);
});

// Get prescription by ID
router.get('/:id', (req, res) => {
  const prescription = prescriptions.find(p => p.id === req.params.id);
  
  if (!prescription) {
    return res.status(404).json({ message: 'Ordonnance non trouvée' });
  }
  
  res.json(prescription);
});

// Create new prescription
router.post('/', (req, res) => {
  const newPrescription = {
    id: uuidv4(),
    ...req.body,
    issued: new Date().toISOString().split('T')[0],
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  prescriptions.push(newPrescription);
  res.status(201).json(newPrescription);
});

// Update prescription
router.put('/:id', (req, res) => {
  const prescriptionIndex = prescriptions.findIndex(p => p.id === req.params.id);
  
  if (prescriptionIndex === -1) {
    return res.status(404).json({ message: 'Ordonnance non trouvée' });
  }
  
  prescriptions[prescriptionIndex] = {
    ...prescriptions[prescriptionIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json(prescriptions[prescriptionIndex]);
});

// Mark prescription as expired
router.post('/:id/expire', (req, res) => {
  const prescriptionIndex = prescriptions.findIndex(p => p.id === req.params.id);
  
  if (prescriptionIndex === -1) {
    return res.status(404).json({ message: 'Ordonnance non trouvée' });
  }
  
  prescriptions[prescriptionIndex].status = 'expired';
  prescriptions[prescriptionIndex].endedAt = new Date().toISOString();
  
  res.json(prescriptions[prescriptionIndex]);
});

// Renew prescription
router.post('/:id/renew', (req, res) => {
  const prescription = prescriptions.find(p => p.id === req.params.id);
  
  if (!prescription) {
    return res.status(404).json({ message: 'Ordonnance non trouvée' });
  }
  
  // Create a new prescription based on the old one
  const renewalDate = new Date().toISOString().split('T')[0];
  const expiryDate = req.body.ends || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0];
  
  const newPrescription = {
    id: uuidv4(),
    patientId: prescription.patientId,
    patient: prescription.patient,
    medication: prescription.medication,
    dosage: prescription.dosage,
    frequency: prescription.frequency,
    issued: renewalDate,
    ends: expiryDate,
    status: 'active',
    doctorId: prescription.doctorId,
    renewedFromId: prescription.id,
    createdAt: new Date().toISOString()
  };
  
  prescriptions.push(newPrescription);
  res.status(201).json(newPrescription);
});

export default router;