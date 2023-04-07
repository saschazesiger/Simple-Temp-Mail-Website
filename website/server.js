const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'aws.connect.psdb.cloud',
    user: '22vz40jhtiu8piz7gq3i',
    password: 'pscale_pw_m9bLGObNswx2cMBwJDqk6OcgrfOgcVRPh5qIsWxkdIU',
    database: 'mail',
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