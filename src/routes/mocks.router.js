import { Router } from "express";
import mocksController from "../controller/mocks.controller.js";
import { block } from "../middlewares/endpointsBloqueds.js";

const router = Router();

router.get('/users', block, mocksController.users);
router.get('/deliveries', block, mocksController.deliveries);
router.get('/drivers', block, mocksController.drivers);
router.get('/orders', block, mocksController.orders);
router.post('/seed', block, mocksController.saveMocks);

export default router;