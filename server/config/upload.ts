import multer from 'multer';
import { v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';
const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadToCloudinary = (imgBuffer: Buffer, folder: string, publicId: string): Promise<string> => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
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


export { upload, uploadToCloudinary };