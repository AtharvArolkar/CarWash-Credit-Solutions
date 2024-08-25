import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    //TODO: Remove while deploying
    console.log("DB Already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;

    //TODO: Remove while deploying
    console.log("DB connected successfully");
  } catch (error) {
    console.error("Error occured while connecting to DB");
    throw new Error("Error occured while connecting to DB");
  }
};

export default dbConnect;
