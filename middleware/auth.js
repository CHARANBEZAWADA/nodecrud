const jwt=require('jsonwebtoken')
const auth=(req,res,next)=>{
    const token=req.header('Authorization').replace('Bearer ','')||
    req.body.token ||
    req.cookies.token;
     console.log(token);
     if(!token){
        res.status(401).json("token is missing")
     }
     try {
        const decode=jwt.verify(token,process.env.SECRET_KEY)
        console.log(decode);
        
     } catch (error) {
        return res.status(403).send("invalid token")
     }

     return next();

}
module.exports=auth;