import { Router } from "express";
import { productController } from "../controller/products.controller.js";

const router = Router();

router.get('/', productController.findAll)
router.get('/:id', productController.findById)
router.post('/', productController.create)
router.put('/:id/status', productController.updateStatus)
router.delete('/:id', productController.delete)

export default router;
