// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose username is the same as the forms username
                // we are checking to see if the user trying to login already exists
                User.findOne({
                    'local.username': username
                }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that username
                    if (user) {
                        return done(null, false, req.flash('message', 'That username is already taken.'));
                    } else {
                        console.log(req.body);
                        // if there is no user with that username
                        // create the user
                        var newUser = new User();

                        //find the teacher by the username of the input

                        User.findOne({
                            'local.username': req.body.teacherId
                        }, function(err, teacher) {
                            if (!teacher || teacher.local.userType == 'student') { //send flash if teacher doesn't exist or the user type selected isn't a techer...
                                return done(null, false, req.flash('message', 'No teacher with that username.'));
                            } else {
                                // set the user's local credentials
                                newUser.local.username = username;
                                newUser.local.password = newUser.generateHash(password);
                                newUser.local.email = req.body.email;
                                newUser.local.first = req.body.first;
                                newUser.local.last = req.body.last;
                                //newUser.local.classCode = req.body.classCode;
                                newUser.local.userType = req.body.userType;
                                newUser.local.teacherId = teacher._id
                                
                                // save the user
                                newUser.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, newUser);
                                });

                            }

                        })


                    }

                });

            });
        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with username and password from our form

            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'local.username': username
            }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('message', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('message', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });
        }));
};