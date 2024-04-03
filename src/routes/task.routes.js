import { Router } from "express";
import {
    deleteAll,
    deleteTask,
    showUserTask,
    // showAllTask,
    taskDone,
    userTask
} from "../controllers/task.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
// router.use(verifyJWT); // apply verifyJWT middleware to all routes in this file
router.route("/user-task").post(verifyJWT,userTask)
router.route("/delete-task").delete(verifyJWT,deleteTask)
router.route("/delete-all").delete(verifyJWT,deleteAll)
router.route("/c/:taskId").patch(verifyJWT,taskDone)
// router.route("/all-task").get(verifyJWT,showAllTask)
router.route("/all-task").get(verifyJWT,showUserTask)

export default router