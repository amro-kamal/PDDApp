const PLANTS_CLASSES = {
  0: "asc1", //'Apple___Apple_scab-1000',
  1: "abr1", //'Apple___Black_rot-1000',
  2: "acr1", //'Apple___Cedar_apple_rust-1000',
  3: "ah1", //'Apple___healthy-1645',
  4: "b0", //'Background_without_leaves-1143',
  5: "ccl2", //'Corn___Cercospora_leaf_spot Gray_leaf_spot-1000',
  6: "ccr2", //'Corn___Common_rust-1192',
  7: "cnlb2", //'Corn___Northern_Leaf_Blight-1000',
  8: "ch2", //'Corn___healthy-1162',
  9: "gbr3", //'Grape___Black_rot-1180',
  10: "gebm3", //'Grape___Esca_(Black_Measles)-1383',
  11: "glb3", //'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)-1076',
  12: "gh3", //'Grape___healthy-1000',
  13: "peb4", //'Potato___Early_blight-1000',
  14: "plb4", //'Potato___Late_blight-1000',
  15: "ph4", //'Potato___healthy-1000',
  16: "tbs5", //'Tomato___Bacterial_spot-2127',
  17: "teb5", //'Tomato___Early_blight-1000',
  18: "tlb5", //'Tomato___Late_blight-1776',
  19: "tlm5", //'Tomato___Leaf_Mold-952',
  20: "tsls5", //'Tomato___Septoria_leaf_spot-1771',
  21: "tsm5", //'Tomato___Spider_mites Two-spotted_spider_mite-1676',
  22: "tts5", //'Tomato___Target_Spot-1404',
  23: "tylcv5", //'Tomato___Tomato_Yellow_Leaf_Curl_Virus-5357',
  24: "tmv5", //'Tomato___Tomato_mosaic_virus-1000',
  25: "th5", //'Tomato___healthy-1591'
};

exports.PLANTS_CLASSES = PLANTS_CLASSES;

const idToName = {
  asc1: "Apple scab", //'Apple___Apple_scab-1000',
  abr1: "Black rot", //'Apple___Black_rot-1000',
  acr1: "Apple cedar rust", //'Apple___Cedar_apple_rust-1000',
  ah1: "Healthy", //'Apple___healthy-1645',
  ccl2: "Gray leaf spot", //'Corn___Cercospora_leaf_spot Gray_leaf_spot-1000',
  ccr2: "Common rust", //'Corn___Common_rust-1192',
  cnlb2: "northern leaf blight", //'Corn___Northern_Leaf_Blight-1000',
  ch2: "healthy", //'Corn___healthy-1162',
  gbr3: "Black rot", //'Grape___Black_rot-1180',
  gebm3: "Black Measles", //'Grape___Esca_(Black_Measles)-1383',
  glb3: "Isariopsis Leaf Spot", //'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)-1076',
  gh3: "Healthy", //'Grape___healthy-1000',
  peb4: "Early Blight", //'Potato___Early_blight-1000',
  plb4: "Late Blight", //'Potato___Late_blight-1000',
  ph4: "Healthy", //'Potato___healthy-1000',
  tbs5: "Bacterial Spot", //'Tomato___Bacterial_spot-2127',
  teb5: "Early Blight", //'Tomato___Early_blight-1000',
  tlb5: "Late Blight", //'Tomato___Late_blight-1776',
  tlm5: "Leaf Mold", //'Tomato___Leaf_Mold-952',
  tsls5: "Septoria Leaf spot", //'Tomato___Septoria_leaf_spot-1771',
  tsm5: "Spider mites", //'Tomato___Spider_mites Two-spotted_spider_mite-1676',
  tts5: "Target Spot", //'Tomato___Target_Spot-1404',
  tylcv5: "Yellow leaf curl virus", //'Tomato___Tomato_Yellow_Leaf_Curl_Virus-5357',
  tmv5: "mosaic virus", //'Tomato___Tomato_mosaic_virus-1000',
  th5: "healthy", //'Tomato___healthy-1591'
};

exports.idToName = idToName;
