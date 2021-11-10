# PDDApp

Plant disease Image Classifier using [Tensorflow/tfjs](https://github.com/tensorflow/tfjs) , Express.js as server framework, MongoDB as database.

![image](https://user-images.githubusercontent.com/37993690/141179422-e804aa10-28b6-4ee5-a953-f9406ed129ed.png)


### Installing

Go to the root directory of the project and install the required

dependencies

```sh
npm install
```
then **start _mongoDB_ database server & shell**

finally, **hit**

```sh
npm run server
```


The models were trained in python and then converted to a json file. Tensorflowjs is used to read the CNN model (mobileNet, ResNet, Inception, etc) and then run.
