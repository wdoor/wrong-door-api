import ChatDB from "./chat_db";
import Message from "./chat_interface";

test("ChatDB == get", async () => {
    const chat = await ChatDB.get();
    expect(chat.length).toBeGreaterThan(1);
});

test("Chat == add", async () => {
    const message = new Message();
    message.message = "Test is in here";
    message.username = "dev";
    const message_result = await ChatDB.add(message);
    expect(message_result).toBe(true);
});
