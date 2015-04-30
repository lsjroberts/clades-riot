var wdk = require('wikidata-sdk'),
    request = require('request-promise'),
    _ = require('lodash');

var url = wdk.getReverseClaims('P171', 'Q132452');

request(url)
    .then(response  => JSON.parse(response))
    .then(data      => wdk.parse.wdq.entities(data))
    .then(entityIds => wdk.getEntities(entityIds))
    .then(url       => request(url))
    .then(response  => JSON.parse(response))
    .then(data      => parseEntities(data.entities))
    .then(result    => console.log(result))
    // .catch(error    => console.error(error));

function parseEntities(entities) {
    return _.chain(entities)
        .filter(entity => {
            return _.has(entity, 'labels') &&
                _.has(entity.labels, 'en') &&
                _.has(entity.labels.en, 'value');
        })
        .map(entity => {
            return entity.labels.en.value;
        })
        .value();
}
