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
//var ejs           = require('ejs');
var path = require('path');
var exphbs = require('express-handlebars');

app.use(logger('dev'));

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    extname: 'handlebars',
    layoutsDir: path.join(__dirname + '/app/views', "layouts")
}));

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/app/views');

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


//load all the controllers for routing
fs.readdirSync('./app/controllers').forEach(function(file) {
    if (file.substr(-3) == '.js') {
        route = require('./app/controllers/' + file);
        route.controller(app, passport);
    }
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log("App running on port : ", app.get('port'));
});