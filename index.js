document.addEventListener('DOMContentLoaded', main);

function main() {
    new CreationHandler(document.getElementById('bingo-form')).setUp();
}

class CreationHandler {
    constructor(formElt) {
        this.form = formElt;
        this.input = {
            size: formElt.querySelector('#size'),
            gridItems: formElt.querySelector('#grid-items'),
        };
    }

    setUp() {
        this.form.addEventListener('submit', event => this.handle(event));
    }

    handle(event) {
        event.preventDefault();

        const gridOptions = {
            version: 1,
            size: parseInt(this.input.size.value, 10),
            items: this.parseItems(this.input.gridItems.value),
        };

        const requiredItems = gridOptions.size * gridOptions.size;

        if (gridOptions.items.length < requiredItems) {
            throw new Error(`Grid of size ${gridOptions.size} requires at least ${requiredItems}; only ${gridOptions.items.length} provided`);
        }

        window.location.assign(`/grid.html?opts=${encodeURIComponent(this.serialiseOpts(gridOptions))}`);
    }

    parseItems(text) {
        return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }

    serialiseOpts(options) {
        return btoa(JSON.stringify(options));
    }
}
