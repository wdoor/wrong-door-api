import CommandsDB from "./command_db";

test("Commands == get", async () => {
    const commands = await CommandsDB.get();
    expect(commands.length).toBeGreaterThanOrEqual(0);
});

//  TODO: тестовая база данных, без неё невозможно делать это говно
// test("Commands", async () =>
// {
//     //Test of Command interface
//     test("Command == interface");
//     let command = new Command();
//     command.command = "exho test";
//     command.type = CommandType.CMD;
//     expect(command.isfull()).toBe(true);

//     test("Command == add", async () =>
//     {
//         let add_result = await CommandsDB.add(command);
//         expect(add_result).toBe(true)

//         test("Command == get", async () =>
//         {
//             let commands_start = await CommandsDB.get();
//             expect(commands_start.length).toBeGreaterThanOrEqual(1);

//             test("Commands == delete", async (err) =>
//             {
//                 let delete_result;
//                 if(commands_start[0].id)
//                     delete_result = await CommandsDB.delete(commands_start[0].id.toString());
//                 else
//                     err.fail("No Commands in database");
//                 expect(delete_result).toBe(true);
//             });
//         });
//     });
// });
