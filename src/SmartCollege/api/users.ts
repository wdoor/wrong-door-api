import { Request, Response, Router } from "express";
import UsersDB from "../DataBase/users/user_db";
import User from "../DataBase/users/user_interface";
import ApiResponse from "./response/api_response";
import ResponseCode from "./response/codes";

const router = Router();

router.post("/get", async (req: Request, res: Response) => {
        const user = req.body as User;
        if (user.havePassLog() || user.haveUserId()) {
            res.json(await UsersDB.select(req.body));
        } else {
            res.json(new ApiResponse(ResponseCode.UnexpecterArgument, "не указаны поля"));
        }
});

router.post("/getAll", async (_: Request, res: Response) => {
        res.json(await UsersDB.get());
});

export default router;
