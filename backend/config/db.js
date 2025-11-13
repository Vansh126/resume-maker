import mongoose from "mongoose";

const connectdb = async () => {
    try {
        console.log("MONGO_URI from env:", process.env.MONGO_URI); // Debug
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectdb;
