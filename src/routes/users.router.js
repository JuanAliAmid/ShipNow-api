import { Router } from "express";
import { userController } from "../controller/user.controller.js";

const router = Router();

router.get("/", ), userController.getUsers;

router.get("/:uid", userController.findById);

router.post("/", userController.create);

router.put("/:uid", userController.updateUser);

router.delete("/:uid", userController.delete);

export default router;
