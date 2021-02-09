import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export default class Page {
    /**
     * Пробегаеца по каждой строчке в столбике в таблице в документе, записывая данные из оных
     * @param doc страница (Document)
     * @param table_n номер таблицы на странице
     * @param column_n номер столбика на странице
     * @returns массив текстовых значений ячеек
     */
    public static async getColumn(
        doc: Document,
        table_n: number,
        column_n: number,
    ): Promise<string[]> {
        return new Promise<string[]>(async (resolve) => {
            const path = `/html/body/table//tr[1]/td[2]/table[2]//tr[1]/td[2]/table//tr/td/table[${table_n}]//tr/td[2]/table//tr[1]/td[2]/table//tr[position()>1]/td[${column_n}]`;
            const table = await Page.getByXPath(doc, path);
            resolve(table);
        });
    }

    /**
     * Отправляет post запрос на указанную страницу тпк
     * @param url url запроса
     * @param args post аргументы
     * @returns Document страницы сайта тпк
     */
    public static async getPage(
        url: string,
        args: URLSearchParams = new URLSearchParams(),
    ): Promise<Document> {
        return new Promise<Document>(async (resolve) => {
            const response = await fetch(url, {
                method: "post",
                body: args.toString(),
                headers: { "Content-Type": "application/x-www-form-urlencoded;" },
            });
            const jsdom: JSDOM = new JSDOM();
            const dom_parser: DOMParser = new jsdom.window.DOMParser();
            const doc: Document = dom_parser.parseFromString(await response.textConverted(), "text/html");
            resolve(doc);
        });
    }

    /**
     * Возвращает элементы по xpath'у
     * @param document страница (Document)
     * @param xpath путь к элементу в формате XPath
     * @returns элементы по xpath'у
     */
    public static async getByXPath(
        document: Document,
        xpath: string,
    ): Promise<string[]> {
        return new Promise<string[]>(async (resolve) => {
            const node_values: string[] = [];
            const nodes = document.evaluate(
                xpath,
                document,
                null,
                0,
                null,
            );
            let node_value: string | null | undefined;
            while (node_value = nodes.iterateNext()?.textContent) {
                node_values.push(node_value);
            }
            resolve(node_values);
        });
    }
}

export enum TPCPages {
    /** Расписание групп */
    ScheduleByGroups = "http://www.tpcol.ru/asu/timetablestud.php?f=1",
    /** Расписание преподавателей */
    ScheduleByTeachers = "http://www.tpcol.ru/asu/timetableprep.php?f=1",
    /** Расписание экзаменов */
    Exams = "http://www.tpcol.ru/asu/exams.php?f=1",
}
