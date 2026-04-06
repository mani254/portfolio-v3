import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ success: true, data: "Test route is working!" });
});

export default router;
