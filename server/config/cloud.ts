import multer from 'multer';
import { v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';
import env from 'dotenv';
import { extractPublicId } from '../utils/functions';

env.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadToCloudinary = (imgBuffer: Buffer, folder: string, publicId: string): Promise<string> => {
	return new Promise((resolve, reject) => {
	  const stream = cloudinary.uploader.upload_stream(
		{
		  folder: folder,
		  public_id: publicId,
		},
		(error, result) => {
		  if (error) {
			return reject(error);
		  }
		  if (!result) {
			return reject(new Error('No result from Cloudinary'));
		  }
		  resolve(result.secure_url);
		}
	  );
	  streamifier.createReadStream(imgBuffer).pipe(stream);
	});
}

const deleteFromCloudinary = async (url: string) => {
	const public_id = extractPublicId(url);
	if (!public_id) {
	  throw new Error('Invalid URL');
	}
	const result = await cloudinary.uploader.destroy(public_id);
	return result;
}


export { upload, uploadToCloudinary, deleteFromCloudinary };