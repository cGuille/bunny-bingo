document.addEventListener('DOMContentLoaded', main);

function main() {
    const query = new URLSearchParams(document.location.search);

    if (!query.has('opts')) {
        throw new Error('Missing opts parameter');
    }

    const opts = query.get('opts');

    const grid = document.getElementById('grid');
    const itemTpl = document.getElementById('grid-item-tpl');

    new GridMaker(grid, itemTpl, new GridStateStorage(opts)).setUp(deserialiseOpts(opts));
}

function deserialiseOpts(opts) {
    return JSON.parse(atob(opts));
}

class GridStateStorage {
    constructor(gridId) {
        this.gridId = gridId;
    }

    storageKey() {
        return `state-${this.gridId}`;
    }

    load() {
        const data = localStorage.getItem(this.storageKey());

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    }

    save(state) {
        localStorage.setItem(this.storageKey(), JSON.stringify(state));
    }
}

class GridMaker {
    constructor(container, itemTpl, stateStorage) {
        this.container = container;
        this.itemTpl = itemTpl;
        this.stateStorage = stateStorage;
    }

    setUp(options) {
        const gridSize = Math.floor(Math.sqrt(options.items.length));

        let state = this.stateStorage.load();

        if (!state) {
            state = {
                selectedItems: this.selectItems(options.items, gridSize).map(text => ({ text: text, crossed: false })),
            };

            this.stateStorage.save(state);
        }

        this.container.style.setProperty('--grid-size', gridSize);

        state.selectedItems
            .map(item => this.createGridItemElt(item))
            .forEach(elt => this.container.appendChild(elt));
    }

    selectItems(items, gridSize) {
        return pickRandomItems(items, gridSize * gridSize);
    }

    createGridItemElt(item) {
        const itemElt = this.itemTpl.content.cloneNode(true).querySelector('.grid-item');

        itemElt.textContent = item.text;

        const updateState = debounced(this.updateState.bind(this), 1000);

        itemElt.addEventListener('click', () => {
            itemElt.classList.toggle('crossed');
            updateState();
        });

        if (item.crossed) {
            itemElt.classList.add('crossed');
        }

        return itemElt;
    }

    updateState() {
        const itemElts = Array.from(this.container.children);

        const items = itemElts.map(elt => ({
            text: elt.textContent,
            crossed: elt.classList.contains('crossed'),
        }));

        this.stateStorage.save({ selectedItems: items });
    }
}

function debounced(func, delay) {
    let timer = null;

    return () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(func, delay);
    };
}

function pickRandomItems(source, amount) {
    const picks = [];

    while (picks.length < amount) {
        picks.push(source.splice(Math.floor(Math.random() * source.length), 1)[0]);
    }

    return picks;
}
