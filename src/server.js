import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/index.js";
import logger, { errorRotateTransport } from "./config/logger.js";


const PORT = env.port;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
    errorRotateTransport.on("finish", () => process.exit(1));
    logger.end();;

  };
};

startServer();
