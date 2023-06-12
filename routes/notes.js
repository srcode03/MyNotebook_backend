//Now after after the authentication part is complete we are going to set up endpoints for fetching the notes of the user
const express=require('express')
const Note=require('../models/Note')
const fetchuser=require('../middleware/fetchuser')
const router=express.Router()
const {body,validationResult}=require('express-validator')
//ROUTE 1:the endpoint fetchallnotes will fetch all the notes of the user
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    //the notes will find all the notes corresponding to to the given id
    const notes=await Note.find({user:req.user.id})
    res.json(notes)
})
//ROUTE 2:to add a new note
router.post('/addnote',fetchuser,[
    body('title','Pls enter a title of atleast 3 characters').isLength({min:3}),
    body('description','Pls enter a description of atleast 5 characters').isLength({min:5})
],async(req,res)=>{
    //we are destructuring the title,description,tag from the req.body
    const {title,description,tag}=req.body
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({error:errors.array()})
    }
    //here we are creating a new note using the destructures elements
    //note that we are getting the id of the user using middleware fetchuser and acessing it using the req.user.id
    const note=new Note({
        title,description,tag,user:req.user.id
     })
     //we will wait till the note gets saved before moving on to the next thing to be done
    const savenote=await note.save()
    //sending the note back
    res.json(savenote)
})

//  ROUTE 3:UPDATE AN EXISTING NOTE
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    //first we have to destructure the title,description,tag from the req.body
    const {title,description,tag}=req.body;
    //now we will create a new note where we will insert all the fields that are updated by the user
    const newnote={}
    //if the title has been changed then insert that tile in the newnote
    if(title)
    {
        newnote.title=title
    }
    //similarily for description
    if(description)
    {
        newnote.description=description
    }
    //similarily for tag
    if(tag)
    {
        newnote.tag=tag
    }
    //now we will see which note has been requested by the user to be updated
    let note=await Note.findById(req.params.id)
    //if the note does not exist then we will return error to him
    if(!note)
    {
        return res.status(404).send("Sorry such a note does not exist")
    }
    //now we will verify if the person updating the note is the user himself or some other person
    //for this note.user.toString() function returns us the current id of the note he wants to update
    //req.user.id gives is the id of the note which is present in the database
    //this is being done so that user updates his own notes and not of others
    if(note.user.toString()!==req.user.id)
    {
        return res.status(401).send("Not allowed")
    }
    //now after the verification process is done we make use of findbyIdandUpdate() function to update the note
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
    res.json(note)

})

//ROUTE 4:DELETION OF A EXISTING NOTE
//Performing this action is similar to the updating action 
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    let note=await Note.findById(req.params.id)
    if(!note)
    {
        return res.status(400).send("Sorry this note does not exist")
    }
    if(note.user.toString()!==req.user.id)
    {
        return res.status(400).send("Unauthorised access")
    }
    note=await Note.findByIdAndDelete(req.params.id)
    res.json({"Sucess":"Your note has been deleted sucessfully","note":note})

})
module.exports=router