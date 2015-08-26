var Task = require('../models/task');
// var User = require('../models/user');

module.exports.controller = function(app, passport) {

    // CREATE A TASK ////////
    // future, this needs to be locked down to only teachers
    app.get('/create', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('makeTask');
    });

    app.post('/create', function(req, res) {
        //do the business of adding to mongo
        var task = new Task(req.body);
        task.save(function(err) {
            if (err) return handleError(err);

        });

        res.redirect('/');
    });

    // View a single task
    app.get('/task/:id', function(req, res) {
        //find one where the task id matches the id passed into the url

        Task.findById(req.params.id).exec(function(err, task) {
            res.render('singleTask', {
                data: task
            });
        });
    })

    app.get('/submit/:id', function(req, res) {

        //send the webcam template!
        console.log(req.params.id);
        res.render('webcam', {
            title: 'Webcam',
            layout: 'capture',
            taskid: req.params.id
        });
    })

    app.post('/submit/:id', function(req, res) {
        
        //I think all of this needs to happen after the save!
        //because i want to include the user id into the feedback.
        //get the task with the object id of object id
        var current = Task.findById(req.params.id).exec(function(err, task) {
                console.log('id', task._id)
                task.responses.push({
                    student: req.user._id //this will be the current user.
                })

        
                //populate the student's info into the document
                task.save(function(err, task) {
                    Task.findOne(task).populate('responses.student').exec(function(err, item) {
                        res.json(item)
                    })
                })

            })

        // 
        // item.save(function(err, item) {
        //     Item.findOne(item).populate('comments.created_by').exec(function(err, item) {
        //         res.json({
        //             status: 'success',
        //             message: "You have commented on this item",
        //             comment: item.comments.id(comment._id)
        //         });
        //     });
        // });
            //get the user from the db with the user id

        //set the response to be a response sub doc

        //populate the user?


        // //saving bs
        // var dataUrl = req.body.image
        // var dataString = dataUrl.split(",")[1];
        // var buffer = new Buffer(dataString, 'base64');
        // var extension = dataUrl.match(/\/(.*)\;/)[1];

        // var fullFileName = 'testing' + "." + extension;

        // console.log(buffer);
        // //fs.writeFileSync(fullFileName, buffer, "binary");
        // //write to s3

        // res.redirect('/');
        //res.send('post submit hit')
    })

}