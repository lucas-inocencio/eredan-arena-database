const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI
if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set.');
}
const client = new MongoClient(uri);

async function fetchCards() {
    await client.connect();
    const database = client.db('EACards');
    const collection = database.collection('eacards');
    const documents = await collection.find({}).toArray();
    console.log(documents)
    await client.close();
    return documents;
}

// endpoint to fetch cards
app.get('/api/cards', async (req, res) => {
    try {
        const cards = await fetchCards();
        res.json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(express.json());

console.log('Server is running on port 5000');
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});