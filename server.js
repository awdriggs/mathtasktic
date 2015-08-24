var express = require('express');
var app = express();
// var bodyParser = require('body-parser');
// var exphbs = require('express-handlebars');
// var methodOverride = require('method-override');
// var logger = require('morgan');
// var path = require('path');
// var session = require('express-session');

var fs = require('fs');

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log("App running on port : ", app.get('port'));
});

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});