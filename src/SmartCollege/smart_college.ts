import express, {
    NextFunction, Request, Response, Router,
} from "express";

//       Импорт роутеров
import Users from "./api/users";
import Commands from "./api/commands";
import Chat from "./api/chat";
import Output from "./api/output";
//    - - - - - - - - - - -

//       Импорт сервисов
import AuthService from "./services/authorization_service";
//    - - - - - - - - - - -

const router = Router(); // Определение роутера

router.use("/", express.json()); //  Парсим body на json

//  XXX: поменять на куки?
//  Проверяем наличие доступа на все запросы, поступающие на этот роутер,
//  запрос должен содержать ApiKey или UserName-Password или uniqueId

router.use("/", async (req: Request, res: Response, next: NextFunction) => {
    AuthService.worker(req, res, next);
});

//          --- Routers ---
router.use("/users", Users);
router.use("/commands", Commands);
router.use("/chat", Chat);
router.use("/output", Output);
//          --- Routers ---

export default router;
