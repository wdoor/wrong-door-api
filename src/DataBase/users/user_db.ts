import { config } from "dotenv";
import { SmartCollege } from "../../database";
import AccessLevel from "./access_level";
import User from "./user_interface";

config();

export default class UsersDB {
    /** Возвращает список пользователей
     * @returns пользователи
    */
    public static async get(): Promise<User[]> {
        const users: User[] = [];
        return new Promise((resolve) => {
            SmartCollege.query("SELECT * FROM users",
                (_, rows) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    rows.forEach((row: any) => {
                        const user = new User();
                        user.userId = row.userid;
                        user.username = row.customname;
                        user.accesslevel = (row.access as AccessLevel);
                        user.password = row.pass;
                        users.push(user);
                    });
                    resolve(users);
                });
        });
    }

    /** Возвращает "Полного" пользователя (со всеми полями)
     *  если всунуть пользователя только с (id девайса) или (пароль/логин)
     * @param user Не заполненный пользователь
     * @returns пользователь
    */
    static async select(user: User): Promise<User> {
        return new Promise((resolve) => {
            if (user.havePassLog()) {
                resolve(UsersDB.getByPassAndName(user.password, user.username));
            } else if (user.haveUserId()) {
                resolve(UsersDB.getByUID(user.userId));
            } else {
                resolve({} as User);
            }
        });
    }

    /**
     * Возвращает пользователя через пароль-логин,
     * в случае ненахождения пользователя - возвращает пустого пользователя
     * @param pass пароль
     * @param customname логин
     * @returns пользователь
     */
    public static async getByPassAndName(pass: string, customname: string): Promise<User> {
        return new Promise((resolve) => {
            SmartCollege.query("SELECT * FROM users WHERE pass = ? AND customname = ?",
                [pass, customname],
                (_, rows) => {
                    const row = rows[0];
                    if (row) {
                        const user = new User();
                        user.userId = row.userid;
                        user.username = row.customname;
                        user.accesslevel = (row.access as AccessLevel);
                        user.password = row.pass;
                        resolve(user);
                    }
                });
            resolve({} as User);
        });
    }

    /**
     * Возваращает пользователя чере уникальный ID
     * @param uid уникальный id девайса
     * @returns sdsd
     */
    public static async getByUID(uid: string): Promise<User> {
        return new Promise((resolve) => {
            SmartCollege.query("SELECT * FROM users WHERE userid = ?",
                uid,
                (_, rows) => {
                    const row = rows[0];
                    if (row) {
                        const user = new User();
                        user.userId = row.userid;
                        user.username = row.customname;
                        user.accesslevel = (row.access as AccessLevel);
                        user.password = row.pass;
                        resolve(user);
                    }
                });
            resolve({} as User);
        });
    }
}
