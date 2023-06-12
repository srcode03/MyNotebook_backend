//first we acquire the express module
const express=require('express')
//now we acquire the userschema we have sent in the User.js using the below statement
const User = require('../models/User')
//we extract body and validationResult function from the package express-validator
const {body,validationResult}=require('express-validator')
//wNow we make use of the express router
const router=express.Router()
//bcrypt is a package used for adding hashing,salt and other protective features to the password
const bcrypt=require('bcryptjs')
//jwt facilitates secure connection between the user and the site which is using 
//whenever we loginusing  it gives us a jwt token
//next time whenever we try to login it mathces the jwt token and accordingly facilitates the access to the website
//ALSO WE CAN FIND OUT IF THE USER HAS MADE SOME CHANGES TO THE JWT TOKEN
const jwt=require('jsonwebtoken')
//JWT_SECRET IS A SECRET STRING WHICH IS TO BE KEPT HIDDEN
const JWT_SECRET="shaunakisagoodboy"
const fetchuser=require('../middleware/fetchuser')

//ROUTE 1:TO CREATE A NEW USER
router.post('/createuser',[
    //we check if the name entered by the user is atleast 3 characters long using .isLength() method
    body('name','Enter a valid name').isLength({min:3}),
    //we check if the email entered by the user satisfies the property of being an email using isEmail() method
    body('email','Enter a valid email').isEmail(),
    body('password','Enter a valid password').isLength({min:3})
],async(req,res)=>{
    let success=false
    //we store if any errors present using the vaidationResult() function in errors variable
    const errors=validationResult(req);
    //if the errors array is not empty it means an error is present 
    if(!errors.isEmpty())
    {
        success=false
        return res.status(400).json({success,errors:errors.array()})
    }
    // we find if a user already already exists with the above credentials and if he does then we send a error message
    let user=await User.findOne({email:req.body.email})
    if(user)
    {
        success=false;
        
        return res.status(400).json({success,error:"Sorry a user with the same email already exists"})
    }
    //here we have created a new variable succpass which will take in the body.password and add hash and salt to it
    //so that the variable will be stored as a hash in the database and not as a plain text in it
    // in this course we will be using jsonwebtoken authentication to verify each and every user
    //it is a npm package
    const salt=await bcrypt.genSalt(10)
    var succpass=await bcrypt.hash(req.body.password,salt);
    //after verification that the user does not exist we move forward to create a new user
    user=await User.create({
        name:req.body.name,
        password:succpass,
        email:req.body.email
    })
    //sample data is being used ex if the user has entered then a token is being given to him
    const data={
        user:{
            id:user.id
        }
    }
    //jwtdata is being used to generate the data
    success=true
    const authtoken=await jwt.sign(data,JWT_SECRET);
    
    //res.json(authtoken) prints the auth token
    res.json({success,authtoken})
})
    //above we had only created a endpoint for user to enter in the details 
    //now we will be creating a endpoint so that user can enter in the email and password and enter in the website
    
    //ROUTE 2:TO AUTHENTICATE A USER .NO LOGIN REQUIRED
    router.post('/login',[
        body('email','Enter a valid email address').isEmail(),
        body('password','Password cannot be blank').exists(),
    ],async(req,res)=>{
        let success=false
        const errors=validationResult(req)
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()})
        }
        //now we are destructuring the password and email from the req.body
       const {email,password}=req.body
        //now we are going to cpmpare if the email mathces with any entry in the database
        const user=await User.findOne({email})
        if(!user)
        {
            success=false
            return res.status(400).json({success,errors:"Sorry pls login with the correct credentials"})
        }
        //now we are going to compare the password that the user has sent with the password present in the database
        //remember to add await wherever necessary
        const checkpass=await bcrypt.compare(password,user.password);
        //the above function returns a promise which may be true or false
        if(!checkpass)
        {
            success=false
            return res.status(400).json({success,error:"Pls try to login with the correct password"})
        }
        //the statement sends a error if the passwords do not match
        const data={
            user:{
                id:user.id
            }
        }
        //the above statement stores id of the user in the variavle data
        const authtoken=await jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authtoken})
        //if the user has been verified then the authtoken is sent by which we come to know that user is a valid use
    })

    //ROUTE 3:TO GET THE DETAILS OF THE LOGGEDIN USER.LOGIN REQUIRED
    //fetchuser is a middleware which will bring me a user so that i get the requires details from it
    router.post('/getuser',fetchuser,async(req,res)=>{
        let userid=req.user.id
        //we find the user by the id and select everything except the password
        let user=await User.findById(userid).select("-password")
        //we send in the user details
        res.send(user)

    })



module.exports=router

