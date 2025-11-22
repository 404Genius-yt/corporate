import mongoose from "mongoose";

let isConnected: Boolean = false

export async function connectToDatabase () {
  mongoose.set("strictQuery", true)
  if(!process.env.MONGO_URI){
    return console.log("MONGO URI not found")
  }
  if(isConnected){
    return console.log("Database already connected")
  }
  try{
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "corporate"
    })
    isConnected = true
    console.log("Database connected successfully")
  }catch(err){
    console.error("Database connection error:", err)
    throw err
  }
}