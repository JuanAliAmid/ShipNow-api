import express from "express";
import usersRouter from "./routes/users.router.js";
import deliveryRouter from './routes/delivery.router.js';
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from './routes/products.router.js';
import mocksRouter from './routes/mocks.router.js';
import errorHandler from "./middlewares/errorHandler.js";
import ERROR_CODES from "./errors/error.codes.js";
import loggerRouter from './routes/logger.router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.config.js';
import { createError } from "./utils/apiResponse.js";
import requestLogger from "./middlewares/requestsLogger.js";
import connectedDataBaseController from "./controller/healthCheck.controller.js";
import { env } from "./config/index.js";

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/health", connectedDataBaseController);

app.use('/', loggerRouter);
app.use("/api/users", usersRouter);
app.use("/api/deliveries", deliveryRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/mocks", mocksRouter);
if(env.enableDocs) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
};


app.use((_req, _res, next) => {
  next(createError(ERROR_CODES.ROUTE_NOT_FOUND));
});

app.use(errorHandler.error);

export default app;
