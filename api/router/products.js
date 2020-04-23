const express = require("express");
const router=express.Router();
const Product =require("../model/product");
const mongoose= require("mongoose");
const multer= require("multer");

const checkAuth= require("../middleware/check-auth");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  })
  
const fifilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpeg')
    cb(null,true);
    else
    cb(null,false);                                       //changing this null to new Error creates and error 
}
//const upload=multer({storage:datastorage});//dest:"uploads/"});
const upload =multer({storage:storage,
    limits:{
    fileSize:1024*1024*10
    },
    fileFilter:fifilter
});

router.get('/',(req,res,next)=>
{
Product.find().select("name _id price productImage").exec()
.then(doc=>{
    const respon={
        count:doc.length,
        products:doc.map(doc=>{
            return {name:doc.name,
                    price:doc.price,
                    productImage:"http://localhost:3000/"+doc.productImage,
                    _id:doc._id,
                    requset:{
                        type:"GET",
                        url:"http://localhost:3000/products/"+doc._id
                    }
    }
        })
    }
    console.log(doc);
    if(doc){
    res.status(200).json(respon);
    }else
    res.status(404).json({value:"empty"});
}).catch(err=>{console.log(err);
         res.status(500).json({error:err});
});
});
//used for token sent in body
//router.post('/',upload.single('productImage'),checkAuth,(req,res,next)=>  //chech auth is after upload.single beacause upload .single parses the data in the form which is needed in check auth

router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>  //chech auth is after upload.single beacause upload .single parses the data in the form which is needed in check auth
{console.log('reqfile'); 
console.log(req.file); //file is created by multer
console.log(req.body);
const product = new Product({
    _id:mongoose.Types.ObjectId(),
    name:req.body.name,
    price:req.body.price,
   productImage:"http://localhost:3000/"+req.file.path.replace("\\","/")
});
product.save().then(result=>{
    console.log(result);
    res.status(200).json({message:"post works in .products",
    prod:product});  
}).catch(err=>{console.log(err);
    res.status(500).json({error:err
});});

});

router.get('/:prodId',(req,res,next)=>
{const id=req.params.prodId;
   Product.findById(id).exec()
   .then(doc=>{
       console.log(doc);
       if(doc)
       res.status(200).json(doc);
       else
       res.status(404).json({value:"no data for this id"});
   }).catch(err=>{console.log(err);
            res.status(500).json({error:err});
});
});

router.patch('/:prodId',checkAuth,(req,res,next)=>
{const id=req.params.prodId;
    const updateops={};
    for(const ops of req.body)
    {
updateops[ops.propName]=ops.value;
    }
    Product.update({_id:id},{$set:updateops}).exec()
    .then(doc=>{
        console.log(doc);
        res.status(200).json({message:"updated product ",json:doc});
    }).catch(err=>{console.log(err);
             res.status(500).json({error:err});
 });
});

router.delete('/:prodId',checkAuth,(req,res,next)=>
{const id=req.params.prodId;
        Product.remove({_id:id}).exec()
        .then(result=>{res.status(200).json({message:"deleted product ",
    output:result});})
        .catch(err=>{res.status(500).json({message:err});});
});

router.put('/',(req,res,next)=>
{const id=req.params.prodId;
        Product.remove({}).exec()
        .then(result=>{res.status(200).json({message:"deleted product ",
    output:result});})
        .catch(err=>{res.status(500).json({message:err});});
});
module.exports=router;
//.deleteMany({}, callback)