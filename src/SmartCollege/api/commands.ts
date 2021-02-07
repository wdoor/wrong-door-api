import { Request, Response, Router } from "express";
import CommandsDB from "../DataBase/commands/command_db";
import Command from "../DataBase/commands/command_interface";
import ApiResponse from "./response/api_response";
import ResponseCode from "./response/codes";

const router = Router();

router.post("/get", async (_: Request, res: Response) => {
        res.json(await CommandsDB.get());
});

router.post("/add", async (req: Request, res: Response) => {
        const command = req.body as Command;

        if (command.isfull()) {
            res.json(CommandsDB.add(req.body));
        } else {
            res.json(new ApiResponse(ResponseCode.UnexpecterArgument, "не указаны поля"));
        }
});

router.post("/delete", async (req: Request, res: Response) => {
        const { id } = req.body;

        if (id !== null) {
            res.json(await CommandsDB.delete(id));
        } else {
            res.json(new ApiResponse(ResponseCode.UnexpecterArgument, "id не указано"));
        }
});

export default router;
