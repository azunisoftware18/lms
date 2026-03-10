import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs";

const MAX_UPLOAD_SIZE_MB = Number(process.env.MAX_UPLOAD_SIZE_MB || 8);
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
  ".avif",
  ".pdf",
]);

const uploadDir = path.resolve(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
 filename: function (req, file, cb) {
  const shortId = randomUUID().slice(0, 8); // only 8 chars
  const ext = path.extname(file.originalname);
  cb(null, `${file.fieldname}-${shortId}${ext}`);
},
  
});

const fileFilter = function (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const extension = path.extname(file.originalname).toLowerCase();
  const validExtension = ALLOWED_EXTENSIONS.has(extension);
  const validMimeType = ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase());

  if (validExtension && validMimeType) {
    return cb(null, true);
  }
  cb(
    new Error(
      "Invalid file type. Only PDF, JPEG, JPG, PNG, WEBP, and AVIF files are allowed.",
    ),
  );
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
  fileFilter,
});

export default upload;
