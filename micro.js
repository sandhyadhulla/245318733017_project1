const express=require('express');
const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');

const MongoClient = require('mongodb').MongoClient;

const response=require('express');

//DB DETAILS
const url='mongodb://127.0.0.1:27017';
const dbname="hospitalmanagement";
let db

//CONNECTING TO DB
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`connected database: ${url}`);
    console.log(`Database:${dbname}`);
});

//FETCH HOSPITALS FROM DB
app.get('/hospitals', middleware.checkToken, (req,res) => {
    console.log("getting things ready");
    const data=db.collection("hospitaldetails").find().toArray()
    .then(result => res.json(result));
});

//FETCH VENTILATORS FROM DB
app.get('/ventilators', middleware.checkToken , (req,res)=>{
    console.log("getting things ready");
    const data=db.collection("ventilatordetails").find().toArray()
    .then(result=>(res.json(result)));
});

//SEARCH VENTILATOR BY STATUS
app.post('/searchventbystatus', middleware.checkToken , (req,res) => {
    const status = req.query.status;
    console.log(status);
    const ventilatordetails=db.collection('ventilatordetails')
    .find({"status":status}).toArray().then(result=>res.json(result));
});

//SEARCH VENTILATOR BY NAME

app.post('/searchventbyname',  middleware.checkToken , (req,res) => {
    const name=req.body.name;
    console.log(name);
    const ventilatordetails=db.collection('ventilatordetails')
    .find({'name':new RegExp(name, 'i')}).toArray().then(result=>res.json(result));
});

//SEARCH HOSPITAL BY NAME
app.post('/searchhospitalbyname', middleware.checkToken , (req,res) => {
    const name=req.query.name;
    console.log(name);
    const hospitaldetails=db.collection('hospitaldetails')
    .find({'name':new RegExp(name, 'i')}).toArray().then(result=>res.json(result));
});

//ADD VENTILATOR
app.post('/addvent', middleware.checkToken ,(req,res)=>{
    const hId=req.query.hId;
    const ventilatorId=req.query.ventilatorId;
    const status=req.query.status;
    const name=req.query.name;
    console.log("adding ventilator, please wait a moment");
    const item={"hId":hId, "ventilatorId":ventilatorId, "status":status, "name":name};
    db.collection("ventilatordetails").insertOne(item, function(err, result){
        res.json("inserted successfully");
    });
});

//UPDATE VENTILATOR BY VENTILATOR ID
app.put('/updateventilatorbyid',  middleware.checkToken ,(req,res) => {
    const ventilatorId= {ventilatorId: req.query.ventilatorId};
    console.log(ventilatorId);
    const newvalues={$set: {status:req.query.status}};
    console.log("updating ventilator details, please wait a moment");
    db.collection("ventilatordetails").updateOne(ventilatorId, newvalues, function(err, result){
        res.json('updated one document');
        if(err) throw err;
    });
});

//DELETE VENTILATOR BY VENTILATOR ID
app.delete('/deleteventbyid', middleware.checkToken , (req,res) => {
    const ventilatorId=req.query.ventilatorId;
    console.log(ventilatorId);
    const temp={"ventilatorId":ventilatorId};
    db.collection("ventilatordetails").deleteOne(temp, function(err,obj){
        if(err) throw err;
        res.json("deleted one element");
    });
});



app.listen(3000,(req,res)=>{
    console.log("working well");
});