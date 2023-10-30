import { connect, connection } from 'mongoose';

export async function connectToDB() {
  if (!connection.readyState) {
    await connect(process.env.MONGODB_URI as string);
  }
}
