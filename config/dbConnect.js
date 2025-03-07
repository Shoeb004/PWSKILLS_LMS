import mongoose from "mongoose";

const dbConnection = async ()=>{
try{
const conn = await mongoose.connect(process.env.MONGO_URI)
console.log(`Database is connected ${conn.connection.host}`)
}catch(error){
    console.log(error.message)
    process.exit(1)
}
}

export default dbConnection