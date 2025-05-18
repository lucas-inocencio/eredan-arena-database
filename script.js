// Display the results
fetch('./cards.json')
    .then((response) => response.json())
    .then((json) => {
        const container = document.getElementById('cardResults');
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
    })