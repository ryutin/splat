// module.exports = {
//     foo: function () {
//         // whatever
//     },
//     bar: function () {
//         // whatever
//     }
// };


// #!/usr/bin/env node
//
// var commandLineArgs = require('command-line-args');
//
// var argv = require('yargs')
//         .usage( "Usage: $0 [-c --vpc_list] [-g --vm_list]" )
//         .option( "c", { alias: "vpc_list", demand: false, describe: "list VPCs", type: "boolean" } )
//         .option( "g", { alias: "vm_list", demand: false, describe: "list  VMs", type: "boolean" } )
//         .option( "C", { alias: "create_max_vms", demand: false, describe: "create VMs", type: "integer" } )
//         .help( "?" )
//         .alias( "?", "help" )
//         .argv;

var AWS  = require('aws-sdk');

AWS.config.region = 'us-east-1';

var ec2 = new AWS.EC2({apiVersion: '2015-10-01'});


// var min_vms = 1;
// var max_vms = argv.C;
// max_vms = 1;



// launch_ec2_instances(min_vms,max_vms);

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

module.exports = {
    launch_ec2_instances: function (dry_run,max_vms) {


        console.log("max:"+max_vms);

        var min_vms = 1;

        var params = {
            ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
            InstanceType: 't1.micro',
            MinCount: min_vms, MaxCount: max_vms,
            DryRun: dry_run
        };

        console.log("ec2: %o", ec2);
        //    process.exit(1);

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
    }
};
