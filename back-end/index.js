import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS for all routes

// your routes

const uri = process.env.MONGODB_URI
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

app.get('/', (_req, res) => {
    res.send('So vamos trabalhar com o endpoint /api/cards');
});

// endpoint to fetch cards
app.get('/api/cards', async (_req, res) => {
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