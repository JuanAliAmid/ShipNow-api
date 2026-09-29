import mongoose from "mongoose";
import { env } from "./index.js";

const connectDB = async () => {
  const mongoUri = env.mongodb_uri;

  if (!mongoUri) {
    throw new Error('Falta la variable MONGODB_URI');
  };

  await mongoose.connect(mongoUri);
  console.log("MongoDB conectado");
};

export default connectDB;
