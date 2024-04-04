const mongoose=require('mongoose')
const {MONGO_URL}=process.env

exports.connect=()=>{
    mongoose.connect(MONGO_URL,{
    })
    .then (
        console.log("db connected succesfuully")
    )
    .catch(error=>{
        console.log("DB connection failed");
        console.log(error);
        process.exit(1);
    })
}
