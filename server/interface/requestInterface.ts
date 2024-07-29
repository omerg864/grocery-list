import { User } from "./userInterface";
import { Request } from "express";

export interface RequestWithUser extends Request {
    user: User | null;
}
