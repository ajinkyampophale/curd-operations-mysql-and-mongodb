const mysql = require('mysql');
const mongoose = require('mongoose');

const con = mysql.createConnection({
    "host": "127.0.0.1",
    "port": "3306",
    "user": "username",
    "password": "password",
    "database": "db_curdoperations"
});

con.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log("Mysql connected...");
});

//connect to mongo db
mongoose_con = mongoose.connect('mongodb://localhost/db_curdoperations', { useNewUrlParser: true })
    .then(() => console.log('Mongo Connected'))
    .catch(err => console.log(err));

module.exports = { con, mongoose_con };