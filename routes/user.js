import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';

// Linking the models for MongoDB collections
import Login from '../models/loginModel.js'
import Signup from '../models/signupModel.js'

router.get('/login', (req, res) => {
    res.render('user/login', {title: "Media Review App", layout: './layouts/auth'})
});

router.post('/login', (req, res) => {
    
})

router.get('/signup', (req, res) => {
    res.render('user/signup', {title: "Media Review App", layout: './layouts/auth'})
});

router.post('/signup', async (req, res) => {

});

router.get('/forgot_password', (req, res) => {
    res.render('user/forgot_password', {title: "Media Review App", layout: './layouts/auth'})
});

router.delete('/logout', (req, res) => {
    res.render('logout', {title: "Media Review App", layout: './layouts/auth'})
});

export default router;