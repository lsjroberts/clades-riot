import TaxonsStore from './stores/taxons';

export default class Stores {
    constructor(dispatcher) {
        this.taxons = new TaxonsStore(dispatcher);
    }
}