import express from "express";
import usersRouter from "./routes/users.router.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from './routes/products.router.js';
import mocksRouter from './routes/mocks.router.js';
import errorHandler from "./middlewares/errorHandler.js";
import { createError } from "./utils/apiResponse.js";
import ERROR_CODES from "./errors/error.codes.js";
import loggerRouter from './routes/logger.router.js';

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "success",
    message: "API funcionando"
  });
});

app.use('/', loggerRouter);
app.use("/api/users", usersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/mocks", mocksRouter);

app.use((_req, _res, next) => {
  next(createError(ERROR_CODES.ROUTE_NOT_FOUND));
});

app.use(errorHandler.error);

export default app;
