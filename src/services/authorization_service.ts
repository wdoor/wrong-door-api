import { NextFunction, Request, Response } from "express";
import UsersDB from "../DataBase/users/user_db";
import AccessLevel from "../DataBase/users/access_level";
import User from "../DataBase/users/user_interface";
import ResponseCode from "../api/response/codes";
import ApiResponse from "../api/response/api_response";

class AuthService {
    static async worker(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userAuth = (req.body); //  Переводим json в AccessCall
        const user: User = new User(userAuth);
        let accesslevel: AccessLevel = AccessLevel.Denied;
        if (userAuth.apikey != null) { // Если не существует apikey или он не равен секретному ключу
            if (userAuth.apikey === process.env.API_KEY) {
                accesslevel = AccessLevel.Admin;
            } else {
                accesslevel = AccessLevel.Denied;
            }
        } else if (await user.havePassLog()) { //  Если есть связка пароль-логин
            const access_user = await UsersDB.getByPassAndName(user.password, user.username);
            accesslevel = access_user.accesslevel;
        } else if (await user.haveUserId()) { //    Если есть уникальный id девайса
            const access_user = await UsersDB.getByUID(user.userId);
            accesslevel = access_user.accesslevel;
        }
        let log = "";
        if (accesslevel === AccessLevel.Denied) { //  При разных уровнях доступа делаем разные вещи
            log = "неверные данные для аутентификации";
            res.json(new ApiResponse(ResponseCode.BadAuth, log));
        } else if (accesslevel === AccessLevel.NoUser) {
            log = "пользователя не существует или данные для аутентификации не предоставлены";
            res.json(new ApiResponse(ResponseCode.ExpecterAuthCode, log));
        } else {
            log = "запрос разрешен";
            next();
        }
    }
}

export default AuthService;
