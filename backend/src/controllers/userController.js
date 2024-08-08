const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Ping endpoint for server health check
exports.ping = (req, res) => {
  try {

    res.status(200).json({ message: 'Server is up and running!' });
  } catch (err) {
    console.error('Failed to ping server:', err);
    res.status(500).json({ error: 'Failed to ping server.' });
  }
};


exports.getAuthentication = (req, res) => {
  try {
    
    console.log('Request Headers:', req.headers);
    res.status(200).json({ message: 'Authentication is good!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate.' });
  }
};


// Sign Up
exports.signUp = async (req, res) => {
  const {auth0_id, email, name, password, organization } = req.body;
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        auth0_id,
        email,
        name,
        password: hashedPassword,
        organization,
      },
    });
    
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to sign up user.' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log in user.' });
  }
};

// View User Details
exports.viewUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details.' });
  }
};

// Update User Details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, name, password, organization } = req.body;
  
  try {
    const updateData = {};
    
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (organization) updateData.organization = organization;
    
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

// Delete User Account
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};
