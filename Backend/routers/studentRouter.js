import { Router } from "express";
import * as ctrl from "../controllers/studentController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// كل مسارات الطالب تحتاج مصادقة + دور student
router.use(protect, restrictTo("student"));

router.get("/me", ctrl.me);
router.get("/cohorts", ctrl.myCohorts);
router.get("/grades", ctrl.myGrades);
router.get("/attendance", ctrl.myAttendance);
router.get("/notes", ctrl.myNotes);

export default router;
