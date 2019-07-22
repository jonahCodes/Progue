module.exports = {
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();

        }
        req.flash("error_msg","Please login to View!");
        res.redirect('/users/login');
        return next();

    }
}