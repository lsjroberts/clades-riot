import Stores from './stores';
import RiotControl from './utils/riot-control';

export default class Dispatcher extends RiotControl {
    constructor() {
        super();

        this.stores = new Stores(this);

        console.log('Dispatcher.stores', this.stores);
    }
}

