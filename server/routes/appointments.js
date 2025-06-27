import express from 'express';
import mysql from 'mysql2';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../index.js').db || require('mysql2').createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'medoc'
});

const router = express.Router();

// Récupérer tous les rendez-vous
router.get('/', (req, res) => {
  const { date, patientId, doctorId, status } = req.query;
  let sql = 'SELECT * FROM appointments WHERE 1=1';
  const params = [];
  if (date) { sql += ' AND date = ?'; params.push(date); }
  if (patientId) { sql += ' AND patientId = ?'; params.push(patientId); }
  if (doctorId) { sql += ' AND doctorId = ?'; params.push(doctorId); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.json(results);
  });
});

// Récupérer un rendez-vous par son ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM appointments WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    res.json(results[0]);
  });
});

// Créer un nouveau rendez-vous
router.post('/', (req, res) => {
  const appointment = {
    ...req.body,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };
  db.query('INSERT INTO appointments SET ?', appointment, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    db.query('SELECT * FROM appointments WHERE id = ?', [result.insertId], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.status(201).json(results2[0]);
    });
  });
});

// Mettre à jour un rendez-vous
router.put('/:id', (req, res) => {
  db.query('UPDATE appointments SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    db.query('SELECT * FROM appointments WHERE id = ?', [req.params.id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.json(results2[0]);
    });
  });
});

// Supprimer un rendez-vous
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM appointments WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    res.json({ message: 'Rendez-vous supprimé avec succès' });
  });
});

// Enregistrer l'arrivée du patient
router.post('/:id/check-in', (req, res) => {
  db.query('UPDATE appointments SET status = ?, checkedInAt = ? WHERE id = ? AND status = ?', ['checked-in', new Date().toISOString(), req.params.id, 'scheduled'], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.affectedRows === 0) return res.status(400).json({ message: 'Le rendez-vous n\'est pas en statut programmé ou non trouvé' });
    db.query('SELECT * FROM appointments WHERE id = ?', [req.params.id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.json(results2[0]);
    });
  });
});

// Marquer un rendez-vous comme terminé
router.post('/:id/complete', (req, res) => {
  db.query('UPDATE appointments SET status = ?, completedAt = ? WHERE id = ?', ['completed', new Date().toISOString(), req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    db.query('SELECT * FROM appointments WHERE id = ?', [req.params.id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.json(results2[0]);
    });
  });
});

export default router;