var AWS = require('aws-sdk');

AWS.config.region = 'us-east-1';

var ec2 = new AWS.EC2({apiVersion: '2015-10-01'});


var params = {
    ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
    InstanceType: 't1.micro',
    MinCount: 1, MaxCount: 1,
    DryRun: false, //createVPC
    InstanceTenancy: 'default' //createVPC
};



ec2.runInstances(params, function(err, data) {
    if (err) { console.log("Could not create instance", err); return; }

    var instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);

    // Add tags to the instance
    params = {Resources: [instanceId], Tags: [
        {Key: 'Name', Value: 'instanceName'}
    ]};
    ec2.createTags(params, function(err) {
        console.log("Tagging instance", err ? "failure" : "success");
    });
});
