const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const verifyToken = (req, res, next) => {
  // 🔍 DEBUG: See ALL headers coming in
  console.log('📨 ALL HEADERS:', JSON.stringify(req.headers, null, 2));

  const authHeader = req.headers['authorization'];
  console.log('🔍 Authorization header:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  console.log('🔍 Extracted token:', token ? token.substring(0, 20) + '...' : 'NONE');

  if (!token) {
    return res.status(401).json({ error: '❌ No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('🔴 JWT verify error:', err.message);
    return res.status(403).json({ error: '❌ Invalid or expired token' });
  }
};

module.exports = verifyToken;