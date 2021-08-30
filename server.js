const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
// const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const config = require("./server/config/config").get(process.env.NODE_ENV);
const cors = require("cors");
const app = express();
const upload = require("./server/multer/uploadImage");
const mongouploadController = require("./server/controllers/upload");
const uploadController = require("./server/controllers/uploadToServer");

const HistoryItem = require("./server/models/HistoryItem");
const Disease = require("./server/models/Disease");
const User = require("./server/models/user");
const Image = require("./server/models/image");

var ObjectId = require("mongodb").ObjectID;

// import * as tf from '@tensorflow/tfjs-node';
const dotenv = require("dotenv");
// const { uploadFile } = require("./server/controllers/upload");
dotenv.config();

const idToName = require("./server/AI/labels/labels").idToName;
const startPrediction = require("./server/AI/classifier").startPrediction;
app.use(cors());

//////////////////////////
// mongoose.Promise = global.Promise;
// mongoose.connect(config.DATABASE, { useNewUrlParser: true }).then(() => {
//   console.log("connected to DataBase ,PlantsApp");
// }); // mongoose.connect('mongodb://localhost:27017/PlantsApp');

///////////////////////////
const DBuri = process.env.PLANTAPP_MONGO_URI;
// "mongodb+srv://amro:1234@plant-app-database-clus.gokqu.mongodb.net/plant-app-database?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
console.log("process.env", process.env.PLANTAPP_MONGO_URI);
mongoose
  .connect(DBuri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to DataBase ,plant-app-database");
  })
  .catch((err) => console.log("mongoose ,catch database error", err)); // mongoose.connect('mongodb://localhost:27017/PlantsApp');

/////////////////////////////////////////////

console.log(__dirname);
app.use("/server/uploads", express.static(__dirname + "/server/uploads"));
app.use("/server/diseases", express.static(__dirname + "/server/diseases"));
app.use(bodyParser.json());
// app.use(cookieParser());

app.get("/api/alldisease", (req, res) => {
  Disease.find(function (err, diseases) {
    if (err) {
      console.error("error getting the diseases", err);
      return res.status(400).send(err);
    }
    console.log("disease : ", diseases);
    res.send(diseases);
  });
});

app.get("/api/disease", (req, res) => {
  let id = req.query.id;
  console.log("looking for ", id);
  //model not created yet
  Disease.findOne({ disease_id: id }, (err, doc) => {
    if (err) {
      console.log("Error sending disease details");

      return res.status(400).send(err);
    }
    if (doc == null) console.log("no disease with this id");
    else console.log("sending disease details: ", doc);
    res.send(doc);
  });
});
app.post("/api/disease", (req, res) => {
  const disease = req.body;

  console.log("adding disease ", disease);
  Disease.create(disease, (err, doc) => {
    if (err) {
      return res.status(400).send(err);
      console.log("mongo error");
    }
    res.send({
      success: true,
      disease: doc,
    });
  });
});

app.get("/api/allusers", (req, res) => {
  console.log("Get all users data");
  User.find(function (err, users) {
    if (err) {
      console.error("error getting the diseases", err);
      return res.status(400).send(err);
    }
    console.log("users : ", users);
    res.send(users);
  });
});

app.post("/api/history", async (req, res) => {
  console.log("historyyyyyyyyyyyyyyyyyyyyyyyyyyy");

  const user_email = req.body.email;

  console.log("history for", user_email);

  User.findOne({ email: user_email }, (error, user) => {
    // console.log("user profile", user);

    const history = user.history;
    console.log("user history ", history);

    (async () => {

      console.log("history mongoooooooooooooooooooo");

      var i;
      try {
        for (i = 0; i < history.length; i++) {
          console.log("i= ", i);
          const image = await Image.findOne({ filename: history[i].pic });
          // console.log(`res => ${JSON.stringify(res)}`);
          console.log("findone i=", i);
          console.log("images.find ", image);
          // imgcopy = { ...image };
          // imgcopy.img.buffer = imgcopy.img.buffer.toString;
          history[i].pic = image;
        }

        console.log("modified history");
        return res.send({ history: history });
      } finally {
        // client.close();
      }
    })().catch((err) => console.error(err));
  });

});

app.get("/api/history", (req, res) => {
  const user_email = req.body.user_email;

  console.log("history for", user_email);

  const user = User.findOne({ email: user_email });
  const history = user.history;
  console.log("user history ", history);
  history.forEach((history_item) => {
    var filename = history_item.pic;
    // open the mongodb connection with the connection
    // string stored in the variable called url.
    MongoClient.connect(
      DBuri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (err, db) {
        var dbo = db.db("plant-app-database");
        // perform a mongodb search and return only one result.
        // convert the variabvle called filename into a valid
        // objectId.
        dbo
          .collection("images")
          .findOne({ filename: filename }, function (err, result) {
            history_item.pic = result;
          });
      }
    );
  });

  res.json({ history: history });

});

// POST //
// const upload = require("./server/multer/uploadImage");
const uploadFile = require("./server/multer/uploadImageToDB");


MongoClient = require("mongodb").MongoClient;
fs = require("fs-extra");
app.post("/api/classify", upload.single("imageData"), async (req, res) => {
  //save the image to the db
  MongoClient.connect(
    DBuri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      if (err) console.log("DB connection error");
      // read the img file from tmp in-memory location
      console.log("mongoooooooooooooooooooooooo");
      var newImg = fs.readFileSync(req.file.path);
      // encode the file as a base64 string.
      var encImg = newImg.toString("base64");
      // define your new document
      var newItem = {
        filename: req.file.filename,
        description: req.body.description,
        contentType: req.file.mimetype,
        size: req.file.size,
        img: Buffer(encImg, "base64"),
      };
      var dbo = db.db("plant-app-database");
      dbo.collection("images").insertOne(newItem, function (err, result) {
        if (err) {
          console.log("image uploading error", err);
        } else {
          console.log("image uploaded to db");
        }

      });
    }
  );

  console.log("start classifying req=", req.file);
  if (req.file) {
    console.log(
      "image was sent , inside image block ,filename=",
      req.file.filename
    );

    const pic = req.file.filename;
    const path = req.file.path;

    let predictionResult = await startPrediction(path).catch((e) =>
      console.log("startprediction catch", e)
    );
    console.log("prediction reuslt", predictionResult);

    const Result = {
      success: true,
      result: predictionResult,
      imagePath: path, //important
      relativePath: "uploads/" + req.file.filename, // relative path to fetch local images
    };

    res.json(Result);
    console.log("res was sent", Result);

    const data = {
      title: predictionResult.diseaseId, //from classification
      date: Date.now(),
      disease_id: predictionResult.diseaseId, //from classification
      confidence: predictionResult.confidence, //from classification
      pic,
    };

    const user_email = req.body.user_email;
    console.log("user_email ", user_email);
    const user = await User.findOne({ email: user_email });
    const history = user.history;
    // console.log("user history ", history);
    if (history.length < 10) {
      history_update = { history: [...history, data] };
    } else {
      history.shift();
      history.push(data);
      history_update = { history: history };
    }
    await user.updateOne(history_update, () => {
      console.log("history updated");
    });
  } else {
    console.log("no image  sent , inside no image block");
    res.status(400).send({
      success: false,
      err: "no image sent/file not valid",
    });
  }
});



app.get("/api/image", function (req, res) {
  console.log("get image ", req.body.filename);
  // assign the URL parameter to a variable
  var filename = req.body.filename;
  // open the mongodb connection with the connection
  // string stored in the variable called url.
  MongoClient.connect(
    DBuri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      var dbo = db.db("plant-app-database");
      // perform a mongodb search and return only one result.
      // convert the variabvle called filename into a valid
      // objectId.
      dbo
        .collection("images")
        .findOne({ filename: filename }, function (err, results) {
          // set the http response header so the browser knows this
          // is an 'image/jpeg' or 'image/png'
          res.setHeader("content-type", results.contentType);
          // send only the base64 string stored in the img object
          // buffer element
          res.send(results.img.buffer);
        });
    }
  );
});

app.post("/api/register", (req, res) => {
  // const _id = mongoose.Types.ObjectId;
  const user = req.body;
  const date = new Date();
  const newUser = { ...user, date };
  console.log(newUser);

  User.find({ email: user.email })
    .then((doc) => {
      //if email already registered
      if (doc.length > 0) {
        console.log("This email is already registered", doc);
        res.status(404).json({ message: "This email is already registered" });
      } else {
        createnewuser(user, date);

      }
    })
    .catch((e) => {
      console.log("register ,catch ", e);
      res.status(500).json({ message: "register ,catch ,error", error: e });
    });

  function createnewuser(user, date) {
    bcrypt.hash(user.password, 10, (error, password) => {
      if (error) {
        console.log("BCRYPT ERROR");
        res.status(500).json({ error: "error" });
      } else {
        name = user.name;
        email = user.email;
        history = [];
        const new_user = { name, email, password, date, history };
        User.create(new_user, (err, doc) => {
          if (err)
            return res
              .status(400)
              .json({ message: "error in creating the user", error: err });
          res.status(200).json({
            message: "success",
            ...doc,
          });
          console.log("user added to db");
        });
      }
    });
  }
});

app.post("/api/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body);
  //name
  User.find({ email: email })
    .then((doc) => {
      if (doc.length > 0) {
        console.log("email found");
        //password
        bcrypt.compare(password, doc[0].password, (err, result) => {
          if (err) {
            console.log("log in faild");
            return res.status(401).json("log in falid");
          }
          if (result) {
            console.log("password found");
            console.log("log in success ,user profile", doc);
            res.status(200).json({ message: "success", ...doc });
          } else {
            console.log("invalid password");
            res.status(404).json({ message: "Invalid password" });
          }
        });
      } else {
        console.log("invalid email");
        res.status(404).json({ message: "There are no user with this email" });
      }
    })
    .catch((e) => {
      console.log("login error", e);
      res.status(500).json({ message: "error", error: e });
    });
});

function findUser(user) {
  User.find({ email: user.email })
    .then((doc) => {
      if (doc.length > 0) {
        return doc[0];
      }
    })
    .catch((e) => {
      console.log("login error", e);
      res.status(500).json({ message: "error", error: e });
    });
}

const port = process.env.PORT || 4000;
console.log("running on port", port);

app.listen(port, () => {
  console.log(`SERVER RUNNNING`);
});

const getDate = () => {
  const date = new Date();
  const curDay = date.getDay();
  const curMonth = date.getMonth();
  const curYear = date.getFullYear();
  const curHour =
    date.getHours() > 12
      ? date.getHours() - 12
      : date.getHours() < 10
      ? "0" + date.getHours()
      : date.getHours();
  const curMinute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const curMeridiem = date.getHours() > 12 ? "PM" : "AM";

  const today = `${curYear}-${curMonth}-${curDay} ${curHour}:${curMinute}${curMeridiem}`;
  return today;
};


