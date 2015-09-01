//these are the routes for the teacher user actions...
//still using the same task model as the student.

var Task = require('../models/task');
var User = require('../models/user');

var s3 = require('../../config/aws.js');

module.exports.controller = function(app, passport) {

    // CREATE A TASK ////////
    // future, this needs to be locked down to only teachers
    app.get('/teacher/create', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('makeTask', {
            user: req.user
        });
    });

    app.post('/teacher/create', function(req, res) {
        //do the business of adding to mongo
        var newTask = new Task(req.body);
        newTask.save(function(err, task) {
            if (err) return handleError(err);
            res.redirect('/teacher/task/' + task._id) //send to the next page so teacher can add steps, aysnc happy, will fire on success
        });
    });

    app.get('/teacher/task/:id', function(req, res) {
        //get the task from the db, do you even need to do this?
        res.render('stepCapture', {
            title: 'Step',
            layout: 'step',
            id: req.params.id
        });
    });

    //this is going to be hit by ajax!
    app.post('/teacher/task/:id', function(req, res) {

        //process photo
        var dataUrl = req.body.image
        var dataString = dataUrl.split(",")[1];
        var buffer = new Buffer(dataString, 'base64');
        var extension = dataUrl.match(/\/(.*)\;/)[1];

        // //write to s3
        s3.addStepImage(req.params.id, buffer, function(url) {

            if (!url) {
                //do some error handling????!!!!
                console.log('s3 write error')
            } else if (url) {
                Task.findById(req.params.id).exec(function(err, task) {
                    if (err) {
                        res.send(err);
                    } else {
                        var currentStep = task.steps.push({
                                direction: req.body.direction,
                                imageURL: url
                            }) //this is returning the index, not begining at 0, wierd?

                        //save the image to s3

                        //on callback, save the img url to collection
                        //then send back the json
                        task.save(function(err, data) {
                            res.json(data.steps[currentStep - 1]); //returning an object of whatever is in the current step!
                        })
                    }


                });
            }
        })
    });

    app.get('/teacher/students', function(req, res) {
        User.find({
            'local.teacherId': req.user._id
        }).exec(function(err, students) {
            res.render('teacherStudents', {
                title: 'Students',
                data: students,
                user: req.user
            });
        })
    });

    app.get('/teacher/view/:id', function(req, res) {
        //get all the data for a task...
        var current = Task.findById(req.params.id).populate('steps.responses.student').exec(function(err, task) {

        	res.render('result', {
                title: 'Results',
                data: task,
                user: req.user

            });

            // res.send(task)
        })

        
    })
}