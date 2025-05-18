function search() {
    fetch('./cards.json')
    .then((response) => response.json())
    .then((json) => {
        const container = document.getElementById('cardResults');
        container.innerHTML = ''; // Clear previous results
        // filter cards by multiple selectors
        const filters = [
            { id: 'GuildSelector', key: 'guild' },
            { id: 'ClassSelector', key: 'class' },
            { id: 'RaceSelector', key: 'race' },
            { id: 'LevelSelector', key: 'level' },
            { id: 'RaritySelector', key: 'rarity' },
        ];
        filters.forEach(({ id, key }) => {
            const selector = document.getElementById(id);
            const value = selector.options[selector.selectedIndex].value;
            if (value !== 'All') {
            json = json.filter(card => card[key] == value);
            }
        });

        // order cards by
        const orderBy = document.getElementById('OrderBy');
        const orderValue = orderBy.options[orderBy.selectedIndex].value;

        // filter cards by description
        const searchValue = document.getElementById('SearchBar').value.toLowerCase();
        if (searchValue) {
            json = json.filter((card) => card.description.toLowerCase().includes(searchValue));
        }

        json.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.style.marginRight = '16px';
            cardElement.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="https://i.imgur.com/${card.filename}.png" alt="${card.name}" style="width:200px; height:auto;">
                    <h2 style="margin: 8px 0 0 0; text-align: center;">${card.name}</h2>
                </div>
            `;
            container.appendChild(cardElement);
        });
    });
}