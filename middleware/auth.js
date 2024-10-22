import User from '../models/userModel.js'; 

export function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {  // Assuming userId is stored in session
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect(`/user/login?message=add_review`);
    }
};

// export function ensureAdmin(req, res, next) {
//     if (req.session && req.session.userId) {
//         User.findById(req.session.userId).then(user => {
//             if (user && user.isAdmin) {
//                 return next(); // User is admin, proceed to the next middleware
//             } else {
//                 res.redirect('/'); // Redirect if not an admin
//             }
//         }).catch(err => {
//             console.error(err);
//             res.redirect('/');
//         });
//     } else {
//         res.redirect('/user/login');
//     }
// };

export function ensureAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
            return next(); // User is admin, proceed to the next middleware
        } else {
        // If not logged in, redirect to login page
        req.session.returnTo = req.originalUrl; // Store the URL to return after login
        res.redirect('/user/login');
    }
}