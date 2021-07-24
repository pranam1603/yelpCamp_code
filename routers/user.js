const express = require('express');
const passport = require('passport');
const router = express.Router();
const userControls = require('../controller/user')

router.route('/register')
    .get(userControls.renderRegisterForm)
    .post(userControls.register);   

router.route('/login')
    .get(userControls.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userControls.login);

router.get('/logout', userControls.logout)

module.exports = router