$(window).load(function() {
    //dedictated button events
    console.log('webcam js loaded');
    $('#video_wrapper').on('click', '#confirm', confirm);
    $('#video_wrapper').on('click', '#reload', reload);
    $('#video_wrapper').on('click', '#exit', exit);

    $('#snap').click(snap); //for taking the picture, turn to timer or opencv logic later

    $("player").click(function() {
        console.log()
    })

    var mediaOptions = {
        audio: false,
        video: true
    };

    if (!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    if (!navigator.getUserMedia) {
        return alert('getUserMedia not supported in this browser.');
    }

    navigator.getUserMedia(mediaOptions, success, function(e) {
        console.log(e);
    });

    function success(stream) {
        var video = document.querySelector("#player");
        video.src = window.URL.createObjectURL(stream);
    }

    $('#canvas').hide(); //hide the canvas to start
    $('#capture_nav').hide();
});

//cofirm capture
//save photo and send to server? need to figure this out for sure...
var confirm = function() {
    console.log('confirm capture');
    var canvas = document.getElementById("canvas");
    var captured = canvas.toDataURL();
    var pathname = window.location.pathname;

    var postData = {
        user: 'fake_username',
        image: captured
    }
    
    $.post(pathname, postData,
    function(data)
    {
          //right now this is just html data, we can do something else later
          console.log(data);
    });   
}

//retake capture 
var reload = function() {
    console.log('reload viewer');
    //hide the canvas, show the feed
    $('#feed').show();
    $('#canvas').hide();
    $('#capture_nav').hide();
}

var exit = function() {
    console.log('exit viewer');
}

//capture portion of the current webcam image.
var snap = function() {
    //for drawing
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    console.log('snap')

    $('#feed').hide();
    $('#canvas').show();
    $('#capture_nav').show();
    context.drawImage(player, 150, 150, 350, 200, 0, 0, 700, 400);
}