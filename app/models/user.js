// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        email: String,
        username: String,
        password: String,
        first: String,
        last: String,
        userType: String,
        teacherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} //the id of a teacher, will but null if the user is a teacher, this ok?
        //later add a teacher slug
    },

    feedback: {
        timestamp: { type: Date, default: Date.now },
        comment: String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);