import UsersDB from "./user_db";

test("UserDB == get", async () => {
    const users = await UsersDB.get();
    expect(users.length).toBeGreaterThan(0);
});

test("UsersDB == JSONInterface", async () => {
    const users = await UsersDB.get();
    users.forEach(async (user) => {
        if (user.username !== "хзкто") {
            expect(await user.havePassLog()).toBe(true);
            expect(await user.haveUserId()).toBe(true);
            expect(user.isfull()).toBe(true);
        } else {
            expect(await user.havePassLog()).toBe(false);
            expect(user.isfull()).toBe(false);
        }
    });
});

test("UsersDB == select", async () => {
    const users = await UsersDB.get();
    users.forEach(async (user) => {
        const passandlog_result = await UsersDB.getByPassAndName(user.password, user.username);
        expect(passandlog_result).not.toBe(null);

        const userid_result = await UsersDB.getByUID(user.userId);
        expect(userid_result).not.toBe(null);
    });
});
