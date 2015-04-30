'use strict';

import riot from 'riot';

export default class TaxonsStore {
    constructor() {
        riot.observable(this);

        let self = this;

        this.taxons = [];

        this.on('taxons.init', self.init);
        this.on('taxons.add', this.add);
        this.on('taxons.reset', this.reset);
    }

    init(taxons) {
        this.taxons = taxons;
    }

    add(taxon) {
        this.taxons.push(taxon);
    }

    reset() {
        this.taxons = [];
    }
}