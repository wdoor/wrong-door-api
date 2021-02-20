import JsonIntertface from "../json_interface";
import AccessLevel from "./access_level";

class User extends JsonIntertface {
  public userId: string;

  public username: string;

  public accesslevel: AccessLevel;

  public password: string;

  // TODO: Тут, наверное, не нужен async
  public havePassLog(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.password !== null && this.username !== null) resolve(true);
      else resolve(false);
    });
  }

  // TODO: Тут, наверное, не нужен async
  public haveUserId(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.userId !== null) resolve(true);
      else resolve(false);
    });
  }
}

export default User;
