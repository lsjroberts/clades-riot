import riot from 'riot';

export default class Store {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        this.observer = {};
        riot.observable(this.observer);
    }
}