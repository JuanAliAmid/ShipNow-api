import { Router } from "express";
import { deliveryController } from "../controller/delivery.controller.js";

const router = Router();

router.get('/', deliveryController.getAll);
router.get('/:did', deliveryController.getById);
router.put('/:did/status', deliveryController.updateStatus);

export default router;