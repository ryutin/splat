#!/usr/bin/env node

//var commandLineArgs = require('command-line-args');

var argv = require('yargs')
   .usage( "Usage: $0 <url> [-u \"username\"] [-p \"password\"] [--post] [--data \"{key:value}\"]" )
    .command( "url", "URL to request", { alias: "url" } )
    //.required( 1, "URL is required" )
    .option( "u", { alias: "user", demand: false, describe: "Username", type: "string" } )
    .option( "p", { alias: "password", demand: false, describe: "Password", type: "string" } )
    .option( "d", { alias: "data", describe: "Data to send as JSON", type: "string" } )
    .option( "get", { describe: "Use HTTP GET", type: "boolean" } )
    .option( "post", { describe: "Use HTTP POST", type: "boolean" } )
    .option( "put", { describe: "Use HTTP PUT", type: "boolean" } )
    .option( "del", { describe: "Use HTTP DELETE", type: "boolean" } )
    .help( "?" )
    .alias( "?", "help" )
    .example( "$0 https://example.com/api/posts", "Get a list of posts" )
    .example( "$0 https://example.com/api/posts --post --data \"{ 'title': 'Avast ye!', 'body': 'Thar be a post hyar!'}\"", "Create a new post" )
    .epilog( "Copyright 2015 ReverentGeek" )
        .argv;

process.exit(1);


var AWS  = require('aws-sdk');


AWS.config.region = 'us-east-1';

var ec2 = new AWS.EC2({apiVersion: '2015-10-01'});



var vpc_params = {
    CidrBlock: '10.0.0.0/24', //createVPC - /24=256 ip addresses
    DryRun: false, //createVPC
    InstanceTenancy: 'default' //createVPC
};

ec2.createVpc(vpc_params, function(err, vpc_data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(vpc_data);           // successful response
});



var ec2_params = {
    ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
    InstanceType: 't1.micro',
    MinCount: 1, MaxCount: 1,
};


ec2.runInstances(ec2_params, function(err, ec2_data) {
    if (err) { console.log("Could not create instance", err); return; }

    var instanceId = ec2_data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);

    // Add tags to the instance
    ec2_params = {Resources: [instanceId], Tags: [
        {Key: 'Name', Value: 'instanceName'}
    ]};
    ec2.createTags(ec2_params, function(err) {
        console.log("Tagging instance", err ? "failure" : "success");
    });
});
