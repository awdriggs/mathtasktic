var Task = require('../models/task');
// var User = require('../models/user');

var s3 = require('../../config/aws.js');

module.exports.controller = function(app, passport) {

    // CREATE A TASK ////////
    // future, this needs to be locked down to only teachers
    app.get('/teacher/create', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('makeTask');
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
            layout: 'step'
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
                });
            }
        })
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

    app.get('/submit/:id/:step', function(req, res) {

        //send the webcam template!
        console.log(req.params.id);
        res.render('webcam', {
            title: 'Webcam',
            layout: 'capture',
            taskid: req.params.id,
            stepid: req.params.step
        });

    })

    //pass step number too?
    app.post('/submit/:id/:step', function(req, res) {

        var dataUrl = req.body.image
        var dataString = dataUrl.split(",")[1];
        var buffer = new Buffer(dataString, 'base64');
        var extension = dataUrl.match(/\/(.*)\;/)[1];

        var user = req.user._id;
        var id = req.params.id;
        var step = req.params.step;

        // s3.addResponseImage(id, step, user, buffer, function(url) {
        //     //I think all of this needs to happen after the save!
        //     //because i want to include the user id into the feedback.
        //     //get the task with the object id of object id
        //     var current = Task.findById(req.params.id).exec(function(err, task) {

        //         var step = task.steps.id(req.params.step); //this grabs the correct step that I want!


        //         //push the student userid to the object
        //         step.responses.push({
        //             student: req.user._id, //this will be the current user.
        //             imageURL: url
        //         })


        //         //populate the student's info into the document

        //         task.save(function(err, task) {
        //             Task.findOne(task).populate('steps.responses.student').exec(function(err, item) {
        //                 res.json(item) // temp, need to send student to the actual solution...
        //             })
        //         })

        //     })
        // })




        //next steps, figure out how to save to the a cloud storage and get the images back out...
        //figure out how to build the next student action, seeing the actual answer and getting to set get or not get




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

        s3.addStepImage(req.params.id, buffer, function(url) {

            if (!url) {
                //do some error handling????!!!!
                console.log('s3 write error')
            } else if (url) {
                Task.findById(req.params.id).exec(function(err, task) {
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
                });
            }
        })
    
    })

    app.get('/awstest', function(req, res) {
        s3.test('to whom?', function(m) {
            res.send(m)
        })

    })

}