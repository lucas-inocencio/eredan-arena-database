import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';

// Load environment variables from .env file
dotenv.config();

const app = express();
// Enable CORS for all routes
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI;
// Create a new MongoClient instance
const client = new MongoClient(uri);

// Variable to store the database instance
let db;

/**
 * Connects to the MongoDB database.
 * This function should be called once when the application starts.
 */
async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('EACards'); // Assign the database instance to the global 'db' variable
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        // Exit the process if database connection fails
        process.exit(1);
    }
}

/**
 * Fetches documents from a specified collection, optionally applying a filter.
 * @param {string} collectionName - The name of the collection to fetch from.
 * @param {object} [filter={}] - An optional filter object to apply to the query (e.g., { class: 'heroclass' }).
 * @returns {Promise<Array>} A promise that resolves to an array of documents.
 */
async function fetchCollection(collectionName, filter = {}) {
    // Ensure the database connection is established before querying
    if (!db) {
        throw new Error('Database not connected. Please call connectToDatabase first.');
    }
    // Access the specified collection and find documents matching the filter
    const documents = await db.collection(collectionName).find(filter).toArray();
    return documents;
}

// Route to check if the server is running
app.get('/', (_req, res) => {
    res.send('Welcome to the EACards API! Available endpoints with optional filters: /api/cards, /api/equips, /api/skills. Example: /api/cards?class=Warrior');
});

// Endpoint to fetch cards with optional filters
app.get('/api/cards', async (req, res) => {
    try {
        // Extract query parameters from the request to use as a filter
        const filter = req.query;
        const cards = await fetchCollection('eacards', filter);
        res.json(cards); // Send the fetched cards as a JSON response
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Endpoint to fetch equipments with optional filters
app.get('/api/equips', async (req, res) => {
    try {
        // Extract query parameters from the request to use as a filter
        const filter = req.query;
        const equips = await fetchCollection('eaequips', filter);
        res.json(equips); // Send the fetched equipments as a JSON response
    } catch (error) {
        console.error('Error fetching equipments:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Endpoint to fetch skills with optional filters
app.get('/api/skills', async (req, res) => {
    try {
        // Extract query parameters from the request to use as a filter
        const filter = req.query;
        const skills = await fetchCollection('easkills', filter);
        res.json(skills); // Send the fetched skills as a JSON response
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Define the port, defaulting to 5000 if not specified in environment variables
const PORT = process.env.PORT;

// Start the server after successfully connecting to the database
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    await client.close(); // Close the MongoDB connection
    console.log('MongoDB connection closed.');
    process.exit(0); // Exit the process
});