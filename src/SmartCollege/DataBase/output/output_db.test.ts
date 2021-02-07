import OutputDB from "./output_db";
import OutpLog from "./output_interface";

test("Output == get", async () => {
    const outp = await OutputDB.get();
    expect(outp.length).toBeGreaterThanOrEqual(5);
});

test("Output == add", async () => {
    const log = new OutpLog();
    log.message = "jest test";
    log.username = "dev";
    const outp_add_res = await OutputDB.add(log);
    expect(outp_add_res).toBe(true);
    expect(log.isfull()).toBe(true);
});
