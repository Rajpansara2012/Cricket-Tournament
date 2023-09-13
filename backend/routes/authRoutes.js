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
            // console.log(req.session.userId);
            res.cookie('token', user._id, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), httpOnly: true }).json({ message: 'Logged in successfully.', user });
            // console.log(res.cookies)
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
    // console.log("In logout")
    try {
        res.status(200).cookie("token", null, {
            expires: new Date(), httpOnly: true
        }).json({
            success: true,
            message: "Logged Out"
        })

    } catch (e) {
        res.status(500).json({ success: false, error: e.message })
    }
});

module.exports = router;
