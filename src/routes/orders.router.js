import { Router } from "express";
import { getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder, uploadedReceipt } from "../controller/order.controller.js";
import { uploaders } from "../middlewares/upload.middleware.js";


const router = Router();

router.get("/", getOrders);

router.get("/:oid", getOrderById);

router.post("/", createOrder);

router.post("/:oid/receipt", uploaders.receipts.single('receipt'), uploadedReceipt);

router.put("/:oid/status", updateOrderStatus);

router.delete("/:oid", deleteOrder);

export default router;
