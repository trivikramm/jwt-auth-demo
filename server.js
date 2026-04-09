const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
const authRoutes = require('./routes/auth');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('./config');
console.log('🔑 JWT_SECRET loaded:', JWT_SECRET ? '✅ YES' : '❌ MISSING');
console.log('⏰ JWT_EXPIRES_IN:', JWT_EXPIRES_IN);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, ()=>{
    console.log(`✅ Server running on http://localhost:${PORT}`);
})