module.exports.controller = function(app, passport) {

	  // CREATE A TASK ////////
    // future, this needs to be locked down to only teachers
    app.get('/create', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('makeTask');
    });

    app.post('/create', function(req, res) {
        //do the business of adding to mongo
        res.send(req.body);
        //res.redirect('/');
    });
}