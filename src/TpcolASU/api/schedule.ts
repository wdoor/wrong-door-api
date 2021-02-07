import { Request, Response, Router } from "express";
import Schedule from "../tpcol/schedule_student/parser";
import ScheduleRequest from "../tpcol/schedule_student/request";
import WeekColor from "../tpcol/weekcolor";

const router = Router();

router.post("/get", async (req: Request, res: Response) => {
        const sch_req: ScheduleRequest = req.body;

        if (!sch_req.group) {
            res.status(400).send("не указана группа");
            return;
        }
        if (!sch_req.day) {
            sch_req.day = new Date().getDay();
        }
        if (!sch_req.week) {
            sch_req.week = await WeekColor.getWeekColor();
        }

        res.send(await Schedule.get(sch_req));
});

export default router;
