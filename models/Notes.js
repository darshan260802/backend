const mongoose = require('mongoose');
const {Schema} =  mongoose;


const NotesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        default: "General",
    },
    timeStamp:{
        type: Date,
        default: Date.now,
    },
});

const Notes = mongoose.model('notes', NotesSchema);
module.exports = Notes;