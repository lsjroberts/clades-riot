#!/usr/bin/env node

var _ = require('lodash'),
    cmd = require('commander'),
    wdk = require('wikidata-sdk'),
    request = require('request-promise');

var config = require('../../config.js');

function action() {
    request(config.wdqUrl + config.treeQuery)
        .then(response => JSON.parse(response))
        .then(data => data.items)
        .then(items => {
            console.log("There are " + items.length + " dinosaurs!");
        });
}

cmd
    .version('0.0.1')
    .option('-l, --language [lang]', 'Specify the language to use [en]', 'en')
    .parse(process.argv);

action();
