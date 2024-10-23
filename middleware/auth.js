export function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) { 
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect(`/user/login?message=add_review`);
    }
};

export function ensureAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
            return next(); 
        } else {
        // If not logged in, redirect to login page
        req.session.returnTo = req.originalUrl; 
        res.redirect('/user/login');
    }
}