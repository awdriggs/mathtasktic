$(window).load(function() {
    //dedictated button events
    $('#wrapper').on('click', '#signup', signup);
    $('#wrapper').on('click', '#cancel', cancel);
   
    //hide signup form buttons
    $('#cancel').hide();
    $('#create').hide();
    
})

var signup = function(){
	console.log('signup pressy');
	$("#user_form").attr("action", "/signup");
	//build out signup form
	//change the form action to hit signup
	$('#login').hide();
	$('#signup').hide();
	$('#create').show();
	$('#cancel').show();
	
	//build the rest of the signup form
	var username = $('<div>').attr('class', 'form-group').attr('class', 'signup_input');
	username.append($('<input>').attr('type', 'text').attr('class', 'form-control').attr('name', 'first').attr('placeholder', 'first name'))
	username.append($('<input>').attr('type', 'text').attr('class', 'form-control').attr('name', 'last').attr('placeholder', 'last name'))
	username.append($('<input>').attr('type', 'email').attr('class', 'form-control').attr('name', 'email').attr('placeholder', 'email'))
	username.append($('<input>').attr('type', 'text').attr('class', 'form-control').attr('name', 'teacherId').attr('placeholder', "Your teacher's username"))
	// username.append($('<input>').attr('type', 'text').attr('class', 'form-control').attr('name', 'userType').attr('type', 'hidden').val('student'))
	username.insertBefore($('#login'))
}

var cancel = function(){
	//hide signup form and clear the form values
	console.log('cancel pressy');

	//set the form action back to submit
	$("#user_form").attr("action", "/login");
	//clear the form values, loop?
	$('.form-control').val('')
	
	$('.signup_input').hide()
	//show the buttons for login and singup again.
	$('#login').show();
	$('#signup').show();
	$('#create').hide();
	$('#cancel').hide();
}
