/** Уровень доступа пользователя */
enum AccessLevel {
  NoUser = -1,
  Denied = 0,
  User = 1,
  Pro = 2,
  Admin = 3,
}

export default AccessLevel;
