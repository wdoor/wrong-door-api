import Page, { TPCPages } from "../page";
import WeekColor, { WeekColors } from "../weekcolor";
import ScheduleRequest from "./request";

class SchedulePage extends Page {
    public have_today_replaces = true;

    public have_tomorrow_replaces = true;

    public have_lessons = true;

    public week_color: WeekColors;

    public ready: Promise<void>;

    constructor(request: ScheduleRequest) {
        super();
        this.ready = new Promise((resolve) => {
            SchedulePage.get_schedule(request).then(
                async (page) => {
                    this.get_replaces(page);
                    this.week_color = await WeekColor.get_week_color(page);
                    resolve();
                },
            );
        });
    }

    private async get_replaces(page: Document) {
        const today_replace = await SchedulePage.getByXPath(
            page,
            "/html/body/table//tr[1]/td[2]/table[2]//tr[1]/td[2]/table//tr/td/table//tr/td[@class='head3']/text()",
        );
        today_replace.forEach((header) => {
            if (header.includes("нет!")) {
                if (header.includes("на сегодня")) this.have_today_replaces = false;
                if (header.includes("на завтра")) this.have_tomorrow_replaces = false;
                if (header.includes("расписания")) this.have_tomorrow_replaces = false;
            }
        });
    }

    private static async get_schedule(
        sch_req: ScheduleRequest,
    ): Promise<Document> {
        return new Promise<Document>(async (resolve) => {
            const page = await SchedulePage.getPage(
                    TPCPages.ScheduleByGroups,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    new URLSearchParams(sch_req as any),
            );
            resolve(page);
        });
    }
}

export default SchedulePage;
