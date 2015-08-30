var Task = require('../models/task');
// var User = require('../models/user');

var s3 = require('../../config/aws.js');

module.exports.controller = function(app, passport) {

    // Student view a single task
    app.get('/task/:id', function(req, res) {
        //find one where the task id matches the id passed into the url

        Task.findById(req.params.id).exec(function(err, task) {

            res.render('singleTask', {
                data: task,
                user: req.user
            });
        });
    })

    app.get('/submit/:id/:step', function(req, res) {

        //send the webcam template!
        console.log('tasks.js task id', req.params.id);
        res.render('webcam', {
            title: 'Webcam',
            layout: 'capture',
            taskid: req.params.id,
            stepid: req.params.step
        });

    })

    //pass step number too?
    app.post('/submit/:id/:step', function(req, res) {
        console.log('submitting response')
        var dataUrl = req.body.image
        var dataString = dataUrl.split(",")[1];
        var buffer = new Buffer(dataString, 'base64');
        var extension = dataUrl.match(/\/(.*)\;/)[1];

        var user = req.user._id;
        var id = req.params.id;
        console.log('post id ' + id)
        var step = req.params.step;

        //send the image to s3
        s3.addResponseImage(id, step, buffer, function(url) {
            //after save, find the current task
            var current = Task.findById(req.params.id).exec(function(err, task) {

                var step = task.steps.id(req.params.step); //this grabs the correct step that I want!

                //push the student userid to the object
                step.responses.push({
                    student: req.user._id, //this will be the current user.
                    imageURL: url
                })

                //populate the student's info into the document
                task.save(function(err, task) {
                    Task.findOne(task).populate('steps.responses.student').exec(function(err, item) {
                        res.json(item) // temp, need to send student to the actual solution...
                    })
                })
            })
        })
    })


    app.get('/task/:task/:step', function(req, res) {
        //find this task and grab the step data
        console.log('hitting get task/id/step')
        var currentId = req.params.task;
        console.log(currentId);
        console.log('get task by id and step controller, step id:', currentId);
        //return the problem description and test description
        Task.findOne({
            _id: currentId
        }).exec(function(err, task) {
            console.log(err)
            if (!err) {
                step = task.steps.id(req.params.step) //graps the task we are looking at. 

                res.render('answer', {
                    task: task,
                    step: step,
                    user: req.user

                });
            } else {
                res.send(err);
            } //you should handle this better
        });
    });



    //subdoc search tester

    // app.get('/teacher/:task', function(req, res) {

    //     var search = Task.findById(req.params.task);


        
    //     search.populate('steps.responses.student')


    //     search.exec(function(err, result) {
    //         res.send(result);
    //     })
    // });

    app.get('/test', function(req, res){
        
        var search = Task.find()
       //var query = Person.find({ age : { $lt : 1000 }});
       //search.sort({timestamp: -1}) //this works!
       //search.where('steps.responses.student').exists()//this works, doesn't show taks with no responses
       //search.where('steps.responses.student').exists(false)//this works, show tasks with 0 responses
        
        search.exec(function(err, tasks){
            if(err){
                res.send(err)
            }

            res.json(tasks)
        })
       
    })
}