#!/usr/bin/env node

var argv = require('yargs')
        .usage( "Usage: $0 [-c --vpc_list] [-g --vm_list]" )
        .option( "c", { alias: "vpc_list", demand: false, describe: "list VPCs", type: "boolean" } )
        .option( "g", { alias: "vm_list", demand: false, describe: "list  VMs", type: "boolean" } )
        .option( "C", { alias: "create_vms", demand: false, describe: "create VMs", type: "integer" } )
        .help( "?" )
        .alias( "?", "help" )
        .argv;


var max_vms = argv.C;

var AWS  = require('aws-sdk');

var aws_tools = require('./aws-tools')
// var ec2 = new AWS.EC2({apiVersion: '2015-10-01'});

var min_vms = 1;
// var max_vms = 5;

var dry_run = true;

aws_tools.launch_ec2_instances(dry_run, max_vms);
