$(window).load(function() {
    //dedictated button events
    console.log('webcam js loaded');
     $('#video_wrapper').on('click', '.confirm', confirm);
    $('#video_wrapper').on('click', '.reload', reload);
    $('#video_wrapper').on('click', '.exit', exit);

    $('.snap').click(snap); //for taking the picture, turn to timer or opencv logic later

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
    //.stop() on the stream will stop it!

    $('#canvas').hide(); //hide the canvas to start
    $('#capture').hide();
});

//cofirm capture
var confirm = function() {
    console.log('confirm capture');
    var canvas = document.getElementById("canvas");
    var captured = canvas.toDataURL();
    var path = window.location.pathname;
    
    var pathArray = path.split("/")
    var newPath = '/task/' + pathArray[2] + '/' + pathArray[3];

    var postData = {
        image: captured
    }
    
    $.post(path, postData,
    function(data)
    {
          //right now this is just html data, we can do something else later
          //console.log(data);
          window.location = newPath;
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
    parent.history.back();
}

//capture portion of the current webcam image.
var snap = function() {
    //for drawing
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var captured = canvas.toDataURL();
    $('#image').val(captured);

    console.log('snap')

    $('#feed').hide();
    $('#canvas').show();
    $('#capture').show();
    context.drawImage(player, 150, 150, 350, 200, 0, 0, 700, 400);
}