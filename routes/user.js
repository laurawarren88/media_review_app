import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'

const router = express.Router();

router.get('/login', (req, res) => {
    const message = req.query.message;
    res.render('user/login', {title: "Media Review App", layout: './layouts/auth', message})
});

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

    if (password.length < 8 ) {
        return res.render('partials/errorMessage', { errorMessage: "Password is too short, must be at least 8 characters" })
    }

    if (password !== confirm_password) {
        return res.render('partials/errorMessage', { errorMessage: "Passwords do not match!" });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.render('errorPage', { errorMessage: "User with that email already exists!" });
            } else if (existingUser.username === username) {
                return res.render('errorPage', { errorMessage: "Username is already taken!" });
            }
        }
    
    const hashedPassword = await bcrypt.hash(password.trim(), 10)
    const newUser = new User({
        username: username.trim(),
        email: email.trim(),
        password: hashedPassword
    });
    await newUser.save();
    res.redirect('login')       
    } catch (err) {
        console.error(err)
        res.redirect('signup')
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const redirectTo = req.query.redirect || '/';

    if (username.trim() === '' || password.trim() === '') {
        return res.render('partials/errorMessage', { errorMessage: "Empty input field!" });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('partials/errorMessage', { errorMessage: "Invalid credentials!" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.user = {
                _id: user._id,
                username: user.username,
                isAdmin: user.isAdmin 
            };
            const redirectTo = req.session.returnTo || '/';
            delete req.session.returnTo; 
            res.redirect(redirectTo); 
        } else {
            return res.render('partials/errorMessage', { errorMessage: "Invalid password!" });
        }
    } catch (err) {
        console.error("Error during login:", err);
        return res.render('partials/errorMessage', { errorMessage: "An unexpected error occurred during login!" });
    }
});

router.get('/forgot_password', (req, res) => {
    res.render('user/forgot_password', {title: "Media Review App", layout: './layouts/auth'})
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error logging out:', err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
});

export default router;