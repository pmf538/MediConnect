import express from 'express';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// Récupérer tous les rendez-vous
router.get('/', async (req, res) => {
  try {
    const { date, patientId, doctorId, status } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer un rendez-vous par son ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un nouveau rendez-vous
router.post('/', async (req, res) => {
  try {
    const newAppointment = new Appointment({
      ...req.body,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un rendez-vous
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date().toISOString() },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un rendez-vous
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json({ message: 'Rendez-vous supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Enregistrer l'arrivée du patient
router.post('/:id/check-in', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ message: 'Le rendez-vous n\'est pas en statut programmé' });
    }
    appointment.status = 'checked-in';
    appointment.checkedInAt = new Date().toISOString();
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Marquer un rendez-vous comme terminé
router.post('/:id/complete', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    appointment.status = 'completed';
    appointment.completedAt = new Date().toISOString();
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;