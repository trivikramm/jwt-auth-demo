const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN} = require('../config');

const users = [];

// SIGNUP - update the catch block
const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log('📨 Signup request received:', { name, email }); // ADD THIS

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
    };
    users.push(newUser);

    console.log('✅ User saved:', { id: newUser.id, email: newUser.email }); // ADD THIS

    res.status(201).json({ message: '✅ User created successfully!' });

  } catch (err) {
    console.error('🔴 SIGNUP ERROR:', err);  // ← CHANGE THIS LINE
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGIN - update the catch block
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('📨 Login request received:', { email }); // ADD THIS

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: '✅ Login successful!',
      token: token,
    });

  } catch (err) {
    console.error('🔴 LOGIN ERROR:', err);  // ← CHANGE THIS LINE
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllUsers = (req, res) => {
  // Show users WITHOUT passwords (never expose passwords!)
  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    // password: HIDDEN for security
  }));

  res.json({
    totalUsers: users.length,
    users: safeUsers,
  });
};

module.exports = {signup, login, getAllUsers};