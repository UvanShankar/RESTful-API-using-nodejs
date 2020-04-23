const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const mongoose= require("mongoose")

const productRoutes=require("./api/router/products");
const orderRoutes=require("./api/router/order");
const userRoutes=require("./api/router/user");

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true
  })
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));
mongoose.Promise=global.Promise;

//const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://node-rest-shop:<uvanshankar>@node-rest-shop-vtsef.mongodb.net/test?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true });
//client.connect(err => {
 // const collection = client.db("test").collection("devices");
 // // perform actions on the collection object
 // client.close();
//});


  const app=express();

app.use(morgan("dev"));

app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","*");
    if(req.method==="OPTIONS"){
            res.header("Access-Control-Allow-Methods","PUT,POST,DETELE,PATCH,GET");
            return res.status(200).json({});

    }
    next();
});

app.use('/products',productRoutes);
app.use('/order',orderRoutes);
app.use('/user',userRoutes);

app.use((req,res,next)=>
{
    const error=new Error("Not found");
    error.status=404;
    next(error);
    
});

app.use((err,req,res,next)=>
{
 res.status(err.status||500);
 res.json({
     error:{
     message:err.message
 }});   
});

module.exports=app;
