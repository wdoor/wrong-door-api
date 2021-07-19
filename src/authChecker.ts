import { AuthChecker } from "type-graphql";

export interface User {
  id: number;
}

export interface ContextType {
  user: User | undefined;
}

export const AuthMiddleware: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles
) => {
  let isUserAuthed = false;

  if (context.user != null) {
    const userId = context.user.id;
    isUserAuthed = true;
  }

  return isUserAuthed;
};
