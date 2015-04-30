import riot from 'riot';

import Dispatcher from './dispatcher';

class Routes {
    constructor() {
        console.log('Routes.constructor');

        if (typeof window != 'undefined') {
            this.dispatcher = new Dispatcher();
        }
    }

    getDispatcher(req) {
        if (this.dispatcher) {
            return this.dispatcher;
        }

        req.dispatcher = new Dispatcher();

        return req.dispatcher;
    }

    go(next) {
        if (next) next();
    }

    register(app, context) {
        console.log('Routes.register');

        app.route('/').get((req, res, next) => {
            let dispatcher = this.getDispatcher(req);

            dispatcher.trigger('taxons.init', [
                { name: 'Foo', claims: [] },
                { name: 'Bar', claims: [] },
                { name: 'Baz', claims: [] },
            ]);

            this.go(next);
        });
    }
};

let instance = new Routes();
export default instance;