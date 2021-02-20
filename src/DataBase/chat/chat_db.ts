import { SmartCollege } from "../../database";
import Message from "./chat_interface";

export default class ChatDB {
    /**
     * @returns массив сообщений чата
     */
    static async get(): Promise<Message[]> {
        const chat: Message[] = [];
        return new Promise((resolve) => {
            SmartCollege.query("SELECT * FROM chat",
                (_, rows) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    rows.forEach((row: any) => {
                        const message = new Message();
                        message.message = row.message;
                        message.username = row.username;
                        chat.push(message);
                    });
                    resolve(chat);
                });
        });
    }

    /**
     * Добавляет сообщение в чат
     * @param message Сообщение
     * @returns успешность добавления в чат
     */
    static async add(message: Message): Promise<boolean> {
        return new Promise((resolve) => {
            SmartCollege.query(
                "INSERT INTO chat (username, message) VALUES (? , ?)",
                [message.username, message.message],
            );
            resolve(true);
        });
    }
}
