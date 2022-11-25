const express = require('express');
const {User,generateAuthToken} = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');


// Register User
router.post('/users/register', async (req, res) => {
    const user = User.build(req.body);
    user.password = await bcrypt.hash(user.password,8);

    try {
        await user.save();
        const token = await generateAuthToken(user);
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login User
router.post('/users/login', async (req, res) => {
    try {
        const user = await findByCredentials(req.body.email, req.body.password);
        const token = await generateAuthToken(user);
        res.send({ user: user, token });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// Logout User
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.authToken = null;
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send();
    }
});

// changePassword
router.patch('/users/changePassword', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' });
    }

    try {

        if(allowedUpdates.includes('password')){
            req.user.password = await bcrypt.hash(req.body.password,8);
            await req.user.save();
        }
        res.status(200).send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;