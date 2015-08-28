
// load the things we need
var mongoose = require('mongoose');

//define the schema for the response schema, it is a sub-dcoument of task
var responseSchema = mongoose.Schema({
	student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //make this a ref?
	imageURL: String, //this should be a url
	feedback: String,
	timestamp: { type: Date, default: Date.now }
})

var stepSchema = mongoose.Schema({
	direction: String,
	responses: [responseSchema],
	imageURL: String

})

// define the schema for the task model
var taskSchema = mongoose.Schema({
	timestamp: { type: Date, default: Date.now },
	title: String,
	objective: String,
	description: String,
	steps: [stepSchema],
	// responses: [responseSchema],
	solution: String, //this should be an url
	active: { type: Boolean, default: false }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Task', taskSchema);

