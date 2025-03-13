import mongoose from "mongoose";
const connectDB=async()=>{
    try {
 await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, // Enable TLS
    tlsAllowInvalidCertificates: true, // (Try if facing SSL issues)
    serverSelectionTimeoutMS: 5000, // Increase timeout
 });
 console.log("Mongoose Connected") ;    
    } catch (error) {
    console.log("Error while connecting database",error)    
    }
}
export default connectDB;