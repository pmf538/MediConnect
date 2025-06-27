import express from 'express';
// import { v4 as uuidv4 } from 'uuid';
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

// Get all patients
router.get('/', (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.json(results);
  });
});

// Get patient by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM patients WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Patient non trouvé' });
    res.json(results[0]);
  });
});

// Create new patient
router.post('/', (req, res) => {
  const patient = req.body;
  db.query('INSERT INTO patients SET ?', patient, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    db.query('SELECT * FROM patients WHERE id = ?', [result.insertId], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.status(201).json(results2[0]);
    });
  });
});

// Update patient
router.put('/:id', (req, res) => {
  db.query('UPDATE patients SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Patient non trouvé' });
    db.query('SELECT * FROM patients WHERE id = ?', [req.params.id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.json(results2[0]);
    });
  });
});

// Delete patient
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM patients WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Patient non trouvé' });
    res.json({ message: 'Patient supprimé avec succès' });
  });
});

export default router;