import { AuthError } from "next-auth";

export class OAuthAccountAlreadyLinkedError extends AuthError {
  static type = "OAuthAccountAlreadyLinked";
}

// Define custom error class for better error handling
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}
