const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const env = require('dotenv').config();

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

app.get('/inbox', (req, res) => {
    const { from, to, header, body } = req.body;
    console.log(req.query);

    const sql = `INSERT INTO mail (from, to, date, header, body) VALUES ("${req.body.from}", "${req.body.to}", NOW(), "${req.body.header}", "${req.body.body}")`;


    connection.query(sql, values, (err, result) => {
     if (err){
            console.log(err);
            return res.status(500).send(err);
     };
    return res.status(404).send();
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});