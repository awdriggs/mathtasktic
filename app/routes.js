module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
   app.get('/', isLoggedIn, function(req, res) {
        res.render('tasks.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

// LOGIN ////////////////////////////////////////////////////////////////////////////
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('message')}); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // // task 
    // // uncomment if you end up 
    // app.get('/task', isLoggedIn, function(req, res) {
    //     res.render('task.ejs', {
    //         user : req.user // get the user out of session and pass to template
    //     });
    // });

// LOGOUT /////////////////////////////////////////////////////////////////////////
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/login');
}