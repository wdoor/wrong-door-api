import { Request, Response, Router } from "express";
import ChatDB from "../DataBase/chat/chat_db";
import Message from "../DataBase/chat/chat_interface";
import ApiResponse from "./response/api_response";
import ResponseCode from "./response/codes";

const router = Router();

router.post("/add", async (req: Request, res: Response) => {
        const message = new Message(req.body);
        if (message.isfull()) {
            res.json(await ChatDB.add(message));
        } else {
            res.json(new ApiResponse(ResponseCode.UnexpecterArgument, "скорее всего вы забыли заполнить поле"));
        }
});

router.post("/get", async (_: Request, res: Response) => {
    res.json(await ChatDB.get());
});

export default router;
