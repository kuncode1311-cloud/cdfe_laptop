import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kuncode1311_db_user:cd0xoTq5PSmTHvqP@laptop-store.ynzhkyj.mongodb.net/laptop_store?retryWrites=true&w=majority&appName=laptop-store';

let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        try {
            // Ping thử để đảm bảo connection còn sống
            await cachedDb.command({ ping: 1 });
            return { client: cachedClient, db: cachedDb };
        } catch {
            cachedClient = null;
            cachedDb = null;
        }
    }

    const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 7000,
        connectTimeoutMS: 7000,
        maxPoolSize: 10
    });

    await client.connect();
    const db = client.db('laptop_store');

    global._mongoClient = client;
    global._mongoDb = db;
    cachedClient = client;
    cachedDb = db;

    return { client, db };
}
