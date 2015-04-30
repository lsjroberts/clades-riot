'use strict';

import riot from 'riot';
import page from 'page';
import pageExpressMapper from 'page.js-express-mapper.js';

import routes from '../app/routes';
import components from '../app/components';


// Initialise page.js router
pageExpressMapper({
    renderMethod: null,
    expressAppName: 'app'
});

window.page = page;


// Register routes
let routesContext = {};
routes.register(window.app, routesContext);

page();

console.debug('Loaded routes context', routesContext);


// Render
let rendered = false;

window.onload = function() {
    render();
}

function render() {
    if (rendered || !document.querySelector('main')) {
        return;
    }

    riot.mount('main', {
        stores: routes.dispatcher.stores,
        dispatcher: routes.dispatcher
    });
}