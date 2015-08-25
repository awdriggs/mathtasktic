var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');
var passport      = require('passport');
var flash         = require('connect-flash');
var fs            = require('fs');
var configDB      = require('./config/database.js');
var ejs           = require('ejs');

app.set('view engine', 'ejs'); // set up ejs for templating

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extname: true, limit: '50mb'})); //increase the limit of body parser

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log("App running on port : ", app.get('port'));
});