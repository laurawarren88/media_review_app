import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';

// Linking the models for MongoDB collections
import User from '../models/userModel.js'

router.get('/login', (req, res) => {
    res.render('user/login', {title: "Media Review App", layout: './layouts/auth'})
});

router.post('/login', (req, res) => {
   
})

router.get('/signup', (req, res) => {
    res.render('user/signup', {title: "Media Review App", layout: './layouts/auth'})
});

router.post('/signup', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    if(username.trim() == '' || email.trim() == '' || password.trim() == '' || confirm_password.trim() === '' ) {
        return res.render('partials/errorMessage', { errorMessage: "Empty input field!" })
    }

    if (!/^[a-zA-Z ]*$/.test(username)){
        return res.render('partials/errorMessage', { errorMessage: "Invalid username, only letters and spaces allowed" })
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.render('partials/errorMessage', { errorMessage: "Invalid email address" })
    }

    if (password.length < 7 ) {
        return res.render('partials/errorMessage', { errorMessage: "Password is too short, must be at least 8 characters" })
    }

    if (password !== confirm_password) {
        return res.render('partials/errorMessage', { errorMessage: "Passwords do not match!" });
    }


    try {
        // Check if user with the given email already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.render('errorPage', { errorMessage: "User with that email already exists!" });
            } else if (existingUser.username === username) {
                return res.render('errorPage', { errorMessage: "Username is already taken!" });
            }
        }
    
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password.trim(), saltRounds)
    const newUser = new User({
        username: username.trim(),
        email: email.trim(),
        password: hashedPassword
    });
    const savedUser = await newUser.save();
    console.log(savedUser)
    res.redirect('login')       
    } catch (err) {
        console.error(err)
        res.redirect('signup')
    }
});

router.get('/forgot_password', (req, res) => {
    res.render('user/forgot_password', {title: "Media Review App", layout: './layouts/auth'})
});

router.delete('/logout', (req, res) => {
    res.render('logout', {title: "Media Review App", layout: './layouts/auth'})
});

export default router;