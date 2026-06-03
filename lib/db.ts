import dbConnect, { MongoConnectionError } from './mongodb';

export async function connectToDB() {
  return dbConnect();
}

export { MongoConnectionError } from './mongodb';
