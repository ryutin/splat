var AWS  = require('aws-sdk');

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: '3m'});

var ec2 = new AWS.EC2({apiVersion: '2015-10-01'});
var util = require('util');


// process.exit(1);





// function list_ec2_vms() {
//     var params = {
//         DryRun: false,
//         Filters: [
//             {
//                 //            Name: 'STRING_VALUE',
//                 //            Values: [
//                 //                'STRING_VALUE',
//                 //                /* more items */
//                 //            ]
//                 Name: 'INSTANCE_IDS',
//                 Values: [
//                     'instance_id',
//                     'instance-type',
//                     'instance-state-name',
//                     'private-ip-address',
//                     'vpc-id',
//                 ]
//             },
//             /* more items */
//         ],
//         InstanceIds: [
//             // 'STRING_VALUE',
//             /* more items */
//         ],
//         MaxResults: 0,
//         NextToken: 'STRING_VALUE'
//     };
//
//     ec2.describeInstances(params, function(err, data) {
//         if (err) console.log(err, err.stack); // an error occurred
//         else     console.log(data);           // successful response
//     });
//
// }
//
//
// function create_ec2_vpc() {
//
//     var vpc_params = {
//         CidrBlock: '10.0.0.0/24', //createVPC - /24=256 ip addresses
//         DryRun: false, //createVPC
//         InstanceTenancy: 'default' //createVPC
//     };
//
//     ec2.createVpc(vpc_params, function(err, vpc_data) {
//         if (err) console.log(err, err.stack); // an error occurred
//         else     console.log(vpc_data);           // successful response
//     });
// }


exports.launch_instances = function (dry_run,max_vms) {

        console.log("max:"+max_vms);

        var min_vms = 1;

        var params = {
            ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
            InstanceType: 't1.micro',
            MinCount: min_vms, MaxCount: max_vms,
            DryRun: dry_run
        };

        console.log("ec2: %o", ec2);

        ec2.runInstances(params, function(err, data) {
            if (err) { console.log("Could not create instance", err); return; }

            for (var i in data.Instances) {
                var instanceId = data.Instances[i].InstanceId;
                console.log("Created instance", instanceId);

                // Add tags to the instance
                params = {Resources: [instanceId], Tags: [
                    {Key: 'Name', Value: 'my instance #' + i}
                ]};

                ec2.createTags(params, function(err) {
                    console.log("Tagging instance", err ? "failure" : "success");
                });
            }
        });
};

exports.list_instances = function(debug) {

    var params = {
        Filters: [
            {
                Name: 'instance-state-name',
                Values: ['stopped']
            }
        ]
    };
    ec2.describeInstances(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else if (debug) {
            console.log(util.inspect(data, {depth:null}));
        }
        else for( var item in data.Reservations) {
            var instances = data.Reservations[item].Instances;
            for ( var instance in instances) {
                console.log(instances[instance].InstanceId);
            }
        }
    });
};

exports.create_vpc = function() {

    var params = {
        CidrBlock: '10.0.0.0/24', //createVPC - /24=256 ip addresses
        DryRun: false, //createVPC
        InstanceTenancy: 'default' //createVPC
    };

    ec2.createVpc(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
};


exports.describe_vpc = function() {

    var params = {
        DryRun: false,
//        Filters: [{ Name: '',Values: []}],
//        VpcIds: [],
    };

    ec2.describeVpcs(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
};
