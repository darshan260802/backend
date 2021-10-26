const connectToMongo = require('./dbConnect');
const express = require('express');

const app = express();

// calling connectToMongo function to connect to database
connectToMongo();

// Creating Endpoint / , request = incoming data, response = outgoing data
app.get('/',(request, response) => {
    response.send('Welcome To Our Website!');
})

// listening at port 7000
app.listen(7000, () => {
    console.log('App Started, Listening at port 7000');
})
