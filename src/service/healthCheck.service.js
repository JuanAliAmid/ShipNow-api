import connectedDataBase from "../repository/healthCheck.repository.js";
import { env } from "../config/index.js";
import { createError } from "../utils/apiResponse.js";
import ERROR_CODES from "../errors/error.codes.js";

const connectedDataBaseService = () => {
  const isConnected = connectedDataBase();
  if (!isConnected) {
    throw createError(ERROR_CODES.DATABASE_UNAVAILABLE);
  };
  return {
    environment: env.nodeEnv,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: "connected"
  };
};

export default connectedDataBaseService;