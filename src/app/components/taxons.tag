import riot from 'riot';

<taxons>
    <ul>
        <li each={ taxon in taxons }>
            <taxon taxon={ taxon }></taxon>
        </li>
    </ul>

    <script>
        let store = opts.store;

        this.taxons = store.taxons;
    </script>
</taxons>