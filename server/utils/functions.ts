import { createTransport } from 'nodemailer';
import Item from '../models/itemModel';
import ListItem from '../models/listItemModel';
import { ListItemDocument } from '../interface/listItemInterface';
import { ItemDocument } from '../interface/itemInterface';
import { deleteFromCloudinary } from '../config/cloud';

export const sendEmail = async (receiver: string, subject: string, text: string): Promise<boolean> => {
    var transporter = createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    
    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: receiver,
        subject: subject,
        text: text
    };
    let success = false;
    await transporter.sendMail(mailOptions).then(() => {
        success = true;
    }).catch((err) => {
        console.log(err);
        success = false;
    });
    return success;
}

export const extractPublicId = (url: string): string => {
    // Remove the base URL and extract the part after /upload/
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) {
        throw new Error("Invalid Cloudinary URL");
    }
    const parts = url.substring(uploadIndex + 8).split('/'); // +8 to skip "/upload/"
    const publicIdWithExtension = parts.slice(1).join('/'); // Skip the version part

    // Remove the file extension
    const dotIndex = publicIdWithExtension.lastIndexOf('.');
    const publicId = dotIndex !== -1 ? publicIdWithExtension.substring(0, dotIndex) : publicIdWithExtension;

    return publicId;
}

const checkListItem = (listItemsWithSameImg: ListItemDocument[], ItemWithTheSameImg: ItemDocument[]) => {
    let deleteImage = true;
    if (listItemsWithSameImg.length > 1) {
        deleteImage = false;
    }
    if (ItemWithTheSameImg.length > 0) {
        deleteImage = false;
    }
    return deleteImage;
}

const checkItem = (listItemsWithSameImg: ListItemDocument[], ItemWithTheSameImg: ItemDocument[]) => {
    let deleteImage = true;
    if (listItemsWithSameImg.length > 0) {
        deleteImage = false;
    }
    if (ItemWithTheSameImg.length > 1) {
        deleteImage = false;
    }
    return deleteImage;
}

export const deleteImage = async (img: string, item?: boolean) => {
    const [listItemsWithSameImg, ItemWithTheSameImg] = await Promise.all([ListItem.find({ img: img }), Item.find({ img: img })]);
    let deleteImage = item ? checkItem(listItemsWithSameImg, ItemWithTheSameImg) : checkListItem(listItemsWithSameImg, ItemWithTheSameImg);
    if (deleteImage) {
        await deleteFromCloudinary(img);
    }
}