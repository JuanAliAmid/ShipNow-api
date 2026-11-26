import mongoose from "mongoose";

const generateIds = (quantity) =>
    Array.from({ length: quantity }, () => new mongoose.Types.ObjectId());

export default generateIds;