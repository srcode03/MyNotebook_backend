const jwt=require('jsonwebtoken')
const JWT_SECRET="shaunakisagoodboy"
//function is a function which will provide us with the user
const fetchuser=(req,res,next)=>{
    //we receive the token from the req.header 
    const token=req.header('auth-token')
    //if the token is not found then we send a access denied request
    if(!token)
    {
        return res.status(401).send({error:"pls enter the correct token"})
    }
    //now if the token is sent then we verify it with the JWT_SECRET to match if it is the same user
    try {
        const data=jwt.verify(token,JWT_SECRET)
        req.user=data.user
    } catch (err) {
        return res.status(401).send({error:"pls enter the correct token"})
    }
    //the function next() ensures that we move to the async await part of the function
    next()
}
module.exports=fetchuser