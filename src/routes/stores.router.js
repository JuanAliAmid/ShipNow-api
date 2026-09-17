import { Router } from "express";
import { storeController } from "../controller/store.controller.js";

const router = Router();

router.get("/", storeController.getStores);

router.get("/:sid", storeController.findById);

router.post("/", storeController.create);

router.put("/:sid", storeController.updateStore);

router.delete("/:sid", storeController.delete);

export default router;
