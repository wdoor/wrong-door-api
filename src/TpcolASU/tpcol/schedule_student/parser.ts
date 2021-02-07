import Page, { TPCPages } from "../page";
import Lecture from "./lecture";
import ScheduleRequest from "./request";

class Schedule {
    /**
     * Возвращает расписанеи с заменами на запрос "ScheduleRequest"
     * @param tpc_req группа, день, цвет недели
     * @returns лекции
     */
    public static async get(tpc_req: ScheduleRequest): Promise<Lecture[]> {
        return new Promise(async (resolve) => {
            const doc = await Page.getPage(
                TPCPages.ScheduleByGroups,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                new URLSearchParams(tpc_req as any),
            );
            const n_lec = await Page.getColumn(doc, 3, 1);
            const name_lec = await Page.getColumn(doc, 3, 2);
            const lectures: Lecture[] = [];
            name_lec.forEach((name, i) => {
                lectures.push(
                    {
                        id: parseInt(n_lec[i], 10),
                        title: name,
                    } as Lecture,
                );
            });
            resolve(lectures);
        });
    }
}

export default Schedule;
