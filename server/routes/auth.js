import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock users data - in a real app, this would be in a database with hashed passwords
const users = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@medical.com',
    password: 'password123',
    role: 'doctor'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@medical.com',
    password: 'password123',
    role: 'nurse'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@medical.com',
    password: 'admin123',
    role: 'admin'
  }
];

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // In a real app, this would be more secure - this is just for demo purposes
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create a JWT token (use a secure secret in production)
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
  
  // Remove password from the user object
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    token,
    user: userWithoutPassword
  });
});

// Get current user
router.get('/me', (req, res) => {
  // For actual implementation, this would verify the JWT token
  // and return the user data based on the token
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify and decode the token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    // Find the user
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from the user object
    const { password: _, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// Register route - in a real app you'd have more validation and security
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password, // In a real app, this would be hashed
    role: role || 'staff',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json(userWithoutPassword);
});

export default router;