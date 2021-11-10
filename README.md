# PDDApp

Plant disease Image Classifier using [Tensorflow/tfjs](https://github.com/tensorflow/tfjs) , Express.js as server framework, MongoDB as database.

The models were trained in python and then converted to a json file.

Tensorflowjs is used to read the CNN model (mobileNet, ResNet, Inception, etc) and then run it.

The server.js is the Nodejs server to host and run the model. Our second [repo](https://github.com/amro-kamal/Plant-App) contains the code for the Android app
that help you connect to the server to make classfications.


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





![image](https://user-images.githubusercontent.com/37993690/141181443-edfe76aa-ffc1-4b82-9eaa-2fdf8109e5f7.png)


