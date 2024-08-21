const express = require('express');
const router = express.Router();
const Account = require('../models/account'); 

router.get('/login', (req, res) => {
    res.render('userLogin', { errors: [], session: req.session });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    Account.findOne({ username }).exec().then(account => {
        if (account && account.password === password) { 
            req.session.userId = account._id;
            res.redirect('/admin/posts');
        } else {
            res.render('userLogin', { errors: [{ msg: 'Invalid username or password' }], session: req.session });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send('Server error');
    });
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
