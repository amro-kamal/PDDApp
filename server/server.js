const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const config = require("./config/config").get(process.env.NODE_ENV);
const cors = require('cors');
const app = express();
const upload = require('./multer/uploadImage');
const HistoryItem = require('./models/HistoryItem');
const Disease = require('./models/Disease');
import MODEL_CODES from './AI/tf_models/allmodels';
import * as tf from '@tensorflow/tfjs-node';


import  startPrediction from './AI/classifier';
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE , { useNewUrlParser: true });


console.log(__dirname)
app.use('/uploads' , express.static(__dirname + '/uploads'));
app.use('/diseases' , express.static(__dirname + '/diseases'));
app.use(bodyParser.json());
app.use(cookieParser());


const loadModel = async (setModel , path )=>{
  try {
    // Load custom model
    tf.ENV.set('WEBGL_PACK' , false);
    setModel(await tf.loadLayersModel("file://" + __dirname + path));
    console.log('Custom model loaded! '+path)
  } 
  catch (err){
      console.log("loading failed :",err);
  }

}
//load grape model
let grape_model ;
const GRAPE_PATH = "/AI/tf_models/inception_model/model.json";
const GRAPE_IMAGE_SIZE = 140;
const setGrapeModel = async(model)=>{
  grape_model = model;
}
loadModel(setGrapeModel, GRAPE_PATH);
//load tomato model
let tomato_model ;
const TOMATO_PATH = "/AI/tf_models/inception_model/model.json";
const TOMATO_IMAGE_SIZE = 140;
const setTomatoModel = async(model)=>{
  tomato_model = model;
}
loadModel(setTomatoModel, TOMATO_PATH);
//load potato model
let potato_model ;
const POTATO_PATH = "/AI/tf_models/inception_model/model.json";
const POTATO_IMAGE_SIZE = 140;
const setPotatoModel = async(model)=>{
  potato_model = model;
}
loadModel(setPotatoModel, POTATO_PATH);

app.get("/api/disease", (req, res) => {
  let id = req.query.id;

  //model not created yet
  Disease.findOne({disease_id: id}, (err, doc) => {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});
app.post("/api/disease", (req, res) => {
  const disease = req.body;
  /*const disease = {
    disease_id: "gebr113",
    title: "Esca Black rot",
    category:"disease",
    hosts:"Grape",
    summary:"Grape black rot is a fungal disease caused by an ascomycetous fungus, Guignardia bidwellii, that attacks grape vines during hot and humid weather.  It can cause complete crop loss in warm, humid climates, but is virtually unknown in regions with arid summers. The name comes from the black fringe that borders growing brown patches on the leaves. The disease also attacks other parts of the plant,all green parts of the vine: the shoots, leaf and fruit stems, tendrils, and fruit.",
    symptoms:"Relatively small, brown circular lesions develop on infected leaves and within a few days tiny black spherical fruiting bodies (pycnidia) protrude from them. Elongated black lesions on the petiole may eventually girdle these organs, causing the affected leaves to wilt. Shoot infection results in large black elliptical lesions. These lesions may contribute to breakage of shoots by wind, or in severe cases, may girdle and kill young shoots altogether. This fungus bides its time. Most plants show very little signs of infection until its too late. They will look very healthy until fruit sets. Even flowering will be normal",
    treatment:"The use of chemical control is widely available for agricultural purposes. To apply chemical applications, look at the fungicide label for proper use. Be sure that the conditions are optimal to spray to avoid drift and inefficiencies of the fungicide due to application. Fungicide guidelines must be followed. There are a wide variety of chemicals that are available for both regular and organic growers. Commercially, application of fungicides may be costly. To cut down on costs, one must understand the life cycle of the pathogens. Different fungicides are more effective at certain infection stages.",
    imageUrl:"/diseases/black_rot.jpg"
  };*/
  Disease.create(disease, (err, doc) => {
    if (err) return res.status(400).send(err);
    res.send({
      success:true,
      disease: doc
    });
  });
});

app.get("/api/history", (req, res) => {
  let order = "desc"; //latest first

  // ORDER = asc || desc
  HistoryItem.find()
    .sort({ _id: order })
    .exec((err, doc) => {
      if (err) return res.status(400).send(err);
      res.send(doc);
    });
});

// POST //
app.post("/api/classify", upload.single('imageData'), async (req, res) => {
console.log(req.file)
  if(req.file){
    console.log('image was sent , inside image block');
      const pic = {
        imageName: req.file.filename,
        imageData: req.file.path
    };
    const path = req.file.path;

    let predictionResult;
    //select model then classify image
    switch (req.body.model) {
      case MODEL_CODES.TOMATO:
        predictionResult = await startPrediction( tomato_model, path , TOMATO_IMAGE_SIZE);
        break;
      case MODEL_CODES.POTATO:
        predictionResult = await startPrediction(potato_model, path , POTATO_IMAGE_SIZE);
        break;
      case MODEL_CODES.GRAPE:
        predictionResult = await startPrediction(grape_model,path , GRAPE_IMAGE_SIZE);
        break;
    
      default:
        break;
    }

    console.log('prediction reuslt', predictionResult);



    res.json({
        result: predictionResult,
        imagePath: path ,   //important 
        relativePath: "uploads/"+req.file.filename // relative path to fetch local images
    });
    
    /*const data = {
      title : '',//from classification 
      data:  Date.now(),
      disease_id: '',//from classification 

    }


    //enter data in history collection
    HistoryItem.create({...data , pic} ,(err , doc)=>{
          if(err) return res.status(400).send({success:false, err});
          console.log('item stored successfully', {
              success: true,
              history_item: doc
          })
      });*/
  
  }else{
      console.log('no image  sent , inside no image block');
      res.status(400).send({
        success: false,
        err: 'no image sent/file not valid'
    })

  }

  
});



const port = process.env.PORT || 4000;
console.log('running on port' ,port);

app.listen(port, () => {
  console.log(`SERVER RUNNNING`);
});
