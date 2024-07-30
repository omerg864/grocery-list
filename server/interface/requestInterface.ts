import { UserDocument } from "./userInterface";
import { Request } from "express";

export interface RequestWithUser extends Request {
    user: UserDocument | null;
}
