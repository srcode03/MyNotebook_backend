const mongoose=require('mongoose')
mongoose.set('strictQuery', true)
const mongoURI="mongodb://127.0.0.1:27017"
const connecttomongoose=async()=>{
    mongoose.connect(mongoURI,()=>{
        console.log('Connect to mongo sucessfully');
        
    })
}
module.exports=connecttomongoose