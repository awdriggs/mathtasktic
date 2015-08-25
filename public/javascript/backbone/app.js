App = {
    Collections: {},
    Models: {},
    Views: {}
}

$(window).load(function() {
    //dedictated button events

    $('#wrapper').on('click', '#login', login);
    $('#wrapper').on('click', '#signup', signup);
    $('#wrapper').on('click', '#cancel', cancel);
    $('#wrapper').on('click', '#create', create);

    $('#cancel').hide();
    $('#create').hide();

    App.loginView = new App.Views.LoginView();
})

var login = function(){
	//login ajax call server
	console.log('login pressy');
}

var signup = function(){
	//build out signup form
	console.log('signup pressy');
}

var cancel = function(){
	//hide signup form and clear the form values
	console.log('cancel pressy');
}

var create = function(){
	//signup ajax call to server
	console.log('create pressy');
}