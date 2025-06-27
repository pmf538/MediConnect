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

// Get all prescriptions
router.get('/', (req, res) => {
  const { patientId, status, doctorId } = req.query;
  let sql = 'SELECT * FROM prescriptions WHERE 1=1';
  const params = [];
  if (patientId) { sql += ' AND patientId = ?'; params.push(patientId); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (doctorId) { sql += ' AND doctorId = ?'; params.push(doctorId); }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.json(results);
  });
});

// Get prescription by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM prescriptions WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Ordonnance non trouvée' });
    res.json(results[0]);
  });
});

// Create new prescription
router.post('/', (req, res) => {
  const prescription = {
    ...req.body,
    issued: new Date().toISOString().split('T')[0],
    status: 'active',
    createdAt: new Date().toISOString()
  };
  db.query('INSERT INTO prescriptions SET ?', prescription, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    db.query('SELECT * FROM prescriptions WHERE id = ?', [result.insertId], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.status(201).json(results2[0]);
    });
  });
});

// Update prescription
router.put('/:id', (req, res) => {
  db.query('UPDATE prescriptions SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Ordonnance non trouvée' });
    db.query('SELECT * FROM prescriptions WHERE id = ?', [req.params.id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.json(results2[0]);
    });
  });
});

// Mark prescription as expired
router.post('/:id/expire', (req, res) => {
  db.query('UPDATE prescriptions SET status = ?, endedAt = ? WHERE id = ?', ['expired', new Date().toISOString(), req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Ordonnance non trouvée' });
    db.query('SELECT * FROM prescriptions WHERE id = ?', [req.params.id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      res.json(results2[0]);
    });
  });
});

// Renew prescription
router.post('/:id/renew', (req, res) => {
  db.query('SELECT * FROM prescriptions WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Ordonnance non trouvée' });
    const prescription = results[0];
    const renewalDate = new Date().toISOString().split('T')[0];
    const expiryDate = req.body.ends || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0];
    const newPrescription = {
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
    db.query('INSERT INTO prescriptions SET ?', newPrescription, (err2, result2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      db.query('SELECT * FROM prescriptions WHERE id = ?', [result2.insertId], (err3, results3) => {
        if (err3) return res.status(500).json({ message: 'Erreur serveur', error: err3 });
        res.status(201).json(results3[0]);
      });
    });
  });
});

export default router;