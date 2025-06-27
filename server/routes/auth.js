import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
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

// Middleware de vérification du token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route de connexion sécurisée
router.post('/login', 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
      if (results.length === 0) {
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
    });
  }
);

// Route protégée
router.get('/me', authenticateToken, (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.user.userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (results.length === 0) return res.sendStatus(404);
    const { password, ...safeUser } = results[0];
    res.json(safeUser);
  });
});

export default router;