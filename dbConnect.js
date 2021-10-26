const mongoose = require('mongoose');

// mongo db connection uri
const mongoURI = "mongodb://localhost:27017/notebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

// A function to connect to db using mongoose
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('Mongo DB Connection Success!!')
    })
}

// Export connectToMongo Function
module.exports = connectToMongo;