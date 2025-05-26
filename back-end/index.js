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

async function fetchCollection(collectionName) {
    await client.connect();
    const documents = await client.db('EACards').collection(collectionName).find({}).toArray();
    await client.close();
    return documents;
}

const fetchCards = () => fetchCollection('eacards');
const fetchEquips = () => fetchCollection('eaequips');
const fetchSkills = () => fetchCollection('easkills');

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

// endpoint to fetch equipments
app.get('/api/equips', async (_req, res) => {
    try {
        const equips = await fetchEquips();
        res.json(equips);
    } catch (error) {
        console.error('Error fetching equipments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// endpoint to fetch skills
app.get('/api/skills', async (_req, res) => {
    try {
        const skills = await fetchSkills();
        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(express.json());

console.log('Server is running on port 5000');
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});