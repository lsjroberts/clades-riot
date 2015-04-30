'use strict';

import fs from 'fs';
import riot from 'riot';
import express from 'express';
import bluebird from 'bluebird';
// import feathers from 'feathers';

import routes from '../app/routes';

let app = express();

app.use(express.static('dist'));

// Create riot template engine
app.engine('html', (filePath, options, callback) => {
    async function render() {
        try {
            let view = riot.render(options.mainTag, options.tagOpts);
            let regex = new RegExp('<' + options.mainTag + '.*<\/' + options.mainTag + '>');
            let content = await bluebird.promisify(fs.readFile)(filePath);
            let rendered = content.toString().replace(regex, view);
            return callback(null, rendered);
        } catch (e) {
            console.error(
                'Error: app.engine: ', e,
                ' Filepath: ', filePath,
                ' Callback: ', callback
            );
            console.error(e.stack);
            return;
        }
    }

    render();
});

app.set('views', './dist/app/');
app.set('view engine', 'html');

routes.register(app);

// app.configure(feathers.rest());

app.use((req, res, next) => {
    res.render('index.html', {
        mainTag: 'main',
        tagOpts: {
            stores: req.dispatcher.stores,
            dispatcher: req.dispatcher
        }
    });
});

console.log('Starting server');

let server = app.listen(4000, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log('\tListening at http://%s:%s', host, port);
});