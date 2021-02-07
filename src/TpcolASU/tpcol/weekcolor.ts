import Page from "./page";

enum WeekColors {
    Green = 1,
    Red = 0
}

class WeekColor {
    /**
     * Отправляет запрос на "Расписанеи по группам" и
     * находит надпись "Красная неделя" или "Зеленая неделя"
     * @param page если есть экземпляр страницы, то для оптимизации лучще использовать его...
     * @return цвет недели енумом WeekColors
     */
    public static async get_week_color(page: Document): Promise<WeekColors> {
        return new Promise<WeekColors>(async (resolve) => {
            const xpath = "/html/body/table//tr[1]/td[2]/table[2]//tr[1]/td[2]/table//tr/td/table//tr[2]/td/table//tr/td[2]/font/text()";
            const week_color = (await Page.getByXPath(page, xpath))[0];
            if (week_color === "КРАСНАЯ неделя") {
                resolve(WeekColors.Red);
            } else {
                resolve(WeekColors.Green);
            }
        });
    }
}

export default WeekColor;
export { WeekColors };
