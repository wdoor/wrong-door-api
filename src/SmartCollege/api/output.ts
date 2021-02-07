import { Request, Response, Router } from "express";
import OutputDB from "../DataBase/output/output_db";
import OutpLog from "../DataBase/output/output_interface";
import ApiResponse from "./response/api_response";
import ResponseCode from "./response/codes";

const router = Router();

router.post("/get", async (_: Request, res: Response) => {
        res.json(await OutputDB.get());
});

router.post("/add", async (req: Request, res: Response) => {
        const outlog = req.body as OutpLog;
        if (outlog.isfull()) {
            res.json(await OutputDB.add(req.body));
        } else {
            res.json(new ApiResponse(ResponseCode.UnexpecterArgument, "не указаны поля"));
        }
});

export default router;
