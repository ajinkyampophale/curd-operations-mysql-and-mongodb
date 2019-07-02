Curd Operations MySQL and Mongodb.

This app includes curd operation's create(post), read(get), update(put) and delete(delete) built with Node.js for both MySQL and Mongodb Databases.
There is no frontend for this app only api call's (Use Postman to test).

Requirement: 
1. Node js
2. MySQL or MongoDB
3. Postman (Optional to test)

Steps To Run:
1. Download the project
2. Change Directory (cd) to the folder where you have downloaded the project.
3. Run following command (npm install) to install the dependencies.
4. Open the connect.js file located in the middleware folder.

5. If you are using MySQL:
    a) Change the username, password, host and port in connect.js file to your mysql server's configurations.
    b) Run the following two commands in MySQL gui or terminal to create database and table:
      i) CREATE SCHEMA `db_curdoperations` DEFAULT CHARACTER SET utf8 ;
      ii) CREATE TABLE `user_details` (
          `sr_id` mediumint(10) NOT NULL AUTO_INCREMENT,
          `username` varchar(200) DEFAULT NULL,
          `email_id` varchar(500) DEFAULT NULL,
          `password` varchar(500) DEFAULT NULL,
          `prep_datetime` datetime DEFAULT NULL,
          `mod_datetime` datetime DEFAULT NULL,
          PRIMARY KEY (`sr_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
     c) That's it now run "nodemon index_mysql" in your terminal and test using postman.
        
6. If you are using Mongodb:
  a) Change the dababase connection in connect.js file to your monngodb server's configurations.
  b) Start mongodb.
  c) That's it now run "nodemon index_mongodb" in your terminal and test using postman.


Build With:
1. Node.js
2. Express.js
3. MySQL
4. Mongodb
