import mongoose from "mongoose";
import { PRODUCT_STATUS } from "../constants/constants.js";

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        status: {
            type:String,
            enum: [PRODUCT_STATUS.AVAILABLE, PRODUCT_STATUS.OUT_OF_STOCK],
            default: PRODUCT_STATUS.AVAILABLE
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model('Product', productSchema);