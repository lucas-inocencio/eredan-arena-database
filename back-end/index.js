const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema and Model
const User = mongoose.model('User', {
  name: String,
  email: String
});

// Route
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

app.listen(3000, () => console.log('Server running on port 3000'));

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function fetchCards() {
    await client.connect();
    const database = client.db('EACards');
    const collection = database.collection('eacards');
    const documents = await collection.find({}).toArray();
    await client.close();
    return documents;
}

function getFilterValues() {
    return [
        { id: 'GuildSelector', key: 'guild' },
        { id: 'ClassSelector', key: 'class' },
        { id: 'RaceSelector', key: 'race' },
        { id: 'LevelSelector', key: 'level' },
        { id: 'RaritySelector', key: 'rarity' },
    ].reduce((acc, { id, key }) => {
        const selector = document.getElementById(id);
        const value = selector.options[selector.selectedIndex].value;
        if (value !== 'All') acc[key] = value;
        return acc;
    }, {});
}

function filterCards(cards, filters) {
    return cards.filter(card =>
        Object.entries(filters).every(([key, value]) => card[key] == value)
    );
}

function sortCards(cards, orderValue) {
    if (orderValue === 'ReleaseDate') {
        return cards.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    } else if (orderValue === 'Name') {
        return cards.sort((a, b) => a.name.localeCompare(b.name));
    }
    return cards;
}

function filterByDescription(cards, searchValue) {
    if (!searchValue) return cards;
    const lowerSearch = searchValue.toLowerCase();
    return cards.filter(card => card.description.toLowerCase().includes(lowerSearch));
}

function renderCards(cards) {
    const container = document.getElementById('cardResults');
    container.innerHTML = '';
    cards.forEach(card => {
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
}

async function search() {
    try {
        console.log('Searching...');
        let cards = await fetchCards();
        const filters = getFilterValues();
        cards = filterCards(cards, filters);

        const orderBy = document.getElementById('OrderBy');
        const orderValue = orderBy.options[orderBy.selectedIndex].value;
        cards = sortCards(cards, orderValue);

        const searchValue = document.getElementById('SearchBar').value;
        cards = filterByDescription(cards, searchValue);

        renderCards(cards);
    } catch (err) {
        console.error(err);
    }
}