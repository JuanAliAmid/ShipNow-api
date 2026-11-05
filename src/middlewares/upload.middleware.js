import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ERROR_CODES from '../errors/error.codes.js';
import { createError } from '../utils/apiResponse.js';
import { allowedMimeTypes } from '../constants/constants.js';


const fileFilter = (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(createError(ERROR_CODES.INVALID_QUANTITY));
    };
};

const limits = { fileSize: 5 * 1024 * 1024 };

const createFolder = (folder) => {
    const route = `uploads/${folder}`;
    const storage = multer.diskStorage({

        destination: (_req, _file, cb) => {
            if (!fs.existsSync(route)) {
                fs.mkdirSync(route, { recursive: true });
            }
            cb(null, route);
        },
        filename: (_req, file, cb) => {
            const extension = path.extname(file.originalname);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`
            cb(null, fileName);
        }

    });
    return multer({ storage, fileFilter, limits });
};

export const uploaders = {
    documents: createFolder('documents'),
    receipts: createFolder('receipts'),
    licenses: createFolder('licenses')
};