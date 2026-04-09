const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/signup',signup);
router.post('/login', login);

router.get('/users', getAllUsers);

router.get('/profile', verifyToken, (req, res) => {
    res.json({
        message: '✅ You accessed a protected route!',
        user: req.user,
    });
});

module.exports = router;