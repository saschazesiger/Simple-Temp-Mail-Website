const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const simpleParser = require('mailparser').simpleParser;


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: 3306,
    ssl: {}
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/inbox', async (req, res) => {

    if(req.body.key !== process.env.privatekey){
        return res.status(403).send();
    }



    const parsedbody = await simpleParser(req.body.body)
    console.log(parsedbody.subject);

    const sql = `INSERT INTO mail (sender, receiver, date, header, body) VALUES ("${req.body.from}", "${req.body.to}", NOW(), "${parsedbody.subject}", "${parsedbody.html}")`;
    

    connection.query(sql, (err, result) => {
     if (err){
            console.log(err);
            return res.status(500).send(err);
     };
    return res.status(404).send();
    });
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});



