const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Joi = require('joi');
const mongoose = require('mongoose');
const dateTime = require('node-datetime');
const cf = require('./middleware/common_functions_server.js');

//bring in the modal
require('./models/curd.js');
const user_details = mongoose.model('user_details');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/get_users', async (req, res) => {

    try {

        let results = await user_details.find({}).sort({ prep_datetime: 'desc' });

        let send_results = [];

        if (results.length > 0) {

            results.map(element => {

                let { prep_datetime } = element;
                element.prep_datetime = dateTime.create(prep_datetime).format('d/m/Y I:M p');
                send_results.push(element);
            });
        }

        res.json({ status: 200, message: 'Data fetched successfully!!', data: send_results });

    }
    catch (err) {
        console.log(err);
        res.json({ status: 400, message: 'Something went wrong. Please try after some time!!' })
    }

});

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(2).max(100).required().label('Username'),
    password: Joi.string().min(5).max(50).required().label('Password'),
    email_id: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(300).required().label('Email id')
});

app.post('/create_user', async (req, res) => {

    try {

        let err = await cf.validateJoi(req.body, schema);

        if (err) {
            return res.json({ status: 400, message: err });
        }

        let { username, email_id, password } = req.body;
        password = cf.encrypt(password);

        let curr_datetime = dateTime.create(new Date()).format('Y-m-d H:M:S');

        const newUser = { username, email_id, password, prep_datetime: curr_datetime };
        await new user_details(newUser).save();

        res.json({ status: 200, message: 'User created successfully!!' });

    }
    catch (err) {
        console.log(err);
        res.json({ status: 400, message: 'Something went wrong. Please try after some time!!' })
    }

});


app.put('/edit_user/:id', async (req, res) => {

    try {

        let err = await cf.validateJoi(req.body, schema);

        if (err) {
            return res.json({ status: 400, message: err });
        }

        let { username, email_id, password } = req.body;
        password = cf.encrypt(password);

        let { id } = req.params;
        let curr_datetime = dateTime.create(new Date()).format('Y-m-d H:M:S');

        let result = await user_details.findOne({ _id: id });
        result.username = username;
        result.email_id = email_id;
        result.password = password;
        result.mod_datetime = curr_datetime;
        await result.save();

        res.json({ status: 200, message: 'User updated successfully!!' });

    }
    catch (err) {
        console.log(err);
        res.json({ status: 400, message: 'Something went wrong. Please try after some time!!' });
    }

});


app.delete('/delete_user/:id', async (req, res) => {

    try {

        let { id } = req.params;
        await user_details.deleteOne({ _id: id });
        res.json({ status: 200, message: 'User deleted successfully!!' });
    }
    catch (err) {
        console.log(err);
        res.json({ status: 400, message: 'Something went wrong. Please try after some time!!' });
    }

});


process.on('uncaughtException', (err) => {
    console.log(err);
    res.json({ status: 400, message: 'Something went wrong. Please try after some time!!' });
});


process.on('unhandledRejection', (err) => {
    console.log(err);
    res.json({ status: 400, message: 'Something went wrong. Please try after some time!!' });
});


app.listen(3000);