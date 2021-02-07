import { WeekColors } from "../weekcolor";
import Lecture from "./lecture";

interface Schedule
{
    weekColor: WeekColors,
    lectures: Lecture[]
}

export default Schedule;
