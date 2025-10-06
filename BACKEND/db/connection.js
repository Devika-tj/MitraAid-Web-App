const mongoose=require('mongoose')
require('dotenv').config()
const Admin=require('../utils/admin')

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log("Mongodb is connected....")

         await Admin();

    }catch(err){
        console.log(err)
        process.exit(1)
    }
};
module.exports=connectDB;