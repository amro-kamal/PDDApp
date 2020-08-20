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
import * as tf from '@tensorflow/tfjs-node';

import {idToName} from './AI/labels/labels'
import  startPrediction from './AI/classifier';
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE , { useNewUrlParser: true });


console.log(__dirname)
app.use('/uploads' , express.static(__dirname + '/uploads'));
app.use('/diseases' , express.static(__dirname + '/diseases'));
app.use(bodyParser.json());
app.use(cookieParser());



app.get("/api/disease", (req, res) => {
  let id = req.query.id;

  //model not created yet
  Disease.findOne({diseaseId: id}, (err, doc) => {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});
app.post("/api/disease", (req, res) => {
  const disease = req.body;
  /*const disease = {
    diseaseId: "gebr113",
    title: "Esca Black rot",
    category:"disease",
    plant:'Grape',
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

    let predictionResult = await startPrediction(path);
    console.log('prediction reuslt', predictionResult);

    res.json({
        result: predictionResult,
        imagePath: path ,   //important 
        relativePath: "uploads/"+req.file.filename // relative path to fetch local images
    });
    
    const {diseaseId, confidence} = predictionResult
    const hitem = {
      title : idToName[diseaseId],//from classification 
      data:  getDate(),
      diseaseId,//from classification 
      confidence,
      pic
    };
    //enter data in history collection
   /* HistoryItem.create(hitem ,(err , doc)=>{
          if(err) return console.log('failed saving history item');
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


const getDate = ()=>{
  const date = new Date();
  const curDay = date.getDay();
  const curMonth = date.getMonth();
  const curYear = date.getFullYear();
  const curHour = date.getHours() > 12 ? date.getHours() - 12 : (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
  const curMinute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const curMeridiem = date.getHours() > 12 ? "PM" : "AM";
  
  const today=  `${curYear}-${curMonth}-${curDay} ${curHour}:${curMinute}${curMeridiem}`;
  return today;
}