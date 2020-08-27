const upload = require("../multer/uploadImage.js");

const uploadFile = (req, res, next) => {
  try {
    upload(req, res);

    console.log("upload controller", req.file);
    if (req.file == undefined) {
      console.log("you must select a file");
      // return res.send(`You must select a file.`);
    }
    console.log("file has been uploafed");
    // return res.send(`File has been uploaded.`);
    next();
  } catch (error) {
    console.log("Error when trying upload image", error);
    // return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = {
  uploadFile: uploadFile,
};
