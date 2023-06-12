const mongoose=require('mongoose')
const {Schema}=mongoose
const NotesSchema=new Schema({
    //here we have to add field so that we know that the notes are his
    //basically linking the user with the notes
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:'blank',
    },
    date:{
        type:Date,
        default:Date.now
        
    }
})
const Note=mongoose.model('notes',NotesSchema)
module.exports=Note