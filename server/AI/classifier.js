// import * as tf from "@tensorflow/tfjs-node";
const tf = require("@tensorflow/tfjs-node");

// import { IMAGENET_CLASSES } from "./labels/labels";
const IMAGENET_CLASSES = require("./labels/labels");
const fs = require("fs");

const CUSTOM_MODEL_PATH = "/tf_models/mobilenet/model.json";

const PLANTS_CLASSES = require("./labels/labels").PLANTS_CLASSES;

const TOPK_PREDICTIONS = 1;
const IMAGE_SIZE = 224;
let model;

const startPrediction = async (image_path) => {
  try {
    model = await tf.loadLayersModel("file://" + __dirname + CUSTOM_MODEL_PATH);
    const img = readImage(image_path);
    return predict(model, img);
  } catch (err) {
    console.log("Predecting Error", err);
    const fake = {
      result: { diseaseId: "Fake result", confidence: 0.9998493194580078 },
    };
    return fake;
  }
};

const readImage = (path) => {
  const buf = fs.readFileSync(path);
  return buf;
};

/**
 * Given an image element, makes a prediction through mobilenet returning the
 * probabilities of the top K classes.
 */
async function predict(tfmodel, data) {
  console.log("Predicting...");
  const logits = tf.tidy(() => {
    // returns a Tensor from an image data.
    const img = tf.node.decodeImage(data);
    const offset = tf.scalar(127.5);
    // Normalize the image from [0, 255] to [-1, 1].
    const normalized = img.sub(offset).div(offset);

    // Reshape to a single-element batch so we can pass it to predict.
    // const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
    let resized = normalized;
    if (img.shape[0] !== IMAGE_SIZE || img.shape[1] !== IMAGE_SIZE) {
      const alignCorners = true;
      resized = tf.image.resizeBilinear(
        normalized,
        [IMAGE_SIZE, IMAGE_SIZE],
        alignCorners
      );
    } //end if

    const batched = resized.reshape([-1, IMAGE_SIZE, IMAGE_SIZE, 3]);
    // Make a prediction through mobilenet.
    return tfmodel.predict(batched);
  });

  //return logits;
  // Convert logits to probabilities and class names.
  const predictions = await getTopKClasses(logits, TOPK_PREDICTIONS);
  //return  getDisease(predictions[0]);
  return predictions[0];
}

/**
 * Computes the probabilities of the topK classes given logits by computing
 * softmax to get probabilities and then sorting the probabilities.
 * @param logits Tensor representing the logits from MobileNet.
 * @param topK The number of top predictions to show.
 */
async function getTopKClasses(logits, topK) {
  const values = await logits.data();

  const valuesAndIndices = [];
  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({ value: values[i], index: i });
  }
  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });
  const topkValues = new Float32Array(topK);
  const topkIndices = new Int32Array(topK);
  for (let i = 0; i < topK; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  let IMAGNET_CLASSES = PLANTS_CLASSES;

  const topClassesAndProbs = [];
  let imageClass;
  for (let i = 0; i < topkIndices.length; i++) {
    if (!(topkIndices[i] in IMAGNET_CLASSES)) {
      imageClass =
        IMAGNET_CLASSES[Math.floor(Math.random() * (100 - 0 + 1) + 0)];
    } else {
      imageClass = IMAGNET_CLASSES[topkIndices[i]];
    }
    topClassesAndProbs.push({
      diseaseId: imageClass,
      confidence: topkValues[i],
    });
  }
  return topClassesAndProbs;
}
/*
function getDisease(res){
    const {className , probability} = res;
    let diseaseId = "gbr112";
    switch(className){
        case 'Tomato___Bacterial_spot':
            diseaseId = "gbr112";
            break;
        case "Tomato___Early_blight":
            diseaseId = "";
            break;
        case "Tomato___healthy":
            diseaseId = "";
            break;
        case "Tomato___Late_blight":
            diseaseId = "";
            break;      
        case "Tomato___Leaf_Mold":
            diseaseId = "";
            break;
                
        case "Tomato___Septoria_leaf_spot":
            diseaseId = "";
            break;
        case "Tomato___Spider_mites Two-spotted_spider_mite":
            diseaseId = "";
            break;
        
        case "Tomato___Target_Spot":
            diseaseId = "";
            break;
    
        default:
            break;
    }

    return {
        diseaseId,
        confidence: probability
    }
}
*/
const loadModel = async (setModel, path) => {
  try {
    // Load custom model
    //tf.ENV.set('WEBGL_PACK' , false);
    setModel(await tf.loadLayersModel("file://" + __dirname + path));
    console.log("Custom model loaded! " + path);
  } catch (err) {
    console.log("loading failed :", err);
  }
};

exports.startPrediction = startPrediction;
