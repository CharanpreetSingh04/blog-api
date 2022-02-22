module.exports = {
    isAuthenticated: (req,res,next) => {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please login to access this url')
        res.redirect('/users/login')
    }
}