import mongoose from "mongoose";

const connectedDataBase = () => {
    return mongoose.connection.readyState === 1;
}

export default connectedDataBase;