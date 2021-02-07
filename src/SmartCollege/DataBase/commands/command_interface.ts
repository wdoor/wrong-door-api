import JsonIntertface from "../json_interface";
import CommandType from "./command_types";

class Command extends JsonIntertface {
    public id?: number;

    public command: string;

    public type: CommandType;

    isfull(): boolean {
        if (this.command !== null && this.type !== null) return (true);
        return (false);
    }
}

export default Command;
