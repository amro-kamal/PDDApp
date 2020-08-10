/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

const IMAGENET_CLASSES = {
  // 0: 'Black_rot',
  // 1: 'Esca_Black_Measles',
  // 2: 'Leaf_blight_Isariopsis',
  // 3: 'healthy'

  0: "Tomato___Bacterial_spot",
  1: "Tomato___Early_blight",
  2: "Tomato___healthy",
  3: "Tomato___Late_blight",
  4: "Tomato___Leaf_Mold",
  5: "Tomato___Septoria_leaf_spot",
  6: "Tomato___Spider_mites Two-spotted_spider_mite",
  7: "Tomato___Target_Spot",
  8: "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
};
module.exports = {
  IMAGENET_CLASSES: IMAGENET_CLASSES
};
