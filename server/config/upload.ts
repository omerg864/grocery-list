import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';
const storage = multer.memoryStorage();

const upload = multer({ storage });


export { upload };