import riot from 'riot';

<taxon>
    <h3>{ name }</h3>

    <claim each={ claims }></claim>

    <script>
        this.name = opts.taxon.name;
        this.claims = opts.taxon.claims;
    </script>
</taxon>