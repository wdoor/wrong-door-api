import { SmartCollege } from "../../database";
import OutpLog from "./output_interface";

export default class OutputDB {
    /**
     * @returns выводы командной строки.. или PsExec ... или Вируса
     */
    static async get(): Promise<OutpLog[]> {
        const output: OutpLog[] = [];
        return new Promise((resolve) => {
            SmartCollege.query("SELECT * FROM output",
                (_, rows) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    rows.forEach((row: any) => {
                        const outp = new OutpLog();
                        outp.message = row.message;
                        outp.username = row.username;
                        output.push(outp);
                    });
                    resolve(output);
                });
        });
    }

    /**
     * Добавляет сообщение в вывод
     * @param outlog Сообщение
     * @returns успешность добавления сообщения.
     */
    static add(outlog: OutpLog): Promise<boolean> {
        return new Promise((resolve) => {
            SmartCollege.query(
                "INSERT INTO output (username, message) VALUES (? , ?)",
                [outlog.username, outlog.message],
            );
            resolve(true);
        });
    }
}
