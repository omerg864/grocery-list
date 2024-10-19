import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const googleAuthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);

export default googleAuthClient;