#!/usr/bin/env node

var _ = require('lodash'),
    fs = require('fs'),
    cmd = require('commander'),
    wdk = require('wikidata-sdk'),
    Promise = require('bluebird'),
    request = require('request-promise');

fs = Promise.promisifyAll(fs);

var config = require('../../config.js');

function action(name) {
    getMatchingTaxons(name)
        .then(console.log);
}

function getMatchingTaxons(keywords) {
    return getEntityIdsForSearch(keywords)
        .then(filterEntitiesAreDinosaurs)
        .then(getEntities)
        .then(formatEntitiesWithClaims)
        // .then(formatEntitiesShort);
}

function getEntityIdsForSearch(keywords) {
    return request(wdk.searchEntities(keywords, cmd.language))
        .then(JSON.parse)
        .then(data => _.map(data.search, d => d.id))
        .then(entityIds => _.map(entityIds, id => parseInt(id.substr(1), 10)));
}

function filterEntitiesAreDinosaurs(entityIds) {
    return getAllDinosaurEntityIds()
        .then(dinosaurIds => {
            return _.intersection(dinosaurIds, entityIds)
        });
}

function getAllDinosaurEntityIds() {
    return fs.readFileAsync(config.cache.dinosaurEntityIds)
        .then(JSON.parse)
        .catch(e => {
            return request(config.wikidata.queryUrl + config.wikidata.queries.dinosaurTree)
                .then(JSON.parse)
                .then(data => data.items)
                .then(data => {
                    return fs.writeFileAsync(config.cache.dinosaurEntityIds, JSON.stringify(data))
                        .then(result => {
                            return data;
                        });
                });
        });
}

function getEntities(entityIds) {
    console.log("Getting entities", entityIds);
    return request(wdk.getEntities(entityIds))
        .then(JSON.parse)
        .then(data => data.entities);
}

function getEntitiesLabels(entities) {
    return _.chain(entities)
        .filter(filterEntityHasLabel)
        .map(entity => {
            return entity.labels.en.value;// + ", " + entity.descriptions.en.value;
        })
        .value();
}

function formatEntitiesWithClaims(entities) {
    return _.chain(entities)
        .filter(filterEntityHasLabel)
        .map(entity => {
            return {
                "name": entity.labels[cmd.language].value,
                "taxonName": getWikidataClaimValue(entity, config.wikidata.properties.taxonName),
                "parentTaxon": getWikidataClaimValue(entity, config.wikidata.properties.parentTaxon),
            };
        })
        .value();
}

function filterEntityHasLabel(entity) {
    return _.has(entity, 'labels') &&
        _.has(entity.labels, cmd.language) &&
        _.has(entity.labels.en, 'value');
}

function getWikidataClaimValue(entity, property) {
    var value = _.chain(entity.claims)
        .filter((claim, key) => {
            return key === property;
        })
        .first()
        .map(claim => {
            return claim.mainsnak.datavalue.value;
        })
        .first()
        .value();

    if (_.isObject(value)) {
        if (value['entity-type'] == 'item') {
            return getEntities([value['numeric-id']])
                .then(getEntitiesLabels);
        }
    }

    return value;
}



cmd
    .version('0.0.1')
    .arguments('<name>')
    .option('-l, --language [lang]', 'Specify the language to use [en]', 'en')
    .action(action)
    .parse(process.argv);