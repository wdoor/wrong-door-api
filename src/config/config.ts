import dotenv from "dotenv";

dotenv.config();

export default class Config {
	public static ApiSecret: string = process.env.API_KEY!;

	public static Port = Number(process.env.PORT!);
}
