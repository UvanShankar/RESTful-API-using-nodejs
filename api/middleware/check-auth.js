const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        console.log("token : "+token);
        const decode=jwt.verify(token,"secret");
        //  const decode=jwt.verify(req.body.token,"secret");// used for token sent in body
        console.log("decode :"+decode);
        req.userData=decode;
        next();
    }
    catch(error){
return res.status(500).json({errormess:error,
message:"Auth required jwt",token:req.body});
    }

};