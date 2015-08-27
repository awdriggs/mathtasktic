var AWS = require('aws-sdk');

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

        cb('success!')
    },

    // addStepImage: function(taskID, stepID, )
}