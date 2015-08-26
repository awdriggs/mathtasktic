// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

//define the schema for the response schema, it is a sub-dcoument of task
var responseSchema = mongoose.Schema({
	student: String, //make this a ref?
	image: String, //this should be a url
	feedback: String
})

// define the schema for the task model
var taskSchema = mongoose.Schema({
	title: String,
	objective: String,
	description: String,
	responses: [responseSchema],
	solution: String //this should be an url
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Task', taskSchema);

