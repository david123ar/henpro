import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb://admin:imperial_merta2030@72.60.16.199:27017/?authSource=admin";
const MONGODB_DB = "mydatabase";

if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env");

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function connectDB() {
  const client = await clientPromise;
  return client.db(MONGODB_DB);
}

export default clientPromise;
