import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
  db?: typeof mongoose;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<typeof mongoose | undefined> => {
  if (connection.isConnected) {
    return connection.db;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    connection.db = db;
    return db;
  } catch (error) {
    console.error("Error occured while connecting to DB");
    throw new Error("Error occured while connecting to DB");
  }
};

export default dbConnect;
