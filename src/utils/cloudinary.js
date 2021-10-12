import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, //coming from env
  params: {
    folder: "Whatsapp-clone",
  },
});

export default cloudinaryStorage;
