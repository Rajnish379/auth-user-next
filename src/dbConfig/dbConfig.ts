import mongoose from "mongoose";

export async function connect() {
    try {
        // The ! symbol after the env here is to ensure to typescript that don't worry, this variable will always be available in the env
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. '+err);
            process.exit();
        })
    } catch(error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}