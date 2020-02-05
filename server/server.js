const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const config = require("./config/config").get(process.env.NODE_ENV);
const cors = require('cors');
const app = express();
const upload = require('./multer/uploadImage');
const HistoryItem = require('./models/HistoryItem');
import  startPrediction from './AI/classifier';
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE , { useNewUrlParser: true });


console.log(__dirname)
app.use('/uploads' , express.static(__dirname + '/uploads'));
app.use(bodyParser.json());
app.use(cookieParser());



app.get("/api/getDisease", (req, res) => {
  let id = req.query.id;

  //model not created yet
  Disease.findById(id, (err, doc) => {
    if (err) return res.status(400).send(err);
    res.send(doc);
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
    //classify image
    let predictionResult = await startPrediction(path);
    console.log('prediction reuslt', predictionResult);
    res.json({
        result: predictionResult
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
