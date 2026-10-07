import mongoose from "mongoose";
import { env } from "./index.js";
import logger from "./logger.js";

const connectDB = async () => {
  const mongoUri = env.mongodb_uri;

  if (!mongoUri) {
    throw new Error('Falta la variable MONGODB_URI');
  };

  await mongoose.connect(mongoUri);
  logger.info("MongoDB conectado");
};

export default connectDB;
