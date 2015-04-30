'use strict';

import _ from 'lodash';

export default class RiotControl {
    constructor() {
        this.stores = {};
    }

    addStore(key, store) {
        this.stores[key] = store;
    }

    on() {
        var args = [].slice.call(arguments)
        this.send('on', args);
    }

    one() {
        var args = [].slice.call(arguments)
        this.send('one', args);
    }

    off() {
        var args = [].slice.call(arguments)
        this.send('off', args);
    }

    trigger() {
        var args = [].slice.call(arguments)
        console.log('RiotControl.trigger', args);
        this.send('trigger', args);
    }

    send(method, args) {
        _.each(this.stores, el => {
            el[method].apply(null, args)
        });
    }
}