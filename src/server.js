import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/index.js";

const PORT = env.port;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  };
};

startServer();
