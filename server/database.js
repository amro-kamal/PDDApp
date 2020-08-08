const mongoose = require('mongoose');
const connection = "mongodb+srv://roronoamaeen@gmail.com:<hawkeyes.1>@<cluster>/<database>?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));