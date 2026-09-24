import express from "express";
import usersRouter from "./routes/users.router.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from './routes/products.router.js';
import mocksRouter from './routes/mocks.router.js';
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "API funcionando"
  });
});

app.use("/api/users", usersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/mocks", mocksRouter);

app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada"
  });
});

app.use(errorHandler.error);

export default app;
