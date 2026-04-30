import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export function getMongoConnection() {
  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not configured.");
    }

    connectionPromise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  return connectionPromise;
}
