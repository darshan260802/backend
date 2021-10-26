const connectToMongo = require('./dbConnect');
const express = require('express');

const app = express();
const port = 7000;

// using middleware to get data from request.body
app.use(express.json());

// calling connectToMongo function to connect to database
connectToMongo();

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


// listening at port 7000
app.listen(port, () => {
    console.log('App Started, Listening at port: '+port);
})
