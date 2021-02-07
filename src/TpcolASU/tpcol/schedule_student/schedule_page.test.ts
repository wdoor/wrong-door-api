import SchedulePage from "./schedule_page";
import ScheduleRequest from "./request";
import { WeekColors } from "../weekcolor";

const req: ScheduleRequest = {
    group: 556,
    day: 5,
    week: WeekColors.Green,
};

test("SchedulePage == constructor", async () => {
    const schedule_page = new SchedulePage(req);
    await schedule_page.ready;
    expect(schedule_page).not.toBe(null);
});

test("Schedule == lessons", async () => {
    const schedule_page = new SchedulePage(req);
    await schedule_page.ready;
    expect(schedule_page.have_lessons).toBe(true);
});

test("Schedule == today replaces", async () => {
    const schedule_page = new SchedulePage(req);
    await schedule_page.ready;
    expect(schedule_page.have_today_replaces).toBe(false);
});

test("Schedule == tomorrow replaces", async () => {
    const schedule_page = new SchedulePage(req);
    await schedule_page.ready;
    expect(schedule_page.have_tomorrow_replaces).toBe(false);
});
