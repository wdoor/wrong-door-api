import { SmartCollege } from "../../../database";
import Command from "./command_interface";

export default class CommandsDB {
    /**
     * @returns массив команд из базы
     */
    public static async get(): Promise<Command[]> {
        const output: Command[] = [];
        return new Promise((resolve) => {
            SmartCollege.query("SELECT * FROM commands",
                (_, rows) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    rows.forEach((row: any) => {
                        const command = new Command();
                        command.command = row.command;
                        command.type = row.type;
                        command.id = row.id;
                        output.push(command);
                    });
                    resolve(output);
                });
        });
    }

    /**
     * Добавляет команду в базу
     * @param command Команда
     * @returns успешность добавления команды
     */
    public static async add(command: Command): Promise<boolean> {
        return new Promise((resolve) => {
            SmartCollege.query(
                "INSERT INTO commands (command, type) VALUES (? , ?)",
                [command.command, command.type],
            );
            resolve(true);
        });
    }

    /**
     * Пытаеться удалить команду из базы данных
     * @param id Идентификатор команды
     * @returns успешнось удаления
     */
    public static async delete(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            SmartCollege.query("DELETE IGNORE FROM commands WHERE id = ? LIMIT 1", id);
            resolve(true);
        });
    }
}
