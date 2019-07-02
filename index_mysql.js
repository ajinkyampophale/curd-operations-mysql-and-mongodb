const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Joi = require('joi');
const cf = require('./middleware/common_functions_server.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(2).max(100).required().label('Username'),
    password: Joi.string().min(5).max(50).required().label('Password'),
    email_id: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(300).required().label('Email id')
});


app.get('/get_users', async (req, res) => {

    try {

        let results = await cf.return_results(`Select sr_id, username, email_id, password, 
        DATE_FORMAT(prep_datetime, '%d/%m/%Y %h:%i %p') as prep_datetime, 
        DATE_FORMAT(mod_datetime, '%d/%m/%Y %h:%i %p') as mod_datetime 
        from user_details order by prep_datetime DESC`);

        let send_results = [];

        if (results.length > 0) {

            results.map(element => {

                let { sr_id } = element;
                element.sr_id = cf.encrypt(sr_id);
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


app.post('/create_user', async (req, res) => {

    try {

        let err = await cf.validateJoi(req.body, schema);

        if (err) {
            return res.json({ status: 400, message: err });
        }

        let { username, email_id, password } = req.body;
        password = cf.encrypt(password);

        await cf.return_results(`Insert into user_details (username, email_id, password, prep_datetime) 
        values ('${username}', '${email_id}', '${password}', now())`);

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
        id = cf.decrypt(id);

        await cf.return_results(`Update user_details set username = '${username}', email_id = '${email_id}', 
        password = '${password}', mod_datetime = now() where sr_id = ${id}`);

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
        id = cf.decrypt(id);

        await cf.return_results(`DELETE from user_details where sr_id = ${id}`);

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