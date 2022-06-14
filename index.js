document.addEventListener('DOMContentLoaded', main);

function main() {
    new CreationHandler(document.getElementById('bingo-form')).setUp();
}

class CreationHandler {
    constructor(formElt) {
        this.form = formElt;
        this.gridItemsInput = formElt.querySelector('#grid-items');
    }

    setUp() {
        this.form.addEventListener('submit', event => this.handle(event));
    }

    handle(event) {
        event.preventDefault();

        const gridOptions = {
            version: 1,
            items: this.parseItems(this.gridItemsInput.value),
        };

        window.location.assign(`/grid.html?opts=${encodeURIComponent(this.serialiseOpts(gridOptions))}`);
    }

    parseItems(text) {
        return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }

    serialiseOpts(options) {
        return btoa(JSON.stringify(options));
    }
}
