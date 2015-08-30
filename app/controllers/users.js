    var Task = require('../models/task');

    module.exports.controller = function(app, passport) {

        // =====================================
        // HOME PAGE (with login links) ========
        // =====================================
        app.get('/', isLoggedIn, function(req, res) {
            //teacher
            //find all the tasks where I'm the owner
            
            //student
            //find all the task where my teacher is the owner


            Task.find().exec(function(err, tasks) {

                //format the date
                for (var i = 0; i < tasks.length; i++) {
                    var d = new Date(tasks[i].timestamp)
                    var f = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();
                    tasks[i].dateformat = f;
                }

                console.log(req.user);
                if (req.user.local.userType === 'teacher') {
                    res.render('teacher')
                } else {
                    res.render('tasks', {
                        user: req.user,
                        data: tasks,
                        // dates: datesFormatted
                    })
                }
            })

        });

        // LOGIN ////////////////////////////////////////////////////////////////////////////
        app.get('/login', function(req, res) {

            // render the page and pass in any flash data if it exists
            res.render('login', {
                title: 'Login',
                layout: 'login',
                message: req.flash('message')
            });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }));

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }));


        // // task 
        // // uncomment if you end up creating a mainpage
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

        // TEACHER ///////////////////////////////////////////////////////////////////////
        app.get('/signup', function(req, res) {
            res.render('signup', {
                title: 'Login',
                layout: 'signup',
                message: req.flash('message')
            });
        })


    };

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }