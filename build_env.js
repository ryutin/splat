#!/usr/bin/env node

var argv = require('yargs')
        .usage( "Usage: $0 [-c --vpc_list] [-g --vm_list] [--d --dry_run] [--D --debug]" )
        .option( "c", { alias: "vpc_list", demand: false, describe: "list VPCs", type: "boolean" } )
        .option( "g", { alias: "vm_list", demand: false, describe: "list  VMs", type: "boolean" } )
        .option( "C", { alias: "create_vms", demand: false, describe: "create VMs", type: "integer" } )
        .option( "d", { alias: "dry_run", demand: false, describe: "dry run", type: "boolean" } )
        .option( "D", { alias: "debug", demand: false, describe: "debug", type: "boolean" } )
        .help( "?" )
        .alias( "?", "help" )
        .argv;


var max_vms = argv.C;
var dry_run = argv.d;
var debug   = argv.D;

var AWS  = require('aws-sdk');

var aws_tools = require('./aws-tools');


//aws_tools.launch_instances(dry_run, max_vms);
aws_tools.list_instances(debug);
