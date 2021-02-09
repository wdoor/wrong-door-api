import express, { Router } from "express";
import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} from "graphql";
import Schedule from "./tpcol/schedule_student/parser";
import ScheduleRequest from "./tpcol/schedule_student/request";
import SchedulePage from "./tpcol/schedule_student/schedule_page";
import { WeekColors } from "./tpcol/weekcolor";

const req: ScheduleRequest = {
    group: 556,
    day: 5,
    week: WeekColors.Green,
};

const LectureType = new GraphQLObjectType({
    name: "Lecture",
    description: "lecture of student",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        teacher: { type: GraphQLString },
    }),
});

const ScheduleType = new GraphQLObjectType({
    name: "Schedule",
    description: "schedule of student",
    fields: () => ({
        week_color: { type: GraphQLNonNull(GraphQLInt) },
        lectures: { type: GraphQLNonNull(GraphQLList(LectureType)) },
    }),
});

const RootQuery = new GraphQLObjectType(
    {
        name: "TpcolAPI",
        fields: () => ({
            schedule: {
                type: GraphQLList(LectureType),
                resolve: async () => {
                    const schedule = await Schedule.get(req);
                    console.log(schedule);
                    return (schedule);
                },
            },
        }),
    },
);

const schema = new GraphQLSchema({
    query: RootQuery,
});
// Определение роутера
const router = Router();

// Парсим body на json
router.use("/", express.json());

export default schema;
