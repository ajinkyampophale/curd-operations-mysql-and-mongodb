const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const curdSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    prep_datetime: {
        type: Date
    },
    mod_datetime: {
        type: Date
    }
});

mongoose.model('user_details', curdSchema);
