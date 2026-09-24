import { Router } from "express";
import mocksController from "../controller/mocks.controller.js";

const router = Router();

router.get('/users', mocksController.users);
router.get('/deliveries', mocksController.deliveries);
router.get('/drivers', mocksController.drivers);
router.get('/orders', mocksController.orders);
router.post('/seed', mocksController.saveMocks);

export default router;