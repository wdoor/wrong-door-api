/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";

dotenv.config();

export default class Config {
	public static ApiSecret: string = process.env.API_KEY!;

	public static Port = Number(process.env.PORT!);

	public static SecretKey: string = process.env.SECRET!;
}
