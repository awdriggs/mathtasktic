var AWS = require('aws-sdk');
var randomString = require('random-string')

module.exports = {
    test: function(text, cb) {
        var s3 = new AWS.S3();
        bucketFolder = 'mathtasktic/node';
        s3.createBucket({
            Bucket: bucketFolder
        }, function() {

            var params = {
                Bucket: bucketFolder,
                Key: 'yadayada',
                Body: text
            };

            s3.putObject(params, function(err, data) {

                if (err)

                    console.log(err)

                else console.log("Successfully uploaded data to myBucket/myKey");
            });
        });

        cb('success!') //call make to 
    },

    addStepImage: function(taskID, buffer, cb) {
        var s3 = new AWS.S3();
        bucketFolder = 'mathtasktic/' + taskID;

        //create an image slug for the step image
        var slug = randomString({
            length: 3,
            numeric: true,
            letters: true,
            special: false
        });

        var url='https://s3.amazonaws.com/mathtasktic/'+ taskID + '/' + slug;

        var params = {
            Bucket: bucketFolder,
            Key: slug+'.png',
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: 'image/png'
        };

        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
                cb(false)
            } else {
                console.log("save successful")
                console.log(data)
                cb(url)
            }
        });
    },

    addResponseImage: function(taskID, stepID, user, buffer, cb){
        var s3 = new AWS.S3();
        bucketFolder = 'mathtasktic/'+ taskID + '/' + stepID;

        //console.log(buffer);

        var slug = randomString({
            length: 3,
            numeric: true,
            letters: true,
            special: false
        });

          var url='https://s3.amazonaws.com/mathtasktic/'+ taskID + '/'  + stepID + '/' + slug;


        var image = {
            Bucket: bucketFolder,
            Key: slug + '.png',
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: 'image/png'
        };
        
        console.log('buffer from params: ' + image.Buffer)

        s3.putObject(image, function(err, data) {
            if (err) {
                cb(false)
            } else {
                console.log('save successful')
                cb(url)
            }
        });
    }
}