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
 * This version supports case-insensitive string matching for query parameters.
 * @param {string} collectionName - The name of the collection to fetch from.
 * @param {object} [queryFilter={}] - An optional filter object derived from req.query.
 * @returns {Promise<Array>} A promise that resolves to an array of documents.
 */
async function fetchCollection(collectionName, queryFilter = {}) {
    // Ensure the database connection is established before querying
    if (!db) {
        throw new Error('Database not connected. Please call connectToDatabase first.');
    }

    // Transform queryFilter to support case-insensitive matching for string values
    const mongoFilter = {};
    for (const key in queryFilter) {
        if (Object.prototype.hasOwnProperty.call(queryFilter, key)) {
            const value = queryFilter[key];
            if (typeof value === 'string') {
                // Use MongoDB's $regex operator with 'i' (case-insensitive) option
                mongoFilter[key] = { $regex: new RegExp(value, 'i') };
            } else {
                // For non-string values (numbers, booleans), use exact match
                mongoFilter[key] = value;
            }
        }
    }

    // Access the specified collection and find documents matching the constructed filter
    // MongoDB's .find() method inherently performs an AND operation for multiple fields in the filter object.
    const documents = await db.collection(collectionName).find(mongoFilter).toArray();
    return documents;
}

// Route to check if the server is running
app.get('/', (_req, res) => {
    res.send('Welcome to the EACards API! Available endpoints with optional filters: /api/cards, /api/equips, /api/skills. Example: /api/cards?class=Warrior&race=Human');
});

// Endpoint to fetch cards with optional filters
const endpoints = [
    { path: '/api/cards', collection: 'eacards' },
    { path: '/api/equips', collection: 'eaequips' },
    { path: '/api/skills', collection: 'easkills' }
];

endpoints.forEach(({ path, collection }) => {
    app.get(path, async (req, res) => {
        try {
            const data = await fetchCollection(collection, req.query);
            res.json(data);
        } catch (error) {
            console.error(`Error fetching from ${collection}:`, error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    });
});

const PORT = process.env.PORT; // Use environment variable or default to 5000

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
