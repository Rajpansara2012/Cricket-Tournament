const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../module/user');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, type, email, password } = req.body;
        // console.log(username);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, type, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully.', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {

            req.session.userId = user._id;
            // console.log(req.session);
            res.json({ message: 'Logged in successfully.' });
        } else {
            res.status(401).json({ error: 'Invalid credentials.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
router.post('/profile', async (req, res) => {
    if (req.session.userId) {
        const id = req.session.userId;
        // console.log(id);
        const user = await User.findOne({ _id: id });
        res.json({ message: 'Profile data retrieved.', user: user });

    } else {
        res.status(401).json({ error: 'Unauthorized.' });
    }
});
router.post('/logout', (req, res) => {
    if (req.session.userId) {
        req.session.destroy((err) => {

            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).json({ error: 'An error occurred while logging out.' });
            } else {
                res.clearCookie('connect.sid');
                res.json({ message: 'Logged out successfully.' });
            }
        });
    }
    else {
        res.json({ message: 'already Logged out successfully.' });
    }
});

module.exports = router;
