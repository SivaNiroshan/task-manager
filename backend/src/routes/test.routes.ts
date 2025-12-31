import { Router, Request, Response } from "express";
import authMiddleware, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.get("/protected", authMiddleware, (req: AuthRequest, res: Response) => {
    res.json({
        message: "You are authenticated",
        userId: req.userId
    });
});

export default router;
