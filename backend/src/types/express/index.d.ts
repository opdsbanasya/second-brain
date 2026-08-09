import { UserTypes } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserTypes;
      rawQuery?: string 
    }
  }
}

export {};