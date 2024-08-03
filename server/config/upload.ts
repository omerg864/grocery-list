import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';
const storage = multer.memoryStorage();

const unlinkAsync = promisify(fs.unlink);

const upload = multer({ storage });


export { upload, unlinkAsync };