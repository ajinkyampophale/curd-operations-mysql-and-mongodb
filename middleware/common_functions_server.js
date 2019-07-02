const crypto = require('crypto');
const Joi = require('joi');
const { con } = require('./connect.js');


function checkempty(input) {

    if (input == '' || input == null || input == undefined) {
        return true;
    }
    else {
        return false;
    }

}

const ENCRYPTION_KEY = 'uKTFyukeCDXNhpXyXAfexhFiWyTLVSKIbwtGwpUsVJedFWGjAl';

function encrypt(text) {
    text = typeof text === 'string' ? text : text.toString();
    let cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


function return_results(query) {

    return new Promise((resolve, reject) => {

        con.query(query, (err, results) => {

            let obj = {};

            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }

        });

    });
}

function validateJoi(body, schema) {

    return new Promise((resolve, reject) => {

        Joi.validate(body, schema, function (err, value) {

            if (err) {
                resolve(err.details[0].message);
            }
            else {
                resolve(false);
            }
        });

    });

}

module.exports = {
    checkempty, encrypt, decrypt, return_results, validateJoi
}