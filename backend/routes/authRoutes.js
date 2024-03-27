const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');


const upload = multer({ dest: 'uploads/' });

cloudinary.config({
    cloud_name: 'dspsdpx5c',
    api_key: '637215419864166',
    api_secret: 'sVB4INWe3v5JHUVzEsLWMbao37s'
});
router.post('/signup', upload.single('photo'), async (req, res) => {
    try {
        const { username, type, email, password } = req.body;
        const check1 = await User.findOne({ username: username });
        const check2 = await User.findOne({ email: email });
        console.log(check1)
        console.log(check2)

        if (check1 || check2) {
            res.json({ message: "you can not take this username or email" })
        }
        else {
            const photoFile = req.file;
            // console.log(photoFile);

            const result = await cloudinary.uploader.upload(photoFile.path);


            const imageUrl = cloudinary.url(result.public_id, { secure: true });
            // console.log(imageUrl)
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, type, password: hashedPassword, img_url: imageUrl });
            await user.save();
            res.status(201).json({ message: 'User created successfully.', user });
        }


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
            res.cookie('token', user._id, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
            res.cookie('user_type', user.type, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
            res.cookie('username', user.username, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
            // console.log(user);
            if (user.img_url) {
                console.log("mangal");
                res.cookie('profile_img', user.img_url, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
            }
            else {
                console.log("dhruvin")
                res.cookie('profile_img', "", { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
            }
            res.json({
                message: "loging succsesful",
                user: user
            })


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
        })
        res.status(200).cookie("user_type", null, {
            expires: new Date(), httpOnly: true
        })
        res.status(200).cookie("username", null, {
            expires: new Date(), httpOnly: true
        })
        res.json({
            success: true,
            message: "Logged Out"
        })


    } catch (e) {
        res.status(500).json({ success: false, error: e.message })
    }
});


module.exports = router;
