import { Router } from "express";
import {
    deleteCompleted,
    deleteTask,
    showIncompleteTask,
    showCompleteTask,
    showAllTask,
    // showUserTask,
    taskDone,
    userTask
} from "../controllers/task.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
// router.use(verifyJWT); // apply verifyJWT middleware to all routes in this file
router.route("/user-task").post(verifyJWT,userTask)
router.route("/delete-task").delete(verifyJWT,deleteTask)
router.route("/delete-completed").delete(verifyJWT,deleteCompleted)
router.route("/c/:taskId").patch(verifyJWT,taskDone)
router.route("/incomplete-task").get(verifyJWT,showIncompleteTask)
router.route("/complete-task").get(verifyJWT,showCompleteTask)
router.route("/all-task").get(verifyJWT,showAllTask)
// router.route("/all-task").get(verifyJWT,showUserTask)

export default router